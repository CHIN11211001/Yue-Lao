// ========================================
// 體重數據 — 基於國健署國民營養健康狀況變遷調查推估
// ========================================
import type { WeightRange, GenderedDistribution } from '../engine/types';

/**
 * 體重分布（成年人）
 * 考量BMI與身高分布，粗略切分體重區間
 */
export const WEIGHT_DISTRIBUTION: GenderedDistribution<WeightRange> = {
  male: {
    '<45kg': 0.01,
    '45-55kg': 0.04,
    '55-65kg': 0.25,
    '65-75kg': 0.35,  // 眾數區間
    '75-85kg': 0.22,
    '85-95kg': 0.09,
    '95kg+': 0.04,
  },
  female: {
    '<45kg': 0.10,
    '45-55kg': 0.40,  // 眾數區間
    '55-65kg': 0.28,
    '65-75kg': 0.14,
    '75-85kg': 0.05,
    '85-95kg': 0.02,
    '95kg+': 0.01,
  },
};
