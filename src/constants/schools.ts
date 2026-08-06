import { SchoolInfo } from '../types';

// Default school provided in the user request: 신도고등학교 (부산광역시교육청 C10 / 7150114)
export const DEFAULT_SCHOOL: SchoolInfo = {
  ATPT_OFCDC_SC_CODE: 'C10',
  ATPT_OFCDC_SC_NM: '부산광역시교육청',
  SD_SCHUL_CODE: '7150114',
  SCHUL_NM: '신도고등학교',
  SCHUL_KND_SC_NM: '고등학교',
  LCTN_SC_NM: '부산광역시',
  ORG_RDNMA: '부산광역시 해운대구 좌동순환로 64',
  HMPG_ADRES: 'http://shindo.hs.kr',
};

export const PRESET_SCHOOLS: SchoolInfo[] = [
  DEFAULT_SCHOOL,
  {
    ATPT_OFCDC_SC_CODE: 'B10',
    ATPT_OFCDC_SC_NM: '서울특별시교육청',
    SD_SCHUL_CODE: '7010569',
    SCHUL_NM: '경기고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '서울특별시',
    ORG_RDNMA: '서울특별시 강남구 영동대로 643',
  },
  {
    ATPT_OFCDC_SC_CODE: 'B10',
    ATPT_OFCDC_SC_NM: '서울특별시교육청',
    SD_SCHUL_CODE: '7010084',
    SCHUL_NM: '서울과학고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '서울특별시',
    ORG_RDNMA: '서울특별시 종로구 혜화로 63',
  },
  {
    ATPT_OFCDC_SC_CODE: 'C10',
    ATPT_OFCDC_SC_NM: '부산광역시교육청',
    SD_SCHUL_CODE: '7150658',
    SCHUL_NM: '부산소프트웨어마이스터고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '부산광역시',
    ORG_RDNMA: '부산광역시 강서구 가락대로 1393',
  },
  {
    ATPT_OFCDC_SC_CODE: 'J10',
    ATPT_OFCDC_SC_NM: '경기도교육청',
    SD_SCHUL_CODE: '7530851',
    SCHUL_NM: '판교고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '경기도',
    ORG_RDNMA: '경기도 성남시 분당구 판교원로 82',
  },
];

export const EDUCATION_OFFICES = [
  { code: 'B10', name: '서울특별시교육청' },
  { code: 'C10', name: '부산광역시교육청' },
  { code: 'D10', name: '대구광역시교육청' },
  { code: 'E10', name: '인천광역시교육청' },
  { code: 'F10', name: '광주광역시교육청' },
  { code: 'G10', name: '대전광역시교육청' },
  { code: 'H10', name: '울산광역시교육청' },
  { code: 'I10', name: '세종특별자치시교육청' },
  { code: 'J10', name: '경기도교육청' },
  { code: 'K10', name: '강원특별자치도교육청' },
  { code: 'M10', name: '충청북도교육청' },
  { code: 'N10', name: '충청남도교육청' },
  { code: 'P10', name: '전북특별자치도교육청' },
  { code: 'Q10', name: '전라남도교육청' },
  { code: 'R10', name: '경상북도교육청' },
  { code: 'S10', name: '경상남도교육청' },
  { code: 'T10', name: '제주특별자치도교육청' },
];
