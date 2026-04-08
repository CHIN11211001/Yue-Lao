// ========================================
// 機率計算模組
// ========================================
import type { Distribution, CrossDistributionMatrix } from './types';

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

/**
 * 從交叉概率矩陣中計算選中項目的條件概率總和
 * @param matrix 交叉概率矩陣 matrix[myKey][targetKey] = P(對方=targetKey | 我=myKey)
 * @param myKey 用戶自身的類別（年齡層 or 學歷）
 * @param selected 選中的對方類別
 * @returns 條件概率加總 (0-1)
 */
export function sumSelectedFromCrossMatrix<T extends string>(
  matrix: CrossDistributionMatrix<T>,
  myKey: T,
  selected: T[]
): number {
  if (selected.length === 0) return 1; // 未選 = 不限制 = 100%
  const row = matrix[myKey];
  if (!row) return 1;
  return selected.reduce((sum, key) => sum + (row[key] || 0), 0);
}

/**
 * 計算年齡權重下的婚姻狀態聯合條件機率
 * @param ageDistribution 年齡權重分佈 (可以是 Marginal 或 Conditional)
 * @param ageMarriageMatrix 年齡-婚姻狀態 分佈矩陣
 * @param selectedAges 選中的年齡條件
 * @param selectedStatuses 選中的婚姻狀態條件
 */
export function calculateMarriageProbWeightedByAge<Age extends string, Status extends string>(
  ageDistribution: Distribution<Age>,
  ageMarriageMatrix: Record<Age, Record<Status, number>>,
  selectedAges: Age[],
  selectedStatuses: Status[]
): number {
  if (selectedStatuses.length === 0) return 1;

  const targetAges = selectedAges.length > 0 ? selectedAges : (Object.keys(ageDistribution) as Age[]);
  
  let totalAgeWeight = 0;
  let jointProb = 0;
  
  for (const age of targetAges) {
    const pAge = ageDistribution[age] || 0;
    totalAgeWeight += pAge;
    
    let pStatusGivenAge = 0;
    for (const status of selectedStatuses) {
      if (ageMarriageMatrix[age]) {
        pStatusGivenAge += ageMarriageMatrix[age][status] || 0;
      }
    }
    
    jointProb += pAge * pStatusGivenAge;
  }
  
  return totalAgeWeight > 0 ? jointProb / totalAgeWeight : 0;
}
