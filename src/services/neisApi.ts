import { MealRow, SchoolInfo } from '../types';

const BASE_URL = 'https://open.neis.go.kr/hub';

// In-memory cache for fast responses
const cacheMap = new Map<string, any>();

/**
 * Fetch school meal info for a specific date (YYYYMMDD)
 */
export async function fetchDailyMeals(
  atptCode: string,
  schoolCode: string,
  dateYmd: string,
  apiKey?: string
): Promise<{ meals: MealRow[]; message?: string }> {
  const cacheKey = `meal_daily_${atptCode}_${schoolCode}_${dateYmd}_${apiKey || 'default'}`;
  if (cacheMap.has(cacheKey)) {
    return cacheMap.get(cacheKey);
  }

  const params = new URLSearchParams({
    Type: 'json',
    ATPT_OFCDC_SC_CODE: atptCode,
    SD_SCHUL_CODE: schoolCode,
    MLSV_YMD: dateYmd,
  });

  if (apiKey && apiKey.trim()) {
    params.append('KEY', apiKey.trim());
  }

  try {
    const res = await fetch(`${BASE_URL}/mealServiceDietInfo?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`서버 응답 오류: ${res.status}`);
    }

    const data = await res.json();

    // Check RESULT code or structure
    if (data.RESULT) {
      // e.g. INFO-200: 해당하는 데이터가 없습니다.
      const result = { meals: [], message: data.RESULT.MESSAGE || '급식 정보가 없습니다.' };
      cacheMap.set(cacheKey, result);
      return result;
    }

    if (data.mealServiceDietInfo && data.mealServiceDietInfo[1]?.row) {
      const meals: MealRow[] = data.mealServiceDietInfo[1].row;
      const result = { meals };
      cacheMap.set(cacheKey, result);
      return result;
    }

    const result = { meals: [], message: '해당 날짜에 제공되는 급식 정보가 없습니다.' };
    cacheMap.set(cacheKey, result);
    return result;
  } catch (err: any) {
    console.error('Error fetching meals:', err);
    return { meals: [], message: err.message || '급식 정보를 불러오는데 실패했습니다.' };
  }
}

/**
 * Fetch school meal info for an entire month
 */
export async function fetchMonthlyMeals(
  atptCode: string,
  schoolCode: string,
  year: number,
  month: number,
  apiKey?: string
): Promise<{ mealsByDate: Record<string, MealRow[]>; message?: string }> {
  const monthStr = String(month).padStart(2, '0');
  const fromYmd = `${year}${monthStr}01`;
  
  // Get last day of month
  const lastDayNum = new Date(year, month, 0).getDate();
  const toYmd = `${year}${monthStr}${String(lastDayNum).padStart(2, '0')}`;

  const cacheKey = `meal_monthly_${atptCode}_${schoolCode}_${year}_${monthStr}_${apiKey || 'default'}`;
  if (cacheMap.has(cacheKey)) {
    return cacheMap.get(cacheKey);
  }

  const params = new URLSearchParams({
    Type: 'json',
    pSize: '100',
    ATPT_OFCDC_SC_CODE: atptCode,
    SD_SCHUL_CODE: schoolCode,
    MLSV_FROM_YMD: fromYmd,
    MLSV_TO_YMD: toYmd,
  });

  if (apiKey && apiKey.trim()) {
    params.append('KEY', apiKey.trim());
  }

  try {
    const res = await fetch(`${BASE_URL}/mealServiceDietInfo?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`서버 응답 오류: ${res.status}`);
    }

    const data = await res.json();
    const mealsByDate: Record<string, MealRow[]> = {};

    if (data.mealServiceDietInfo && data.mealServiceDietInfo[1]?.row) {
      const rows: MealRow[] = data.mealServiceDietInfo[1].row;
      rows.forEach((row) => {
        const ymd = row.MLSV_YMD;
        if (!mealsByDate[ymd]) {
          mealsByDate[ymd] = [];
        }
        mealsByDate[ymd].push(row);
      });
    }

    const result = { mealsByDate };
    cacheMap.set(cacheKey, result);
    return result;
  } catch (err: any) {
    console.error('Error fetching monthly meals:', err);
    return { mealsByDate: {}, message: err.message || '월간 급식 정보를 불러오는데 실패했습니다.' };
  }
}

/**
 * Search schools by keyword
 */
export async function searchSchools(
  keyword: string,
  officeCode?: string,
  apiKey?: string
): Promise<{ schools: SchoolInfo[]; message?: string }> {
  if (!keyword || keyword.trim().length < 2) {
    return { schools: [], message: '학교명을 2자 이상 입력해주세요.' };
  }

  const params = new URLSearchParams({
    Type: 'json',
    pIndex: '1',
    pSize: '50',
    SCHUL_NM: keyword.trim(),
  });

  if (officeCode) {
    params.append('ATPT_OFCDC_SC_CODE', officeCode);
  }

  if (apiKey && apiKey.trim()) {
    params.append('KEY', apiKey.trim());
  }

  try {
    const res = await fetch(`${BASE_URL}/schoolInfo?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`서버 응답 오류: ${res.status}`);
    }

    const data = await res.json();

    if (data.RESULT) {
      return { schools: [], message: data.RESULT.MESSAGE || '검색 결과가 없습니다.' };
    }

    if (data.schoolInfo && data.schoolInfo[1]?.row) {
      const schools: SchoolInfo[] = data.schoolInfo[1].row;
      return { schools };
    }

    return { schools: [], message: '검색 결과가 없습니다.' };
  } catch (err: any) {
    console.error('Error searching schools:', err);
    return { schools: [], message: '학교 검색에 실패했습니다.' };
  }
}
