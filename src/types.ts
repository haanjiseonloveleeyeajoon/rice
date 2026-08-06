export interface SchoolInfo {
  ATPT_OFCDC_SC_CODE: string; // 시도교육청코드
  ATPT_OFCDC_SC_NM: string;   // 시도교육청명
  SD_SCHUL_CODE: string;      // 표준학교코드
  SCHUL_NM: string;           // 학교명
  ENG_SCHUL_NM?: string;      // 영문학교명
  SCHUL_KND_SC_NM?: string;   // 학교종류명 (고등학교, 중학교 등)
  LCTN_SC_NM?: string;        // 소재지명
  ORG_RDNMA?: string;         // 도로명주소
  HMPG_ADRES?: string;        // 홈페이지주소
}

export interface MealRow {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  MMEAL_SC_CODE: string; // 1: 조식, 2: 중식, 3: 석식
  MMEAL_SC_NM: string;
  MLSV_YMD: string;
  MLSV_FGR?: number | string;
  DDISH_NM: string;
  ORPLC_INFO?: string;
  CAL_INFO?: string;
  NTR_INFO?: string;
  MLSV_FROM_YMD?: string;
  MLSV_TO_YMD?: string;
}

export interface ParsedDish {
  raw: string;
  name: string;
  allergyCodes: number[];
  allergyNames: string[];
  isWarning?: boolean;
}

export interface ParsedNutrition {
  name: string;
  value: string;
  unit: string;
}

export interface ParsedOrigin {
  item: string;
  origin: string;
}

export interface AllergyItem {
  code: number;
  name: string;
  icon?: string;
  description?: string;
}

export type ViewMode = 'daily' | 'monthly';
