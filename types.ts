export enum Category {
  CULTURE = "문화",
  STUDY = "스터디",
  SHOPPING = "쇼핑",
  FOOD = "음식",
  FREE = "무료",
  MOVIE = "영화",
  OTHER = "기타",
}

export interface DiscountInfo {
  id: string;
  description: string;
  conditions: string;
}

export interface Store {
  id:string;
  name: string;
  category: Category;
  address: string;
  contact?: string;
  latitude?: number; 
  longitude?: number;
  discounts: DiscountInfo[];
  imageUrl?: string;
  rating?: number; // 0-5
  operatingHours?: string;
}

export interface ReceiptData {
  id: string;
  storeName: string;
  items: string[];
  discountApplied: string;
  totalAmount: string;
  date: string;
  storeCategory?: Category;
}

export interface ModalState {
  isOpen: boolean;
  type: 'storeDetails' | 'aiRecommender' | 'receiptHistory' | 'favorites' | 'imageReceiptAnalysis' | 'recentlyViewed' | null;
  data?: Store | ReceiptData[] | Store[]; // Store for details, ReceiptData[] for history, Store[] for favorites
}

export interface NotificationMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ReceiptAnalysisResult {
  isReceipt: boolean; // true if analysis was successful, false if not a receipt or failed
  mainBenefit: string | null;
  recommendations: Store[];
  parsedData: ReceiptData | null; // Null if analysis failed or not a receipt
}