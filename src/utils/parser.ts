import { ALLERGY_MAP } from '../constants/allergies';
import { ParsedDish, ParsedNutrition, ParsedOrigin } from '../types';

/**
 * Parses raw DDISH_NM string into structured array of dishes with allergy codes and names
 */
export function parseDishName(ddishNm: string, userAllergies: number[] = []): ParsedDish[] {
  if (!ddishNm) return [];

  // Replace <br/> or <br> or \n with delimiter
  const rawItems = ddishNm
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

  return rawItems.map((raw) => {
    // Regex matches trailing allergy codes like (1.2.5.6.10) or (12)
    const allergyMatch = raw.match(/\(([\d\.]+)\)$/);
    let name = raw;
    let allergyCodes: number[] = [];

    if (allergyMatch) {
      const codeStr = allergyMatch[1];
      // Split by dot e.g. "1.2.5.6" => [1, 2, 5, 6]
      allergyCodes = codeStr
        .split('.')
        .map((num) => parseInt(num, 10))
        .filter((num) => !isNaN(num));

      // Remove the allergy code portion from the display name
      name = raw.substring(0, raw.lastIndexOf(allergyMatch[0])).trim();
    }

    const allergyNames = allergyCodes.map((code) => ALLERGY_MAP[code] || `${code}`);
    const isWarning = userAllergies.some((code) => allergyCodes.includes(code));

    return {
      raw,
      name,
      allergyCodes,
      allergyNames,
      isWarning,
    };
  });
}

/**
 * Parses NTR_INFO string into structured array
 */
export function parseNutritionInfo(ntrInfo?: string): ParsedNutrition[] {
  if (!ntrInfo) return [];

  const lines = ntrInfo
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const result: ParsedNutrition[] = [];

  for (const line of lines) {
    // Pattern e.g. "탄수화물(g) : 121.1" or "비타민A(R.E) : 146.1"
    const parts = line.split(':');
    if (parts.length >= 2) {
      const label = parts[0].trim();
      const val = parts[1].trim();

      // Extract unit inside parenthesis if present
      const unitMatch = label.match(/\((.*?)\)/);
      const unit = unitMatch ? unitMatch[1] : '';
      const cleanName = label.replace(/\(.*?\)/, '').trim();

      result.push({
        name: cleanName || label,
        value: val,
        unit,
      });
    }
  }

  return result;
}

/**
 * Parses ORPLC_INFO string into structured origin array
 */
export function parseOriginInfo(orplcInfo?: string): ParsedOrigin[] {
  if (!orplcInfo) return [];

  const lines = orplcInfo
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const result: ParsedOrigin[] = [];

  for (const line of lines) {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const item = parts[0].trim();
      const origin = parts.slice(1).join(':').trim();
      if (item && origin) {
        result.push({ item, origin });
      }
    }
  }

  return result;
}

/**
 * Formats YYYYMMDD into YYYY년 MM월 DD일 (요일)
 */
export function formatDateKorean(ymd: string): string {
  if (!ymd || ymd.length !== 8) return ymd;
  const year = ymd.substring(0, 4);
  const month = parseInt(ymd.substring(4, 6), 10);
  const day = parseInt(ymd.substring(6, 8), 10);

  const dateObj = new Date(parseInt(year, 10), month - 1, day);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = days[dateObj.getDay()];

  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
}

/**
 * Convert Date object to YYYYMMDD string
 */
export function dateToYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

/**
 * Convert YYYYMMDD string to YYYY-MM-DD for <input type="date">
 */
export function ymdToIsoDate(ymd: string): string {
  if (!ymd || ymd.length !== 8) return '';
  return `${ymd.substring(0, 4)}-${ymd.substring(4, 6)}-${ymd.substring(6, 8)}`;
}

/**
 * Convert YYYY-MM-DD from <input type="date"> to YYYYMMDD
 */
export function isoDateToYmd(iso: string): string {
  if (!iso) return '';
  return iso.replace(/-/g, '');
}
