// ========================================
// 婚姻狀態 — 基於 2024 內政部戶政司統計
// ========================================
import type { MarriageStatus, GenderedDistribution } from '../engine/types';

/**
 * 18 歲以上成年人婚姻狀態分布
 * 資料來源：內政部統計處 人口婚姻狀況統計
 * 
 * 台灣 25-44 歲未婚率已超過 40%，整體考量各年齡層
 */
export const MARRIAGE_DISTRIBUTION: GenderedDistribution<MarriageStatus> = {
  male: {
    single: 0.385,            // 未婚 38.5%
    married: 0.520,           // 已婚 52.0%
    divorced_widowed: 0.095,  // 離婚/喪偶 9.5%
  },
  female: {
    single: 0.315,            // 未婚 31.5%
    married: 0.540,           // 已婚 54.0%
    divorced_widowed: 0.145,  // 離婚/喪偶 14.5%
  },
};
