import { AllergyItem } from '../types';

export const ALLERGY_LIST: AllergyItem[] = [
  { code: 1, name: '난류', description: '가금류 계란, 메추리알 등' },
  { code: 2, name: '우유', description: '우유 및 유제품' },
  { code: 3, name: '메밀', description: '메밀 함유 식품' },
  { code: 4, name: '땅콩', description: '땅콩 및 견과류' },
  { code: 5, name: '대두', description: '콩 및 두부, 된장, 간장' },
  { code: 6, name: '밀', description: '밀가루, 면류, 빵류' },
  { code: 7, name: '고등어', description: '고등어 및 등푸른 생선' },
  { code: 8, name: '게', description: '게 및 갑각류' },
  { code: 9, name: '새우', description: '새우 및 갑각류' },
  { code: 10, name: '돼지고기', description: '돼지고기 및 수육, 햄' },
  { code: 11, name: '복숭아', description: '복숭아' },
  { code: 12, name: '토마토', description: '토마토 및 케첩' },
  { code: 13, name: '아황산류', description: '건조과일, 와인, 산화방지제' },
  { code: 14, name: '호두', description: '호두 및 견과류' },
  { code: 15, name: '닭고기', description: '닭고기 및 치킨' },
  { code: 16, name: '쇠고기', description: '쇠고기 및 사골, 불고기' },
  { code: 17, name: '오징어', description: '오징어 및 문어' },
  { code: 18, name: '조개류', description: '굴, 전복, 홍합 등 조개류' },
  { code: 19, name: '잣', description: '잣' },
];

export const ALLERGY_MAP: Record<number, string> = ALLERGY_LIST.reduce((acc, item) => {
  acc[item.code] = item.name;
  return acc;
}, {} as Record<number, string>);
