// ========================================
// 機率計算模組
// ========================================
import type { Distribution } from './types';

/**
 * 計算選中項目在分布中佔的總比例
 * @param distribution 分布數據
 * @param selected 選中的項目
 * @returns 合計比例 (0-1)
 */
export function sumSelectedProbability<T extends string>(
  distribution: Distribution<T>,
  selected: T[]
): number {
  if (selected.length === 0) return 1; // 未選 = 不限制 = 100%
  return selected.reduce((sum, key) => sum + (distribution[key] || 0), 0);
}

/**
 * 計算多條件的聯合機率（獨立假設）
 * @param probabilities 各維度的個別機率
 * @returns 聯合機率
 */
export function calculateJointProbability(probabilities: number[]): number {
  return probabilities.reduce((product, p) => product * p, 1);
}

/**
 * 機率轉為直觀的比例描述
 * @param probability 機率 (0-1)
 * @returns 描述文字
 */
export function probabilityToDescription(probability: number): string {
  if (probability >= 0.5) return '非常常見';
  if (probability >= 0.2) return '相當普遍';
  if (probability >= 0.1) return '算是常見';
  if (probability >= 0.05) return '有點稀少';
  if (probability >= 0.01) return '相當稀有';
  if (probability >= 0.001) return '非常稀有';
  if (probability >= 0.0001) return '極為罕見';
  return '萬中選一';
}

/**
 * 機率轉為「每 N 人中有 1 人」的比例
 * @param probability 機率 (0-1)
 * @returns 如「每 20 人中有 1 人」
 */
export function probabilityToRatio(probability: number): string {
  if (probability <= 0) return '幾乎不存在';
  if (probability >= 1) return '所有人';
  const ratio = Math.round(1 / probability);
  if (ratio <= 1) return '幾乎所有人';
  if (ratio >= 1000000) return `每 ${(ratio / 10000).toFixed(0)} 萬人中有 1 人`;
  if (ratio >= 10000) return `每 ${(ratio / 10000).toFixed(1)} 萬人中有 1 人`;
  if (ratio >= 1000) return `每 ${(ratio / 1000).toFixed(1)} 千人中有 1 人`;
  return `每 ${ratio} 人中有 1 人`;
}
