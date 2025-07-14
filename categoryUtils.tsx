import React from 'react';
import { Category } from './types';

export const CATEGORIES_WITH_INFO: Array<{
  key: Category;
  label: string;
  icon: React.ReactNode;
  color: string;
  promptHint: string;
}> = [
  { key: Category.FOOD, label: "음식", icon: <i className="fas fa-utensils"></i>, color: "text-orange-500", promptHint: "레스토랑, 카페, 분식점 학생 할인" },
  { key: Category.SHOPPING, label: "쇼핑", icon: <i className="fas fa-shopping-bag"></i>, color: "text-green-500", promptHint: "의류, 전자기기, 문구류 매장 학생 할인" },
  { key: Category.MOVIE, label: "영화", icon: <i className="fas fa-film"></i>, color: "text-red-500", promptHint: "영화관 학생 할인, 통신사 제휴" },
  { key: Category.CULTURE, label: "문화", icon: <i className="fas fa-theater-masks"></i>, color: "text-purple-500", promptHint: "공연장, 전시회, 박물관 학생 할인" },
  { key: Category.STUDY, label: "스터디", icon: <i className="fas fa-book-open"></i>, color: "text-blue-500", promptHint: "스터디 카페, 독서실, 온라인 강의 할인" },
  { key: Category.FREE, label: "무료", icon: <i className="fas fa-gift"></i>, color: "text-teal-500", promptHint: "무료 입장, 무료 체험, 증정 이벤트" },
  { key: Category.OTHER, label: "기타", icon: <i className="fas fa-ellipsis-h"></i>, color: "text-gray-500", promptHint: "기타 학생 할인" },
];

export const getCategoryInfo = (categoryKey: Category) => {
  return CATEGORIES_WITH_INFO.find(cat => cat.key === categoryKey) || CATEGORIES_WITH_INFO.find(cat => cat.key === Category.OTHER)!;
};
