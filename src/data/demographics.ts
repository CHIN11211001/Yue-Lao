// ========================================
// 人口統計數據 — 基於 2023-2024 內政部戶政司統計
// ========================================
import type { AgeRange, Distribution, Region } from '../engine/types';

/** 台灣總人口（2024 年約 2,340 萬） */
export const TOTAL_POPULATION = 23_400_000;

/** 性別比例 */
export const GENDER_RATIO = {
  male: 0.4955,
  female: 0.5045,
};

/**
 * 年齡分布（18 歲以上成年人口）
 * 基於 2024 內政部人口統計，18 歲以上約 1,980 萬
 */
export const ADULT_POPULATION = 19_800_000;

/** 成人年齡分布比例 (男性) */
export const AGE_DISTRIBUTION_MALE: Distribution<AgeRange> = {
  '18-24': 0.105,
  '25-29': 0.085,
  '30-34': 0.090,
  '35-39': 0.100,
  '40-44': 0.105,
  '45-49': 0.110,
  '50+': 0.405,
};

/** 成人年齡分布比例 (女性) */
export const AGE_DISTRIBUTION_FEMALE: Distribution<AgeRange> = {
  '18-24': 0.098,
  '25-29': 0.082,
  '30-34': 0.088,
  '35-39': 0.098,
  '40-44': 0.103,
  '45-49': 0.108,
  '50+': 0.423,
};

/** 區域人口分布 */
export const REGION_DISTRIBUTION: Distribution<Region> = {
  north: 0.455,    // 北部（雙北、基隆、桃園、新竹）
  central: 0.245,  // 中部（台中、苗栗、彰化、南投、雲林）
  south: 0.250,    // 南部（台南、高雄、嘉義、屏東）
  east_island: 0.050, // 東部與離島
};
