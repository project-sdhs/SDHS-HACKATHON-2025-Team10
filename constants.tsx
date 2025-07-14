import React from "react";
import { Category, Store } from "./types";

export const GEMINI_MODEL_NAME = "gemini-2.5-flash";

export const STATIC_STORE_DATA: Store[] = [
  // 영화관 정보 추가
  {
    id: "cgv-yongsan-ipark-01",
    name: "CGV 용산아이파크몰",
    category: Category.MOVIE,
    address: "서울 용산구 한강대로23길 55 아이파크몰 6층",
    latitude: 37.5298,
    longitude: 126.9648,
    discounts: [
      {
        id: "d-movie-youth-01",
        description: "청소년 할인 요금 적용",
        conditions:
          "만 13세 ~ 만 18세 청소년 대상. 신분증 또는 학생증 제시가 필요할 수 있습니다. 자세한 요금은 CGV 앱/웹사이트에서 확인하세요.",
      },
    ],
    imageUrl: "/images/logo-cgv.png",
    rating: 4.8,
    operatingHours: "상영 시간에 따라 상이",
  },
  {
    id: "lotte-cinema-worldtower-01",
    name: "롯데시네마 월드타워",
    category: Category.MOVIE,
    address: "서울 송파구 올림픽로 300 롯데월드몰 5층",
    latitude: 37.5125,
    longitude: 127.1025,
    discounts: [
      {
        id: "d-movie-youth-02",
        description: "청소년 할인 요금 적용",
        conditions:
          "만 13세 ~ 만 18세 청소년 대상. 신분증 또는 학생증 제시가 필요할 수 있습니다. 자세한 요금은 롯데시네마 앱/웹사이트에서 확인하세요.",
      },
    ],
    imageUrl: "/images/logo-lotte-cinema.png",
    rating: 4.7,
    operatingHours: "상영 시간에 따라 상이",
  },
  {
    id: "megabox-coex-01",
    name: "메가박스 코엑스",
    category: Category.MOVIE,
    address: "서울 강남구 봉은사로 524 스타필드 코엑스몰 B1",
    latitude: 37.5126,
    longitude: 127.0591,
    discounts: [
      {
        id: "d-movie-youth-03",
        description: "청소년 할인 요금 적용",
        conditions:
          "만 13세 ~ 만 18세 청소년 대상. 신분증 또는 학생증 제시가 필요할 수 있습니다. 자세한 요금은 메가박스 앱/웹사이트에서 확인하세요.",
      },
    ],
    imageUrl: "/images/logo-megabox.png",
    rating: 4.6,
    operatingHours: "상영 시간에 따라 상이",
  },
  {
    id: "ku-cinematheque-01",
    name: "KU시네마테크",
    category: Category.MOVIE,
    address: "서울 광진구 능동로 120 건국대학교 예술문화관",
    latitude: 37.5407,
    longitude: 127.0794,
    discounts: [
      {
        id: "d-arthouse-student-01",
        description: "학생(초/중/고/대학생) 할인",
        conditions:
          "학생증 제시 필수. 예술/독립 영화를 저렴하게 관람할 수 있습니다. 홈페이지에서 상영작과 시간표를 확인하세요.",
      },
    ],
    imageUrl: "/images/ku-cinematheque-01.jpg",
    rating: 4.5,
    operatingHours: "상영 시간에 따라 상이",
  },
  {
    id: "cgv-gangnam-01",
    name: "CGV 강남",
    category: Category.MOVIE,
    address: "서울 강남구 강남대로 438",
    latitude: 37.4988,
    longitude: 127.028,
    discounts: [
      {
        id: "d-movie-youth-04",
        description: "청소년 할인 요금 적용",
        conditions:
          "만 13세 ~ 만 18세 청소년 대상. 신분증 또는 학생증 제시가 필요할 수 있습니다. 자세한 요금은 CGV 앱/웹사이트에서 확인하세요.",
      },
    ],
    imageUrl: "/images/CGVgang.jpg",
    rating: 4.7,
    operatingHours: "상영 시간에 따라 상이",
  },
  // 애슐리퀸즈 (Ashley Queens) - 용산
  {
    id: "ashley-yongsan-01",
    name: "애슐리퀸즈 아이파크몰 용산점",
    category: Category.FOOD,
    address: "서울 용산구 한강대로23길 55 아이파크몰",
    latitude: 37.5298,
    longitude: 126.9648,
    discounts: [
      {
        id: "d-ashley-01",
        description: "중/고/대학생 대상 '슐리데이' 프로모션",
        conditions:
          "학생증 제시 필수. 매월 마지막 주 화/수 등 특정일에 평일 런치 가격으로 이용 가능합니다. 방문 전 애슐리 공식 인스타그램(@ashley.queens_official) 또는 이랜드이츠 채널(@eland.eats)에서 이벤트 여부를 반드시 확인하세요.",
      },
    ],
    imageUrl: "/images/-yongashleysan-01.jpg",
    rating: 4.5,
    operatingHours: "11:00 - 21:00",
  },

  // 빕스 (VIPS) - 용산 (이태원)
  {
    id: "vips-itaewon-01",
    name: "빕스 이태원점",
    category: Category.FOOD,
    address: "서울 용산구 이태원로 177",
    latitude: 37.5348,
    longitude: 126.9945,
    discounts: [
      {
        id: "d-vips-01",
        description: "청소년(만 14~19세) 할인 요금제 상시 적용",
        conditions:
          "주문 시 청소년증 또는 나이를 증명할 수 있는 신분증을 제시하세요. 평일 런치/디너 및 주말에 성인보다 저렴한 '청소년 요금제'로 이용 가능합니다. 자세한 가격은 VIPS 공식 홈페이지를 참고하세요.",
      },
    ],
    imageUrl: "/images/vips-itaewon-01.png",
    rating: 4.4,
    operatingHours: "지점별 상이",
  },

  // 피자몰
  {
    id: "pizzamall-01",
    name: "피자몰 (Pizza Mall)",
    category: Category.FOOD,
    address: "전국 피자몰 뷔페형 매장",
    discounts: [
      {
        id: "d-pizzamall-01",
        description: "평일 저녁을 런치 가격으로 (중/고등학생)",
        conditions:
          "학생증/청소년증 제시 필수. 매월 마지막 주 화/수 등 특정일에 진행될 수 있으니 방문 전 피자몰 공식 인스타그램(@eland.eats) 또는 카카오톡 채널에서 이벤트 여부를 반드시 확인하세요. 타 할인/쿠폰과 중복 적용은 불가합니다.",
      },
    ],
    imageUrl: "/images/PizzaMall.jpg",
    rating: 4.3,
    operatingHours: "지점별 상이",
  },

  // 개별 피자 프랜차이즈
  {
    id: "mrpizza-01",
    name: "미스터피자",
    category: Category.FOOD,
    address: "전국 미스터피자 매장",
    discounts: [
      {
        id: "d-mrpizza-01",
        description: "시험 기간/방학 시즌 '학생 응원' 프로모션",
        conditions:
          "수능, 기말고사 등 시험 기간이나 방학 시즌에 학생 인증 시 할인 또는 사이드 메뉴 증정 이벤트를 자주 진행합니다. 상시 할인이 아니므로 공식 홈페이지나 앱을 통해 이벤트 정보를 확인하세요.",
      },
    ],
    imageUrl: "/images/MrPizza.png",
    rating: 4.2,
    operatingHours: "지점별 상이",
  },
  {
    id: "dominospizza-01",
    name: "도미노피자",
    category: Category.FOOD,
    address: "전국 도미노피자 매장",
    discounts: [
      {
        id: "d-dominospizza-01",
        description: "시험 기간/방학 시즌 '학생 응원' 프로모션",
        conditions:
          "수능, 기말고사 등 시험 기간이나 방학 시즌에 학생 인증 시 할인 또는 사이드 메뉴 증정 이벤트를 자주 진행합니다. 상시 할인이 아니므로 공식 홈페이지나 앱을 통해 이벤트 정보를 확인하세요.",
      },
    ],
    imageUrl: "/images/Dominos.png",
    rating: 4.5,
    operatingHours: "지점별 상이",
  },
  {
    id: "pizzahut-01",
    name: "피자헛",
    category: Category.FOOD,
    address: "전국 피자헛 매장",
    discounts: [
      {
        id: "d-pizzahut-01",
        description: "시험 기간/방학 시즌 '학생 응원' 프로모션",
        conditions:
          "수능, 기말고사 등 시험 기간이나 방학 시즌에 학생 인증 시 할인 또는 사이드 메뉴 증정 이벤트를 자주 진행합니다. 상시 할인이 아니므로 공식 홈페이지나 앱을 통해 이벤트 정보를 확인하세요.",
      },
    ],
    imageUrl: "/images/PizzaHut.jpg",
    rating: 4.3,
    operatingHours: "지점별 상이",
  },

  // 스타벅스 (Starbucks) - 용산
  {
    id: "starbucks-yongsan-ipark",
    name: "스타벅스 용산아이파크몰점",
    category: Category.FOOD,
    address: "서울 용산구 한강대로23길 55 아이파크몰",
    latitude: 37.5298,
    longitude: 126.9648,
    discounts: [
      {
        id: "d-starbucks-01",
        description: "'스튜던트 카드' 발급 시 음료 혜택",
        conditions:
          "대학(원)생 인증 후 '스튜던트 카드'를 발급받으면 학기 중 특정 음료 사이즈 업그레이드 또는 할인 혜택을 받을 수 있습니다. 시즌별로 혜택이 다르니 스타벅스 앱 또는 홈페이지를 확인하세요.",
      },
    ],
    imageUrl: "/images/Starbucks.png",
    rating: 4.8,
    operatingHours: "07:00 ~ 22:00",
  },
  {
    id: "starbucks-itaewon",
    name: "스타벅스 이태원역점",
    category: Category.FOOD,
    address: "서울 용산구 이태원로 187",
    latitude: 37.5348,
    longitude: 126.9945,
    discounts: [
      {
        id: "d-starbucks-01",
        description: "'스튜던트 카드' 발급 시 음료 혜택",
        conditions:
          "대학(원)생 인증 후 '스튜던트 카드'를 발급받으면 학기 중 특정 음료 사이즈 업그레이드 또는 할인 혜택을 받을 수 있습니다. 시즌별로 혜택이 다르니 스타벅스 앱 또는 홈페이지를 확인하세요.",
      },
    ],
    imageUrl: "/images/Starbucksitaewon.jpg",
    rating: 4.7,
    operatingHours: "07:00 ~ 22:00",
  },
  {
    id: "starbucks-sookmyung",
    name: "스타벅스 숙대입구역점",
    category: Category.FOOD,
    address: "서울 용산구 청파로47길 55",
    latitude: 37.545,
    longitude: 126.963,
    discounts: [
      {
        id: "d-starbucks-01",
        description: "'스튜던트 카드' 발급 시 음료 혜택",
        conditions:
          "대학(원)생 인증 후 '스튜던트 카드'를 발급받으면 학기 중 특정 음료 사이즈 업그레이드 또는 할인 혜택을 받을 수 있습니다. 시즌별로 혜택이 다르니 스타벅스 앱 또는 홈페이지를 확인하세요.",
      },
    ],
    imageUrl: "/images/starbuckssukdae.jpg",
    rating: 4.6,
    operatingHours: "07:00 ~ 22:00",
  },

  // 용산구 문화/여가 시설
  {
    id: "leeum-museum-01",
    name: "리움미술관",
    category: Category.CULTURE,
    address: "서울 용산구 이태원로55길 60-16",
    latitude: 37.5385,
    longitude: 126.9995,
    discounts: [
      {
        id: "d-leeum-01",
        description: "상설전시 무료, 기획전시 50% 할인",
        conditions:
          "만 24세 이하 또는 대학(원)생 대상. 신분증/학생증 필수. 온라인 사전 예매가 필요하며, 기획전시 할인은 방문일 기준으로 적용됩니다.",
      },
    ],
    imageUrl: "/images/riummuseum.png",
    rating: 4.8,
    operatingHours: "10:00 - 18:00 (월요일 휴관)",
  },
  {
    id: "national-museum-korea-01",
    name: "국립중앙박물관",
    category: Category.CULTURE,
    address: "서울 용산구 서빙고로 137",
    latitude: 37.524,
    longitude: 126.9804,
    discounts: [
      {
        id: "d-nat-museum-01",
        description: "상설전시 무료, 기획(특별)전시 청소년 할인",
        conditions:
          "상설전시는 전 연령 무료입니다. 만 24세 이하 청소년은 유료 특별전시 관람 시 할인 혜택을 받을 수 있습니다.",
      },
    ],
    imageUrl: "/images/nationalmuseum.jpg",
    rating: 4.9,
    operatingHours: "10:00 - 18:00 (요일별 연장 운영 확인)",
  },
  {
    id: "ntck-01",
    name: "국립극단",
    category: Category.CULTURE,
    address: "서울 용산구 청파로 373 (서계동)",
    latitude: 37.5516,
    longitude: 126.9631,
    discounts: [
      {
        id: "d-ntck-01",
        description: "'푸르티티켓'으로 15,000원에 공연 관람",
        conditions:
          "만 24세 이하 청소년/대학생 대상. 티켓 수령 시 학생증 등 증빙서류 확인이 필요합니다. 국립극단 홈페이지에서 예매 가능합니다.",
      },
    ],
    imageUrl: "/images/nationalact.png",
    rating: 4.6,
    operatingHours: "공연 일정에 따라 상이",
  },
  {
    id: "nseoul-tower-01",
    name: "N서울타워(남산타워)",
    category: Category.CULTURE,
    address: "서울 용산구 남산공원길 105",
    latitude: 37.5512,
    longitude: 126.9882,
    discounts: [
      {
        id: "d-nseoul-01",
        description: "전망대 입장권 청소년 요금 적용",
        conditions:
          "만 13세 ~ 18세 청소년 대상. 신분증 또는 학생증을 제시해야 합니다. 방문 전 공식 홈페이지에서 요금 정보를 확인하세요.",
      },
    ],
    imageUrl: "/images/Nseoul.jpg",
    rating: 4.5,
    operatingHours: "평일 10:30 - 22:30, 주말 10:00 - 23:00",
  },
  {
    id: "coex-aquarium-01",
    name: "코엑스 아쿠아리움",
    category: Category.CULTURE,
    address: "서울 강남구 영동대로 513 스타필드 코엑스몰",
    latitude: 37.513,
    longitude: 127.059,
    discounts: [
      {
        id: "d-aquarium-youth-01",
        description: "청소년 요금 상시 적용",
        conditions:
          "만 13세~18세 청소년은 할인된 요금으로 입장 가능합니다. 방문 시점에 따라 요금이 변동될 수 있으며, 수능 시즌 등 추가 프로모션이 있을 수 있으니 공식 홈페이지를 확인하세요.",
      },
    ],
    imageUrl: "/images/coexaqua.jpg",
    rating: 4.6,
    operatingHours: "10:00 - 20:00",
  },
  {
    id: "yongsan-youth-space-01",
    name: "용산청소년복합문화공간",
    category: Category.STUDY,
    address: "서울 용산구 원효로 89길 9 (원효)",
    latitude: 37.5397,
    longitude: 126.9633,
    discounts: [
      {
        id: "d-y-youth-01",
        description: "스터디룸 등 시설 무료 또는 저렴하게 이용",
        conditions:
          "최신 스터디카페처럼 꾸며진 '청소년공부방'을 무료 또는 500원~2,000원의 저렴한 비용으로 이용 가능합니다. 자세한 내용은 기관에 문의하세요.",
      },
    ],
    imageUrl: "/images/Teenculture.jpg",
    rating: 4.4,
    operatingHours: "시설별 상이, 문의 필요",
  },
  {
    id: "hangang-bball-01",
    name: "이촌 한강공원 농구장",
    category: Category.FREE,
    address: "서울 용산구 이촌로72길 62",
    latitude: 37.5147,
    longitude: 126.9763,
    discounts: [
      {
        id: "d-hangang-bball-01",
        description: "농구장 무료 이용",
        conditions:
          "예약 없이 선착순으로 자유롭게 이용 가능합니다. 조명 시설이 없는 경우가 많아 주간 이용을 추천합니다.",
      },
    ],
    imageUrl: "/images/basketball.jpg",
    rating: 4.7,
    operatingHours: "24시간 개방 (공원 규정에 따름)",
  },

  // 용산구 쇼핑/스터디 시설
  {
    id: "abc-mart-yongsan-01",
    name: "ABC마트 아이파크몰 용산점",
    category: Category.SHOPPING,
    address: "서울 용산구 한강대로23길 55 아이파크몰",
    latitude: 37.5298,
    longitude: 126.9648,
    discounts: [
      {
        id: "d-abcmart-01",
        description: "신학기/수능 시즌 10~20% 추가 할인",
        conditions: "학생증 제시 필수. 이벤트 기간(주로 2~3월, 11월)에 진행되므로 방문 전 공식 채널 확인이 필요합니다.",
      },
    ],
    imageUrl: "/images/ABC.png",
    rating: 4.4,
    operatingHours: "10:30 - 22:00",
  },
  {
    id: "shoemarker-yongsan-01",
    name: "슈마커 아이파크몰 용산점",
    category: Category.SHOPPING,
    address: "서울 용산구 한강대로23길 55 아이파크몰",
    latitude: 37.5298,
    longitude: 126.9648,
    discounts: [
      {
        id: "d-shoemarker-01",
        description: "신학기/수능 시즌 추가 할인 이벤트",
        conditions:
          "학생증 제시 필수. 이벤트 기간(주로 2~3월, 11월) 및 할인율은 매년 상이할 수 있으니 방문 전 확인이 필요합니다.",
      },
    ],
    imageUrl: "/images/shoemarker.png",
    rating: 4.3,
    operatingHours: "10:30 - 22:00",
  },
  {
    id: "spao-yongsan-01",
    name: "SPAO 아이파크몰 용산점",
    category: Category.SHOPPING,
    address: "서울 용산구 한강대로23길 55 아이파크몰",
    latitude: 37.5298,
    longitude: 126.9648,
    discounts: [
      {
        id: "d-spao-01",
        description: "신학기 시즌 맨투맨, 백팩 등 세트/품목 할인",
        conditions:
          "학생증 제시 필수. 이벤트 기간(주로 2~3월)에 진행됩니다. 자세한 내용은 공식 홈페이지나 매장에 문의하세요.",
      },
    ],
    imageUrl: "/images/spao.jpg",
    rating: 4.5,
    operatingHours: "10:30 - 22:00",
  },
  {
    id: "whoau-yongsan-01",
    name: "후아유 아이파크몰 용산점",
    category: Category.SHOPPING,
    address: "서울 용산구 한강대로23길 55 아이파크몰",
    latitude: 37.5298,
    longitude: 126.9648,
    discounts: [
      {
        id: "d-whoau-01",
        description: "신학기 시즌 프로모션 할인",
        conditions:
          "학생증 제시 필수. 이벤트 기간(주로 2~3월)에 진행됩니다. 자세한 내용은 공식 홈페이지나 매장에 문의하세요.",
      },
    ],
    imageUrl: "/images/WHOAU.jpg",
    rating: 4.4,
    operatingHours: "10:30 - 22:00",
  },
  {
    id: "nike-yongsan-01",
    name: "나이키 아이파크몰 용산점",
    category: Category.SHOPPING,
    address: "서울 용산구 한강대로23길 55 아이파크몰",
    latitude: 37.5298,
    longitude: 126.9648,
    discounts: [
      {
        id: "d-nike-01",
        description: "수능 수험생 대상 20~30% 할인",
        conditions: "수능 직후 이벤트 기간에 수험표 지참 시 할인 적용. 매년 정책이 달라질 수 있으니 방문 전 확인 필수.",
      },
    ],
    imageUrl: "images/Nike.jpg",
    rating: 4.7,
    operatingHours: "10:30 - 22:00",
  },
  {
    id: "adidas-yongsan-01",
    name: "아디다스 아이파크몰 용산점",
    category: Category.SHOPPING,
    address: "서울 용산구 한강대로23길 55 아이파크몰",
    latitude: 37.5298,
    longitude: 126.9648,
    discounts: [
      {
        id: "d-adidas-01",
        description: "수능 수험생 대상 20~30% 할인",
        conditions: "수능 직후 이벤트 기간에 수험표 지참 시 할인 적용. 매년 정책이 달라질 수 있으니 방문 전 확인 필수.",
      },
    ],
    imageUrl: "/images/Adidas.jpg",
    rating: 4.6,
    operatingHours: "10:30 - 22:00",
  },
  {
    id: "kyobo-yongsan-study-01",
    name: "교보문고 신용산점 (스터디)",
    category: Category.STUDY,
    address: "서울 용산구 한강대로 100 아모레퍼시픽",
    latitude: 37.5289,
    longitude: 126.9685,
    discounts: [
      {
        id: "d-kyobo-01",
        description: "청소년증 제시 시 도서/음반 10% 할인",
        conditions:
          "'청소년증' 제시 필수 (일반 학생증 X). 일부 품목은 제외될 수 있습니다. 상시 할인이므로 언제든 이용 가능합니다.",
      },
    ],
    imageUrl: "/images/Kyobo.jpg",
    rating: 4.5,
    operatingHours: "10:00 - 22:00",
  },
  {
    id: "kyobo-yongsan-shopping-01",
    name: "교보문고 신용산점 (쇼핑)",
    category: Category.SHOPPING,
    address: "서울 용산구 한강대로 100 아모레퍼시픽",
    latitude: 37.5289,
    longitude: 126.9685,
    discounts: [
      {
        id: "d-kyobo-02",
        description: "청소년증 제시 시 도서/음반 10% 할인",
        conditions:
          "'청소년증' 제시 필수 (일반 학생증 X). 일부 품목은 제외될 수 있습니다. 상시 할인이므로 언제든 이용 가능합니다.",
      },
    ],
    imageUrl: "/images/KyoboShopping.jpg",
    rating: 4.5,
    operatingHours: "10:00 - 22:00",
  },
  {
    id: "hottracks-yongsan-study-01",
    name: "핫트랙스 아이파크몰 용산점 (스터디)",
    category: Category.STUDY,
    address: "서울 용산구 한강대로23길 55 아이파크몰",
    latitude: 37.5298,
    longitude: 126.9648,
    discounts: [
      {
        id: "d-hottracks-01",
        description: "청소년증 제시 시 문구/음반 10% 할인",
        conditions:
          "'청소년증' 제시 필수 (일반 학생증 X). 일부 품목은 제외될 수 있습니다. 상시 할인이므로 언제든 이용 가능합니다.",
      },
    ],
    imageUrl: "/images/HottracksStudy.jpg",
    rating: 4.4,
    operatingHours: "10:30 - 22:00",
  },
  {
    id: "hottracks-yongsan-shopping-01",
    name: "핫트랙스 아이파크몰 용산점 (쇼핑)",
    category: Category.SHOPPING,
    address: "서울 용산구 한강대로23길 55 아이파크몰",
    latitude: 37.5298,
    longitude: 126.9648,
    discounts: [
      {
        id: "d-hottracks-02",
        description: "청소년증 제시 시 문구/음반 10% 할인",
        conditions:
          "'청소년증' 제시 필수 (일반 학생증 X). 일부 품목은 제외될 수 있습니다. 상시 할인이므로 언제든 이용 가능합니다.",
      },
    ],
    imageUrl: "/images/Hottracks.jpg",
    rating: 4.4,
    operatingHours: "10:30 - 22:00",
  },
];

// Placeholder for user preferences, in a real app this would be dynamic
export const MOCK_USER_PREFERENCES_PROMPT =
  "시험 기간에 공부하기 좋은 조용한 스터디 카페를 찾고 있어요. 음료 할인 혜택이 있으면 좋겠어요.";

export const APP_TITLE = "혜택:ON";
