
import React, { useState, useEffect, useCallback } from 'react';
import { Store, Category, ReceiptData, ModalState, DiscountInfo, NotificationMessage, ReceiptAnalysisResult } from './types';
import { getAiRecommendations, analyzeReceiptImage } from './services/geminiService';
import { MOCK_USER_PREFERENCES_PROMPT, APP_TITLE, STATIC_STORE_DATA } from './constants';
import { CATEGORIES_WITH_INFO, getCategoryInfo } from './categoryUtils';
import StoreCard from './components/StoreCard';
import Modal from './components/Modal';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import NotificationToast from './components/NotificationToast';
import { calculateDistance, fileToBase64 } from './utils';
import MenuBar from './components/MenuBar';
import ShopImage from './components/ShopImage';
import CenteredNotification from './components/CenteredNotification';


const ActionButton = ({ icon, text, onClick, colorClass, isLoading = false }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center space-y-2 text-center group" disabled={isLoading}>
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${colorClass} ${isLoading ? 'cursor-not-allowed bg-white/5' : ''}`}>
            {isLoading ? <LoadingSpinner size="sm" /> : <i className={`${icon} text-xl sm:text-2xl text-white`}></i>}
        </div>
        <span className="text-xs sm:text-sm font-medium text-white/90">{text}</span>
    </button>
);


const App: React.FC = () => {
  const [stores, setStores] = useState<Store[]>(STATIC_STORE_DATA);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, type: null });
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  
  const [aiRecommendations, setAiRecommendations] = useState<Store[]>([]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [userPreferencesInput, setUserPreferencesInput] = useState<string>('');
  const [aiRecommendationHasBeenRequested, setAiRecommendationHasBeenRequested] = useState<boolean>(false);

  const [receiptHistory, setReceiptHistory] = useState<ReceiptData[]>([]);

  const [selectedReceiptImageFile, setSelectedReceiptImageFile] = useState<File | null>(null);
  const [receiptImagePreviewUrl, setReceiptImagePreviewUrl] = useState<string | null>(null);
  const [isReceiptImageAnalyzing, setIsReceiptImageAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ReceiptAnalysisResult | null>(null);


  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [notification, setNotification] = useState<NotificationMessage | null>(null);
  const [centeredNotification, setCenteredNotification] = useState<string | null>(null);


  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [isNearbyModeActive, setIsNearbyModeActive] = useState<boolean>(false);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  
  const [activeView, setActiveView] = useState('explore');
  const [demoLocationState, setDemoLocationState] = useState<'off' | 'gangnam' | 'yongsan'>('off');


  const showNotification = (message: string, type: NotificationMessage['type']) => {
    setNotification({ id: crypto.randomUUID(), message, type });
  };

  useEffect(() => {
    const handleScroll = () => {
        setIsHeaderScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let result = [...stores]; 

    if (selectedCategory !== 'all') {
      result = result.filter(store => store.category === selectedCategory);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(store => 
        store.name.toLowerCase().includes(lowerSearchTerm) ||
        store.address.toLowerCase().includes(lowerSearchTerm) ||
        store.discounts.some(d => d.description.toLowerCase().includes(lowerSearchTerm))
      );
    }

    if (isNearbyModeActive && userLocation) {
      result = result
        .map(store => ({
          ...store,
          distance: store.latitude && store.longitude ? calculateDistance(userLocation.latitude, userLocation.longitude, store.latitude, store.longitude) : Infinity,
        }))
        .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    } else {
      result = result.map(store => {
        const { distance, ...rest } = store as (Store & { distance?: number });
        return rest;
      });
    }

    setFilteredStores(result);
  }, [stores, selectedCategory, searchTerm, isNearbyModeActive, userLocation]);


  useEffect(() => {
    const storedFavorites = localStorage.getItem('혜택ON_favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    const storedReceipts = localStorage.getItem('혜택ON_receiptHistory');
    if (storedReceipts) {
      setReceiptHistory(JSON.parse(storedReceipts));
    }
    const storedRecentlyViewed = localStorage.getItem('혜택ON_recentlyViewed');
    if (storedRecentlyViewed) {
      setRecentlyViewed(JSON.parse(storedRecentlyViewed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('혜택ON_favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  useEffect(() => {
    localStorage.setItem('혜택ON_receiptHistory', JSON.stringify(receiptHistory));
  }, [receiptHistory]);

  useEffect(() => {
    localStorage.setItem('혜택ON_recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);


  const DEMO_LOCATIONS = {
    gangnam: { latitude: 37.4979, longitude: 127.0276, name: '강남구(강남역)' },
    yongsan: { latitude: 37.5298, longitude: 126.9648, name: '용산구(용산역)' },
  };

  const handleLogoClick = () => {
    let nextState: 'off' | 'gangnam' | 'yongsan';
    
    switch (demoLocationState) {
      case 'off':
        nextState = 'gangnam';
        break;
      case 'gangnam':
        nextState = 'yongsan';
        break;
      case 'yongsan':
        nextState = 'off';
        break;
      default:
        nextState = 'off';
    }

    setDemoLocationState(nextState);

    if (nextState === 'off') {
      setUserLocation(null);
      setIsNearbyModeActive(false); // Also deactivate nearby mode
      setCenteredNotification("데모 위치가 해제되었습니다.");
    } else {
      const locationData = DEMO_LOCATIONS[nextState];
      setUserLocation({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      });
      // Do not activate nearby mode automatically
      setCenteredNotification(`데모: 위치가 ${locationData.name}(으)로 설정되었습니다.`);
    }
  };


  const handleSelectStore = (store: Store) => {
    setCurrentStore(store);
    setModalState({ isOpen: true, type: 'storeDetails', data: store });
    setActiveView('explore'); // 상세 정보는 explore의 일부로 간주
    
    setRecentlyViewed(prev => {
        const updatedList = [store.id, ...prev.filter(id => id !== store.id)];
        return updatedList.slice(0, 5); // 최대 5개까지 저장
    });
  };

  const handleAiRecommend = async (preferences: string) => {
    if (!preferences.trim()) {
        showNotification("추천을 받으려면 원하는 내용을 입력해주세요.", "info");
        return;
    }
    setAiRecommendationHasBeenRequested(true);
    setIsAiLoading(true);
    setAiRecommendations([]);
    try {
      // 항상 전체 가게 목록을 기반으로 추천하여 더 나은 결과를 제공
      const storesForRecommendation = stores;
      const recommendations = await getAiRecommendations(preferences, storesForRecommendation);
      if (recommendations.length > 0) {
        setAiRecommendations(recommendations);
        showNotification("AI 추천을 생성했습니다!", "success");
      } else {
        showNotification("AI가 현재 조건에 맞는 추천을 찾지 못했습니다.", "info");
      }
    } catch (err) {
      console.error(err);
      showNotification("AI 추천 생성 중 오류 발생.", "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleReceiptImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showNotification('이미지 파일만 업로드 가능합니다 (JPG, PNG 등).', 'error');
        setSelectedReceiptImageFile(null);
        setReceiptImagePreviewUrl(null);
        event.target.value = '';
        return;
      }
      setAnalysisResult(null); // Reset previous analysis when a new file is selected
      setSelectedReceiptImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedReceiptImageFile(null);
      setReceiptImagePreviewUrl(null);
    }
  };

  const handleAnalyzeReceiptImage = async () => {
    if (!selectedReceiptImageFile) {
        showNotification("분석할 영수증 이미지 파일을 선택해주세요.", "info");
        return;
    }
    setIsReceiptImageAnalyzing(true);
    setAnalysisResult(null); // Clear previous results before new analysis

    try {
        const base64Data = await fileToBase64(selectedReceiptImageFile);
        const result = await analyzeReceiptImage(base64Data, selectedReceiptImageFile.type, stores);

        if (result) {
            setAnalysisResult(result);
            if (result.isReceipt && result.parsedData) {
                setReceiptHistory(prev => [result.parsedData!, ...prev]);
                showNotification("영수증 분석 및 추천이 완료되었습니다.", "success");
            }
            // If !result.isReceipt, the modal UI will show the failure state. No toast needed.
        } else {
            // Handle null from service (API error, critical failure)
            showNotification("영수증 분석에 실패했습니다. 이미지나 네트워크를 확인해주세요.", "error");
            setAnalysisResult({
                isReceipt: false,
                mainBenefit: "AI 분석 서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
                recommendations: [],
                parsedData: null
            });
        }
    } catch (err) {
        console.error("Error analyzing receipt image:", err);
        showNotification("영수증 이미지 분석 중 클라이언트 오류가 발생했습니다.", "error");
        setAnalysisResult({
            isReceipt: false,
            mainBenefit: "분석 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
            recommendations: [],
            parsedData: null
        });
    } finally {
        setIsReceiptImageAnalyzing(false);
    }
  };


  const toggleFavorite = (storeId: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(storeId);
      if (isFav) {
        showNotification("찜 목록에서 삭제되었습니다.", "info");
        return prev.filter(id => id !== storeId);
      } else {
        showNotification("찜 목록에 추가되었습니다!", "success");
        return [...prev, storeId];
      }
    });
  };
  
  const closeModal = () => {
    const modalType = modalState.type;
    setModalState({ isOpen: false, type: null });
    
    // When a modal opened from the menu bar is closed, reset the view to 'explore'.
    // This will move the menu bar indicator back to the 'Explore' tab.
    if (['aiRecommender', 'favorites', 'imageReceiptAnalysis'].includes(modalType || '')) {
      setActiveView('explore');
    }

    if (modalType === 'imageReceiptAnalysis') {
        setSelectedReceiptImageFile(null);
        setReceiptImagePreviewUrl(null);
        setAnalysisResult(null);
    }
  };

  const handleToggleNearbyMode = () => {
    if (isNearbyModeActive) {
      setIsNearbyModeActive(false);
      showNotification("주변 검색 모드가 해제되었습니다.", "info");
      if (demoLocationState === 'off') {
        setUserLocation(null); // Only clear location if not in a demo state
      }
    } else {
      // Activating
      if (userLocation && demoLocationState !== 'off') {
        // If a demo location is already set, just activate the mode.
        setIsNearbyModeActive(true);
        showNotification(`데모 위치(${DEMO_LOCATIONS[demoLocationState].name}) 기준으로 정렬합니다.`, "success");
        return;
      }

      // Otherwise, get the user's real location
      setIsLocationLoading(true);
      setLocationError(null);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setIsNearbyModeActive(true);
            setIsLocationLoading(false);
            showNotification("사용자 위치를 확인했습니다. 주변 혜택을 정렬합니다.", "success");
          },
          (geoError: GeolocationPositionError) => { 
            let uiMessage = "위치 정보를 가져올 수 없습니다. ";
            switch (geoError.code) {
              case geoError.PERMISSION_DENIED: uiMessage += "위치 정보 접근 권한이 거부되었습니다."; break;
              case geoError.POSITION_UNAVAILABLE: uiMessage += "현재 위치를 확인할 수 없습니다."; break;
              case geoError.TIMEOUT: uiMessage += "위치 정보 요청 시간이 초과되었습니다."; break;
              default: uiMessage += (geoError.message || "알 수 없는 오류가 발생했습니다."); break;
            }
            setLocationError(uiMessage); 
            showNotification(uiMessage, "error");
            setIsLocationLoading(false);
            setIsNearbyModeActive(false); 
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      } else {
        const message = "이 브라우저에서는 위치 정보 서비스를 지원하지 않습니다.";
        setLocationError(message);
        showNotification(message, "error");
        setIsLocationLoading(false);
      }
    }
  };
  
  const handleMenuNavigate = (view: string) => {
    setActiveView(view);
    switch (view) {
      case 'explore':
        closeModal();
        setSelectedCategory('all');
        setSearchTerm('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'ai':
        setAiRecommendations([]); 
        setUserPreferencesInput(''); 
        setAiRecommendationHasBeenRequested(false);
        setModalState({ isOpen: true, type: 'aiRecommender' });
        break;
      case 'receiptAi':
        setAnalysisResult(null);
        setSelectedReceiptImageFile(null);
        setReceiptImagePreviewUrl(null);
        setModalState({ isOpen: true, type: 'imageReceiptAnalysis' });
        break;
      case 'favorites':
        setModalState({ isOpen: true, type: 'favorites' });
        break;
      default:
        break;
    }
  };

  const handleShowRecentlyViewed = () => {
    const viewedStores = recentlyViewed
      .map(id => stores.find(s => s.id === id))
      .filter((s): s is Store => s !== undefined);
    setModalState({ isOpen: true, type: 'recentlyViewed', data: viewedStores });
  };

    const handleShareStore = async (store: Store) => {
    if (!store) return;

    const appUrl = 'https://benefit-on-v2.vercel.app/';
    const shareMessage = `[혜택:ON 추천]
✨ ${store.name}

🎉 대표 혜택: ${store.discounts[0]?.description || '특별 할인'}
📍 위치: ${store.address}

더 많은 학생 할인을 혜택:ON에서 찾아보세요!`.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `[혜택:ON] ${store.name} 할인 정보`,
          text: shareMessage,
          url: appUrl,
        });
        // 성공 알림은 선택 사항. 네이티브 UI가 이미 피드백을 줌.
      } catch (error) {
        console.error('Web Share API 에러:', error);
        // 사용자가 공유를 취소한 경우 오류가 발생할 수 있으므로, 별도 알림을 띄우지 않음
      }
    } else {
      // Fallback: 클립보드에 복사
      const clipboardText = `${shareMessage}\n\n${appUrl}`;
      try {
        await navigator.clipboard.writeText(clipboardText);
        showNotification("혜택 정보와 링크가 복사되었습니다. 친구에게 붙여넣으세요!", 'success');
      } catch (err) {
        console.error('클립보드 복사 실패:', err);
        showNotification("정보 복사에 실패했습니다.", 'error');
      }
    }
  };

  const renderModalContent = () => {
    if (!modalState.isOpen) return null;

    switch (modalState.type) {
      case 'storeDetails':
        const store = modalState.data as Store & { distance?: number };
        if (!store) return null;
        const categoryInfo = getCategoryInfo(store.category);
        return (
          <div className="space-y-4 text-white/90">
            <ShopImage
              src={store.imageUrl}
              alt={store.name}
              seed={store.id}
              width={600}
              height={400}
              className="w-full h-64 object-cover rounded-lg mb-4 shadow-md"
            />
            <p className="text-sm">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-white/10`}>
                    <i className={`mr-1 ${categoryInfo.icon}`}></i> {store.category}
                </span>
            </p>
            {store.rating && (
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (<i key={i} className={`fa-star ${i < Math.round(store.rating!) ? 'fas' : 'far'}`}></i>))}
                <span className="ml-2 text-white/80 font-semibold">{store.rating.toFixed(1)} / 5.0</span>
              </div>
            )}
            <p><i className="fas fa-map-marker-alt text-white/60 mr-2"></i><strong>주소:</strong> {store.address}</p>
            {isNearbyModeActive && userLocation && typeof store.distance === 'number' && store.distance !== Infinity && (
                 <p className="text-sm text-blue-300"><i className="fas fa-route mr-2 text-blue-300/80"></i><strong>거리:</strong> 약 {store.distance.toFixed(1)}km</p>
            )}
            {store.contact && <p><i className="fas fa-phone text-white/60 mr-2"></i><strong>연락처:</strong> {store.contact}</p>}
            {store.operatingHours && <p><i className="fas fa-clock text-white/60 mr-2"></i><strong>운영시간:</strong> {store.operatingHours}</p>}
            <h4 className="font-semibold text-lg mt-3 text-white border-t border-white/20 pt-3">제공 혜택:</h4>
            <ul className="list-disc list-inside space-y-2">
              {store.discounts.map((d: DiscountInfo) => (
                <li key={d.id}>
                  <p className="font-medium text-indigo-200">{d.description}</p>
                  <p className="text-xs text-white/60 pl-4">└ 조건: {d.conditions}</p>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => toggleFavorite(store.id)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors text-white flex items-center justify-center ${favorites.includes(store.id) ? 'bg-red-500/50 hover:bg-red-500/70' : 'bg-white/10 hover:bg-white/20'}`}
              >
                <i className={`fas fa-heart mr-2 ${favorites.includes(store.id) ? 'text-red-300' : ''}`}></i>
                {favorites.includes(store.id) ? '찜 해제' : '찜하기'}
              </button>
              <button
                onClick={() => handleShareStore(store)}
                className="w-full bg-blue-500/80 hover:bg-blue-500/100 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <i className="fas fa-share-alt mr-2"></i> 공유하기
              </button>
            </div>
          </div>
        );
      case 'aiRecommender':
        return (
          <div className="space-y-4">
            <p className="text-sm text-white/80">원하는 할인 스타일이나 활동을 알려주시면 AI가 맞춤형 정보를 찾아드립니다!</p>
            <textarea
              className="w-full p-3 border border-white/20 rounded-md h-32 focus:ring-2 focus:ring-purple-400 bg-white/5 text-white placeholder-white/50"
              value={userPreferencesInput}
              onChange={(e) => setUserPreferencesInput(e.target.value)}
              placeholder="원하는 활동이나 필요한 물건을 알려주세요. (예: 강남역 근처에서 저렴한 점심 먹을 곳 추천해줘)"
            />
            <button
              onClick={() => handleAiRecommend(userPreferencesInput)}
              disabled={isAiLoading}
              className="w-full bg-purple-500/80 hover:bg-purple-500/100 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center transition-colors"
            >
              {isAiLoading ? <LoadingSpinner size="sm" /> : <><i className="fas fa-magic mr-2"></i>AI 추천받기</>}
            </button>

            {isAiLoading ? (
              <LoadingSpinner message="AI가 추천을 생성하는 중입니다..." />
            ) : aiRecommendations.length > 0 ? (
                <div className="mt-4">
                  <h4 className="font-semibold text-lg mb-2 text-white">추천 결과:</h4>
                  <ul className="space-y-2">
                    {aiRecommendations.map(recStore => (
                      <li key={recStore.id} className="p-3 bg-white/5 rounded-md hover:bg-white/10 cursor-pointer" onClick={() => { closeModal(); handleSelectStore(recStore);}}>
                        <p className="font-medium text-indigo-300">{recStore.name} <span className="text-xs text-white/60">({recStore.category})</span></p>
                        <p className="text-sm text-white/80 truncate">{recStore.discounts[0]?.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-6 text-white/70">
                    <p>추천 결과가 여기에 표시됩니다.</p>
                </div>
              )
            }
          </div>
        );
      case 'imageReceiptAnalysis':
        if (isReceiptImageAnalyzing) {
          return <LoadingSpinner message="AI가 영수증을 분석하고 추천을 생성 중입니다..." />;
        }
        if (analysisResult) {
          if (analysisResult.isReceipt === false) {
            return (
              <div className="text-center space-y-4 py-4">
                <i className="fas fa-exclamation-triangle text-5xl text-yellow-400"></i>
                <h4 className="text-xl font-bold text-white">인식 실패</h4>
                <p className="text-white/80">
                  {analysisResult.mainBenefit || "AI가 이미지를 영수증으로 인식하지 못했습니다. 더 선명한 영수증 사진으로 다시 시도해주세요."}
                </p>
                <div className="space-y-3 pt-4">
                  <button
                    onClick={handleAnalyzeReceiptImage}
                    disabled={isReceiptImageAnalyzing || !selectedReceiptImageFile}
                    className="w-full bg-blue-500/80 hover:bg-blue-500/100 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center transition-colors"
                  >
                    {isReceiptImageAnalyzing ? <LoadingSpinner size="sm"/> : <><i className="fas fa-sync-alt mr-2"></i>현재 이미지로 재시도</>}
                  </button>
                  <button
                    onClick={() => { setAnalysisResult(null); setSelectedReceiptImageFile(null); setReceiptImagePreviewUrl(null); }}
                    className="w-full bg-gray-600/80 hover:bg-gray-500/100 text-white font-semibold py-3 px-4 rounded-lg"
                  >
                    <i className="fas fa-camera mr-2"></i>다른 영수증 올리기
                  </button>
                </div>
              </div>
            );
          }
          
          return (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-white mb-3 flex items-center">
                  <i className="fas fa-check-circle text-green-400 mr-2"></i>지금 바로 받을 수 있는 혜택!
                </h4>
                <div className="glass-panel p-4 rounded-lg bg-black/20">
                  <p className="text-indigo-200">
                    {analysisResult.mainBenefit || "이 영수증에서는 특정 학생 할인을 찾지 못했습니다. 다음 방문 시 학생증을 제시해보세요!"}
                  </p>
                </div>
              </div>

              {analysisResult.recommendations.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold text-white mb-3 flex items-center">
                    <i className="fas fa-lightbulb text-yellow-400 mr-2"></i>이런 혜택은 어떠세요?
                  </h4>
                  <ul className="space-y-3">
                    {analysisResult.recommendations.map(recStore => (
                      <li key={recStore.id} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer flex items-center gap-4 transition-colors" onClick={() => { closeModal(); handleSelectStore(recStore); }}>
                        <ShopImage src={recStore.imageUrl} alt={recStore.name} seed={recStore.id} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                        <div className="flex-grow overflow-hidden">
                          <p className="font-semibold text-white truncate">{recStore.name}</p>
                          <p className="text-sm text-white/70 truncate">{recStore.discounts[0]?.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysisResult.parsedData && (
                   <details className="mt-4 bg-black/10 p-3 rounded-lg">
                      <summary className="cursor-pointer font-semibold text-white/80 hover:text-white">분석된 영수증 정보 보기</summary>
                      <div className="mt-2 space-y-1 text-sm text-white/70 border-t border-white/20 pt-2">
                         <p><strong>가게:</strong> {analysisResult.parsedData.storeName}</p>
                         <p><strong>총액:</strong> {analysisResult.parsedData.totalAmount}</p>
                         <p><strong>날짜:</strong> {analysisResult.parsedData.date}</p>
                         <p><strong>항목:</strong> {analysisResult.parsedData.items.join(', ')}</p>
                      </div>
                  </details>
              )}

              <button
                onClick={() => { setAnalysisResult(null); setSelectedReceiptImageFile(null); setReceiptImagePreviewUrl(null); }}
                className="w-full bg-blue-500/80 hover:bg-blue-500/100 text-white font-semibold py-3 px-4 rounded-lg mt-4"
              >
                다른 영수증 분석하기
              </button>
            </div>
          );
        }

        if (receiptImagePreviewUrl && selectedReceiptImageFile) {
            return (
                <div className="space-y-4 text-center">
                    <p className="text-sm text-white/80">선택된 이미지입니다. 아래 버튼을 눌러 분석을 시작하세요.</p>
                    <div className="mt-2 flex justify-center">
                        <img src={receiptImagePreviewUrl} alt="영수증 미리보기" className="max-h-60 w-auto rounded-md border border-white/20" />
                    </div>
                    <button
                        onClick={handleAnalyzeReceiptImage}
                        disabled={isReceiptImageAnalyzing}
                        className="w-full bg-cyan-500/80 hover:bg-cyan-500/100 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center transition-colors"
                    >
                        {isReceiptImageAnalyzing ? <LoadingSpinner size="sm" /> : <><i className="fas fa-magic mr-2"></i>분석 및 추천받기</>}
                    </button>
                    <button
                        onClick={() => { setSelectedReceiptImageFile(null); setReceiptImagePreviewUrl(null); }}
                        className="w-full bg-gray-600/80 hover:bg-gray-500/100 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                        <i className="fas fa-undo mr-2"></i>다른 이미지 선택
                    </button>
                </div>
            );
        }

        return (
          <div className="space-y-4">
            <p className="text-sm text-white/80">영수증을 촬영하거나 업로드하면 AI가 할인 내역을 분석하고, 숨겨진 혜택과 추가 할인 정보를 추천해 드립니다.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button
                    onClick={() => document.getElementById('receiptCameraUpload')?.click()}
                    className="p-4 bg-white/10 hover:bg-white/20 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors h-32"
                    aria-label="카메라로 영수증 촬영하기"
                >
                    <i className="fas fa-camera text-3xl text-white/80"></i>
                    <span className="font-semibold">카메라로 촬영</span>
                </button>
                <input
                    id="receiptCameraUpload"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleReceiptImageFileChange}
                    className="hidden"
                />

                <button
                    onClick={() => document.getElementById('receiptGalleryUpload')?.click()}
                    className="p-4 bg-white/10 hover:bg-white/20 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors h-32"
                    aria-label="갤러리에서 영수증 선택하기"
                >
                    <i className="fas fa-images text-3xl text-white/80"></i>
                    <span className="font-semibold">갤러리에서 선택</span>
                </button>
                <input
                    id="receiptGalleryUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptImageFileChange}
                    className="hidden"
                />
            </div>
          </div>
        );
      case 'receiptHistory':
         const history = modalState.data as ReceiptData[];
         return (
            <div className="space-y-3">
            {history.length === 0 ? <p className="text-white/80">등록된 영수증 내역이 없습니다.</p> :
              history.map(receipt => (
                <div key={receipt.id} className="p-3 bg-white/5 rounded-lg">
                  <p className="font-semibold text-white">{receipt.storeName} <span className="text-xs text-white/60">({getCategoryInfo(receipt.storeCategory || Category.OTHER).label})</span></p>
                  <p className="text-sm text-white/80">항목: {receipt.items.join(', ')}</p>
                  <p className="text-sm text-green-300">할인: {receipt.discountApplied}</p>
                  <p className="text-sm text-white font-medium">총액: {receipt.totalAmount}</p>
                  <p className="text-xs text-white/50 mt-1">날짜: {receipt.date}</p>
                </div>
              ))
            }
            </div>
         );
      case 'favorites':
        const favStores = stores.filter(s => favorites.includes(s.id));
        return (
            <div className="space-y-3">
            {favStores.length === 0 ? <p className="text-white/80">찜한 가게가 없습니다.</p> :
              favStores.map(store => (
                <div key={store.id} className="p-3 bg-white/5 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/10" onClick={() => { closeModal(); handleSelectStore(store); }}>
                  <div>
                    <p className="font-semibold text-indigo-300">{store.name} <span className="text-xs text-white/60">({getCategoryInfo(store.category).label})</span></p>
                    <p className="text-sm text-white/80 truncate">{store.discounts[0]?.description}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setFavorites(prev => prev.filter(id => id !== store.id)); showNotification("찜 목록에서 삭제되었습니다.", "info"); }} className="text-red-400 hover:text-red-300 text-lg p-1" aria-label="찜 해제">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              ))
            }
            </div>
        );
      case 'recentlyViewed':
        const recentStores = modalState.data as Store[];
        return (
            <div className="space-y-3">
            {recentStores.length === 0 ? <p className="text-white/80">최근에 본 혜택이 없습니다.</p> :
                recentStores.map(store => (
                    <div key={store.id} className="p-3 bg-white/5 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/10" onClick={() => { closeModal(); handleSelectStore(store); }}>
                        <div>
                            <p className="font-semibold text-indigo-300">{store.name} <span className="text-xs text-white/60">({getCategoryInfo(store.category).label})</span></p>
                            <p className="text-sm text-white/80 truncate">{store.discounts[0]?.description}</p>
                        </div>
                        <i className="fas fa-chevron-right text-white/50"></i>
                    </div>
                ))
            }
            </div>
        );
      default: return null;
    }
  };
  
  const getModalTitle = () => {
    switch (modalState.type) {
      case 'storeDetails': return (modalState.data as Store)?.name || "상세 정보";
      case 'aiRecommender': return "AI 맞춤 할인 추천";
      case 'imageReceiptAnalysis': return "영수증 AI 분석 & 추천";
      case 'receiptHistory': return "나의 혜택 내역";
      case 'favorites': return "찜한 가게 목록";
      case 'recentlyViewed': return "최근 본 혜택";
      default: return "";
    }
  };

  const isMenuBarVisible = !modalState.isOpen || 
    (modalState.type === 'favorites') ||
    (modalState.type === 'aiRecommender' && !aiRecommendationHasBeenRequested) ||
    (modalState.type === 'imageReceiptAnalysis' && !isReceiptImageAnalyzing);


  return (
    <div className="min-h-screen text-white pb-32 sm:pb-24">
      <Header 
        isScrolled={isHeaderScrolled}
        onShowFavorites={() => handleMenuNavigate('favorites')}
        onShowReceiptHistory={() => setModalState({ isOpen: true, type: 'receiptHistory', data: receiptHistory })}
        favoriteCount={favorites.length}
        onLogoClick={handleLogoClick}
      />
      <NotificationToast notification={notification} onDismiss={() => setNotification(null)} />
      <CenteredNotification message={centeredNotification} onClose={() => setCenteredNotification(null)} />


      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="glass-panel rounded-3xl p-6 mb-8">
          <div className="flex flex-col items-center text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-1">학생 맞춤 할인 혜택</h2>
              <p className="text-white/80">다양한 조건으로 할인 혜택을 찾아보세요!</p>
          </div>
          
          <div className="flex items-center justify-around flex-wrap gap-y-4 px-4">
              <ActionButton icon="fas fa-location-arrow" text="내 주변 혜택" onClick={handleToggleNearbyMode} colorClass={isNearbyModeActive ? 'bg-blue-500/80' : 'bg-white/10'} isLoading={isLocationLoading} />
              <ActionButton icon="fas fa-magic" text="AI 추천" onClick={() => handleMenuNavigate('ai')} colorClass="bg-white/10" />
              <ActionButton icon="fas fa-receipt" text="영수증 분석" onClick={() => handleMenuNavigate('receiptAi')} colorClass="bg-white/10" />
              <ActionButton icon="fas fa-history" text="최근 본 내역" onClick={handleShowRecentlyViewed} colorClass="bg-white/10" />
          </div>

          <div className="mt-6">
            <input 
              type="text"
              placeholder="가게 이름, 주소, 테마 검색..."
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none placeholder-white/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {locationError && <p className="text-red-400 text-sm mt-2 text-center">{locationError}</p>}
           {isNearbyModeActive && !locationError && userLocation && (
            <p className="text-blue-300 text-sm mt-2 text-center">
              <i className="fas fa-check-circle mr-1"></i>내 주변 기준으로 정렬되었습니다.
            </p>
          )}
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2 items-center justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors glass-panel ${selectedCategory === 'all' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
          >
            <i className="fas fa-list-ul mr-2"></i>전체
          </button>
          {CATEGORIES_WITH_INFO.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center glass-panel ${selectedCategory === cat.key ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
            >
              <span className={`mr-2 ${cat.color}`}>{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>
        
        {isLoading && <LoadingSpinner message="할인 정보를 불러오는 중입니다..."/>}
        {!isLoading && error && <p className="text-center text-red-400 text-lg">{error}</p>}
        
        {!isLoading && !error && filteredStores.length === 0 && (
          <div className="text-center py-10 glass-panel rounded-2xl">
            <i className="fas fa-ghost text-5xl text-white/50 mb-4"></i>
            <p className="text-xl text-white/80">선택한 조건에 맞는 할인 정보가 없습니다.</p>
            <p className="text-sm text-white/60 mt-1">다른 카테고리나 검색어를 사용해보세요.</p>
          </div>
        )}

        {!isLoading && !error && filteredStores.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStores.map(store => (
              <StoreCard 
                key={store.id} 
                store={store as Store & { distance?: number }}
                onSelectStore={handleSelectStore}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.includes(store.id)}
                showDistance={isNearbyModeActive && userLocation && typeof (store as Store & { distance?: number }).distance === 'number'}
                distance={(store as Store & { distance?: number }).distance}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-white/60 text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} {APP_TITLE}. All rights reserved.</p>
        <p>학생들의 스마트한 소비 생활을 응원합니다!</p>
      </footer>

      {modalState.isOpen && (
        <Modal 
            isOpen={modalState.isOpen} 
            onClose={closeModal} 
            title={getModalTitle()}
            size={(modalState.type === 'storeDetails' || modalState.type === 'imageReceiptAnalysis') ? 'lg' : 'md'}
        >
          {renderModalContent()}
        </Modal>
      )}

      {isMenuBarVisible && (
        <MenuBar 
          activeView={activeView}
          onNavigate={handleMenuNavigate}
          favoriteCount={favorites.length}
        />
      )}
    </div>
  );
};

export default App;
