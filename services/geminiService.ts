
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Store, ReceiptData, Category, DiscountInfo, ReceiptAnalysisResult } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

// Vite exposes environment variables on `import.meta.env`
const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  console.error("VITE_API_KEY is not set. Please set the environment variable in your .env file or hosting provider.");
  // You might want to throw an error or handle this more gracefully
}
const ai = new GoogleGenAI({ apiKey: API_KEY! });

const parseJsonFromText = <T,>(text: string): T | null => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "Original text:", text);
    try {
      // Attempt to fix common JSON errors like trailing commas
      jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1'); // Remove trailing commas before a closing bracket or brace
      return JSON.parse(jsonStr) as T;
    } catch (e2) {
      console.error("Failed to parse JSON response after attempting to fix trailing commas:", e2, "Original text:", jsonStr);
      return null;
    }
  }
};

export const getAiRecommendations = async (userPreferences: string, availableStores: Store[]): Promise<Store[]> => {
  if (!availableStores || availableStores.length === 0) return [];

  // BUG FIX: Added store ID to the text so the model knows which ID to return.
  const storeListText = availableStores
    .map(s => `- ID: "${s.id}", 이름: "${s.name}", 카테고리: "${s.category}", 주소: "${s.address}", 혜택: "${s.discounts.map(d => d.description).join(', ')}"`)
    .join('\n');

  const prompt = `
  사용자의 선호도는 다음과 같습니다: "${userPreferences}"

  아래는 전체 상점 목록입니다:
  ${storeListText}

  사용자의 선호도와 상점 목록을 바탕으로, 가장 관련성 높은 상점 3개를 추천해주세요.
  결과는 반드시 추천하는 상점의 "ID" 값만 포함하는 JSON 배열 형식이어야 합니다.

  예시 JSON 출력:
  ["store-id-1", "store-id-2", "store-id-3"]
  
  다른 설명 없이 JSON 배열만 반환하세요.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          },
          description: "An array of recommended store IDs."
        }
      }
    });
    
    const recommendedStoreIds = parseJsonFromText<string[]>(response.text);

    if (recommendedStoreIds && Array.isArray(recommendedStoreIds)) {
      const recommendedStores = recommendedStoreIds
        .map(id => availableStores.find(store => store.id === id))
        .filter((store): store is Store => store !== undefined);
      
      return recommendedStores;
    }
    
    console.error("AI 추천 응답이 올바르지 않거나 ID 배열을 파싱할 수 없습니다:", response.text);
    return [];
  } catch (error) {
    console.error("AI 추천을 가져오는 중 오류 발생:", error);
    return [];
  }
};

export const analyzeReceiptImage = async (base64ImageData: string, mimeType: string, availableStores: Store[]): Promise<ReceiptAnalysisResult | null> => {
  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64ImageData,
    },
  };

  const storeListText = availableStores
    .map(s => `- ID: "${s.id}", 이름: "${s.name}", 카테고리: "${s.category}", 주소: "${s.address}", 혜택: "${s.discounts.map(d => d.description).join(', ')}"`)
    .join('\n');

  const textPart = {
    text: `
    당신은 영수증 분석 전문가 AI입니다.
    먼저, 주어진 이미지가 영수증인지 아닌지 판단해주세요.

    1.  **이미지가 영수증이 아닌 경우**:
        다른 설명 없이 다음 JSON 객체만 반환해주세요.
        \`\`\`json
        {
          "isReceipt": false
        }
        \`\`\`

    2.  **이미지가 영수증인 경우**:
        이미지를 분석하고, 아래 제공된 전체 상점 목록을 참고하여 다음 작업을 수행하고, 모든 결과를 단일 JSON 객체로만 응답해주세요.

        **전체 상점 목록 (참고용)**:
        ${storeListText}

        **작업**:
        - **영수증 파싱**: 이미지에서 상점 이름(storeName), 구매 품목(items), 적용된 할인(discountApplied), 총 결제 금액(totalAmount), 날짜(date, 'YYYY-MM-DD' 형식)를 추출하고, 상점 카테고리(storeCategory)를 추정해주세요. 카테고리는 다음 중 하나여야 합니다: ${Object.values(Category).join(', ')}.
        - **핵심 혜택 분석 (지금 바로 받을 수 있는 혜택)**:
          - **우선순위 1: 사용된 혜택 확인**: 영수증 텍스트에 '마일리지', '포인트 사용', '멤버십 적립' 등 이미 혜택이 적용되었음을 명확히 나타내는 문구가 있는지 확인해주세요. 만약 있다면, 'mainBenefit'에 "마일리지 등록 완료! 혜택을 이미 받으셨습니다." 라고 설정하고 다른 혜택 분석은 중단하세요.
          - **우선순위 2: 사용 가능한 혜택 찾기**: 위 조건에 해당하지 않는 경우, 영수증에 인쇄된 **모든 텍스트**를 꼼꼼하게 분석해주세요. **학생 할인에 국한하지 말고**, '설문조사 참여 시 무료 업그레이드', '영수증 하단 쿠폰 제시 시 감자튀김 증정' 등 사용자가 앞으로 활용할 수 있는 모든 종류의 프로모션, 쿠폰, 이벤트 정보를 찾아 'mainBenefit'으로 추출해야 합니다. 
          - **결과 형식**: 혜택 내용은 영수증 원문을 그대로 복사하지 말고, 핵심을 간결하게 요약해서 한두 문장으로 설명해주세요.
          - **혜택 없음**: 위 두 경우에 모두 해당하지 않아 어떠한 할인이나 혜택 정보도 찾을 수 없다면, 이 항목에 null을 반환하세요.
        - **대안 혜택 추천 (이런 혜택은 어떠세요?)**: 영수증의 상점, 카테고리, 또는 구매 품목을 기반으로, '전체 상점 목록'에서 학생들에게 유용할 만한 다른 상점 2개를 추천해주세요. 추천하는 상점의 "ID"를 반환해야 합니다.

        **JSON 형식**:
        \`\`\`json
        {
          "isReceipt": true,
          "parsedData": {
            "storeName": "분석된 상점 이름",
            "items": ["품목1", "품목2"],
            "discountApplied": "분석된 할인 내역",
            "totalAmount": "총액",
            "date": "YYYY-MM-DD",
            "storeCategory": "음식"
          },
          "mainBenefit": "마일리지 등록 완료! 혜택을 이미 받으셨습니다.",
          "recommendedStoreIds": ["store-id-1", "store-id-2"]
        }
        \`\`\`
    `,
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: { parts: [imagePart, textPart] },
      config: { responseMimeType: "application/json" }
    });
    
    const rawJsonText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();

    const result = parseJsonFromText<{
      isReceipt: boolean;
      parsedData?: Omit<ReceiptData, 'id'>;
      mainBenefit?: string | null;
      recommendedStoreIds?: string[];
    }>(rawJsonText);
    
    if (!result) {
        console.error("Failed to parse JSON response from AI:", response.text);
        return null;
    }

    if (result.isReceipt === false) {
        return { isReceipt: false, mainBenefit: null, recommendations: [], parsedData: null };
    }
    
    if (result.isReceipt === true && result.parsedData && result.recommendedStoreIds) {
      const recommendations = result.recommendedStoreIds
        .map(id => availableStores.find(store => store.id === id))
        .filter((store): store is Store => store !== undefined);
      
      const finalParsedData: ReceiptData = {
          ...result.parsedData,
          id: crypto.randomUUID(),
          date: result.parsedData.date || new Date().toISOString().split('T')[0],
          storeCategory: result.parsedData.storeCategory && Object.values(Category).includes(result.parsedData.storeCategory) ? result.parsedData.storeCategory : Category.OTHER,
          items: result.parsedData.items || [],
      };

      return {
        isReceipt: true,
        parsedData: finalParsedData,
        mainBenefit: result.mainBenefit || null,
        recommendations: recommendations,
      };
    }
    
    console.error("AI response was malformed or incomplete:", response.text);
    return null;
  } catch (error) {
    console.error("Error analyzing receipt image:", error);
    return null;
  }
};
