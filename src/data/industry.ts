// ========================================
// 產業/職業分布 — 基於主計總處行業別受僱員工統計
// ========================================
import type { Industry, GenderedDistribution } from '../engine/types';

/**
 * 產業分布
 * 依據性別有顯著差異（如科技業男多、醫療教育女多）
 */
export const INDUSTRY_DISTRIBUTION: GenderedDistribution<Industry> = {
  male: {
    tech_it: 0.18,          // 科技資訊業
    manufacturing: 0.30,    // 製造業與營造業
    finance: 0.06,          // 金融保險
    medical: 0.03,          // 醫療保健
    public_edu: 0.08,       // 軍公教/教育
    service_retail: 0.20,   // 服務餐飲零售
    other: 0.15,            // 其他
  },
  female: {
    tech_it: 0.08,
    manufacturing: 0.15,
    finance: 0.12,
    medical: 0.12,
    public_edu: 0.15,
    service_retail: 0.28,
    other: 0.10,
  },
};
