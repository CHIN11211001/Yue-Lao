// ========================================
// 婚姻狀態 — 基於 2024 內政部戶政司統計
// ========================================
import type {
  MarriageStatus,
  GenderedDistribution,
  Gender,
  AgeRange,
  ConditionalProbabilityTable,
} from '../engine/types';

/**
 * 15 歲以上常住人口婚姻狀態分布
 * 資料來源：109 年人口及住宅普查 表 3-2 15歲以上常住人口之婚姻狀況
 */
export const MARRIAGE_DISTRIBUTION: GenderedDistribution<MarriageStatus> = {
  male: {
    single: 0.351,            // 未婚 35.1%
    married: 0.561,           // 有配偶或同居伴侶 56.1%
    divorced_widowed: 0.088,  // 離婚(含分居) + 喪偶 8.8%
  },
  female: {
    single: 0.280,            // 未婚 28.0%
    married: 0.547,           // 有配偶或同居伴侶 54.7%
    divorced_widowed: 0.173,  // 離婚(含分居) + 喪偶 17.3%
  },
};

/**
 * 按年齡階層劃分的婚姻狀態比例 (解決「選擇年齡後未婚率不應該固定」的問題)
 * 資料來源：109 年人口及住宅普查 表 3-2 15歲以上常住人口之婚姻狀況
 */
export const MARRIAGE_BY_AGE_CPT: Record<
  Gender,
  ConditionalProbabilityTable<AgeRange, MarriageStatus>
> = {
  male: {
    '<=20': { single: 0.997, married: 0.003, divorced_widowed: 0.000 },
    '21-25': { single: 0.966, married: 0.030, divorced_widowed: 0.004 },
    '26-30': { single: 0.841, married: 0.145, divorced_widowed: 0.014 },
    '31-35': { single: 0.588, married: 0.381, divorced_widowed: 0.030 },
    '36-40': { single: 0.368, married: 0.578, divorced_widowed: 0.054 }, // 0.053+0.001
    '41-45': { single: 0.244, married: 0.670, divorced_widowed: 0.086 }, // 0.084+0.002
    '46-50': { single: 0.164, married: 0.725, divorced_widowed: 0.111 }, // 0.107+0.004
    '50+':   { single: 0.0594, married: 0.7962, divorced_widowed: 0.1444 }, // 加權平均
  },
  female: {
    '<=20': { single: 0.993, married: 0.007, divorced_widowed: 0.000 },
    '21-25': { single: 0.924, married: 0.069, divorced_widowed: 0.007 },
    '26-30': { single: 0.732, married: 0.248, divorced_widowed: 0.020 },
    '31-35': { single: 0.421, married: 0.539, divorced_widowed: 0.040 }, // 0.038+0.002
    '36-40': { single: 0.244, married: 0.687, divorced_widowed: 0.069 }, // 0.064+0.005
    '41-45': { single: 0.179, married: 0.718, divorced_widowed: 0.103 }, // 0.092+0.011
    '46-50': { single: 0.143, married: 0.721, divorced_widowed: 0.136 }, // 0.114+0.022
    '50+':   { single: 0.0531, married: 0.6374, divorced_widowed: 0.3095 }, // 加權平均
  }
};

export const AGE_MARRIAGE_DISTRIBUTION = MARRIAGE_BY_AGE_CPT;
