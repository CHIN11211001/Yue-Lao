// ========================================
// 機率計算模組
// ========================================
import type {
  Distribution,
  CrossDistributionMatrix,
  ConditionalProbabilityTable,
  NestedConditionalProbabilityTable,
} from './types';

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
  const sum = selected.reduce((s, key) => s + (distribution[key] || 0), 0);
  return Math.min(1, sum);
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
  const sum = selected.reduce((s, key) => s + (row[key] || 0), 0);
  return Math.min(1, sum);
}

/**
 * 從條件機率表取出指定條件下的分布
 * @param table 條件機率表 table[conditionKey][targetKey] = P(target | condition)
 * @param conditionKey 條件鍵值
 * @param fallback 無對應資料時的回退分布
 * @returns 條件分布
 */
export function getConditionalDistribution<
  ConditionKey extends string,
  TargetKey extends string,
>(
  table: ConditionalProbabilityTable<ConditionKey, TargetKey>,
  conditionKey: ConditionKey | undefined,
  fallback: Distribution<TargetKey>
): Distribution<TargetKey> {
  if (!conditionKey) return fallback;
  return table[conditionKey] || fallback;
}

/**
 * 在已知條件維度分布下，計算目標條件的加權條件機率
 * @param conditionDistribution 條件維度權重分佈 (可以是 Marginal 或 Conditional)
 * @param conditionalTable 條件機率表
 * @param selectedConditions 選中的條件鍵值
 * @param selectedTargets 選中的目標鍵值
 */
export function calculateWeightedConditionalProbability<
  ConditionKey extends string,
  TargetKey extends string,
>(
  conditionDistribution: Distribution<ConditionKey>,
  conditionalTable: ConditionalProbabilityTable<ConditionKey, TargetKey>,
  selectedConditions: ConditionKey[],
  selectedTargets: TargetKey[]
): number {
  if (selectedTargets.length === 0) return 1;

  const targetConditions =
    selectedConditions.length > 0
      ? selectedConditions
      : (Object.keys(conditionDistribution) as ConditionKey[]);

  let totalConditionWeight = 0;
  let jointProb = 0;

  for (const condition of targetConditions) {
    const pCondition = conditionDistribution[condition] || 0;
    totalConditionWeight += pCondition;

    let pTargetGivenCondition = 0;
    for (const target of selectedTargets) {
      if (conditionalTable[condition]) {
        pTargetGivenCondition += conditionalTable[condition][target] || 0;
      }
    }

    jointProb += pCondition * pTargetGivenCondition;
  }

  return totalConditionWeight > 0 ? jointProb / totalConditionWeight : 0;
}

/**
 * 在兩個條件維度下，計算目標條件的加權條件機率
 * @param primaryDistribution 第一條件維度權重分佈
 * @param secondaryDistribution 第二條件維度權重分佈
 * @param conditionalTable 巢狀條件機率表 table[primary][secondary][target]
 * @param selectedPrimary 選中的第一條件鍵值
 * @param selectedSecondary 選中的第二條件鍵值
 * @param selectedTargets 選中的目標鍵值
 */
export function calculateWeightedConditionalProbability2D<
  PrimaryKey extends string,
  SecondaryKey extends string,
  TargetKey extends string,
>(
  primaryDistribution: Distribution<PrimaryKey>,
  secondaryDistribution: Distribution<SecondaryKey>,
  conditionalTable: NestedConditionalProbabilityTable<PrimaryKey, SecondaryKey, TargetKey>,
  selectedPrimary: PrimaryKey[],
  selectedSecondary: SecondaryKey[],
  selectedTargets: TargetKey[]
): number {
  if (selectedTargets.length === 0) return 1;

  const targetPrimary =
    selectedPrimary.length > 0
      ? selectedPrimary
      : (Object.keys(primaryDistribution) as PrimaryKey[]);
  const targetSecondary =
    selectedSecondary.length > 0
      ? selectedSecondary
      : (Object.keys(secondaryDistribution) as SecondaryKey[]);

  let totalWeight = 0;
  let jointProb = 0;

  for (const primary of targetPrimary) {
    const pPrimary = primaryDistribution[primary] || 0;
    if (pPrimary <= 0) continue;

    const secondaryTable = conditionalTable[primary];
    if (!secondaryTable) continue;

    for (const secondary of targetSecondary) {
      const pSecondary = secondaryDistribution[secondary] || 0;
      if (pSecondary <= 0) continue;

      const targetDistribution = secondaryTable[secondary];
      if (!targetDistribution) continue;

      const conditionWeight = pPrimary * pSecondary;
      totalWeight += conditionWeight;

      let pTargetGivenConditions = 0;
      for (const target of selectedTargets) {
        pTargetGivenConditions += targetDistribution[target] || 0;
      }

      jointProb += conditionWeight * pTargetGivenConditions;
    }
  }

  return totalWeight > 0 ? jointProb / totalWeight : 0;
}

/**
 * 依序計算 A -> B -> C 的鏈式條件機率。
 * 適合像「年齡 -> 身高 -> 體重」這種上游條件會影響下游分布的場景。
 */
export function calculateChainedConditionalProbabilities<
  PrimaryKey extends string,
  SecondaryKey extends string,
  TargetKey extends string,
>(
  primaryDistribution: Distribution<PrimaryKey>,
  secondaryTable: ConditionalProbabilityTable<PrimaryKey, SecondaryKey>,
  targetTable: NestedConditionalProbabilityTable<PrimaryKey, SecondaryKey, TargetKey>,
  selectedPrimary: PrimaryKey[],
  selectedSecondary: SecondaryKey[],
  selectedTargets: TargetKey[]
): {
  secondaryProbability: number;
  targetProbability: number;
  jointProbability: number;
} {
  const targetPrimary =
    selectedPrimary.length > 0
      ? selectedPrimary
      : (Object.keys(primaryDistribution) as PrimaryKey[]);

  let totalPrimaryWeight = 0;
  let secondaryJointWeight = 0;
  let targetJointWeight = 0;

  for (const primary of targetPrimary) {
    const pPrimary = primaryDistribution[primary] || 0;
    if (pPrimary <= 0) continue;

    const secondaryRow = secondaryTable[primary];
    const targetRows = targetTable[primary];
    if (!secondaryRow || !targetRows) continue;

    totalPrimaryWeight += pPrimary;

    const targetSecondary =
      selectedSecondary.length > 0
        ? selectedSecondary
        : (Object.keys(secondaryRow) as SecondaryKey[]);

    let pSelectedSecondaryGivenPrimary = 0;
    let pSelectedTargetAndSecondaryGivenPrimary = 0;

    for (const secondary of targetSecondary) {
      const pSecondaryGivenPrimary = secondaryRow[secondary] || 0;
      if (pSecondaryGivenPrimary <= 0) continue;

      pSelectedSecondaryGivenPrimary += pSecondaryGivenPrimary;

      const targetDistribution = targetRows[secondary];
      if (!targetDistribution) continue;

      const pSelectedTargetGivenConditions =
        selectedTargets.length > 0
          ? selectedTargets.reduce((sum, target) => sum + (targetDistribution[target] || 0), 0)
          : 1;

      pSelectedTargetAndSecondaryGivenPrimary +=
        pSecondaryGivenPrimary * pSelectedTargetGivenConditions;
    }

    secondaryJointWeight += pPrimary * pSelectedSecondaryGivenPrimary;
    targetJointWeight += pPrimary * pSelectedTargetAndSecondaryGivenPrimary;
  }

  const secondaryProbability =
    totalPrimaryWeight > 0 ? secondaryJointWeight / totalPrimaryWeight : 0;
  const targetProbability =
    selectedTargets.length === 0
      ? 1
      : secondaryJointWeight > 0
        ? targetJointWeight / secondaryJointWeight
        : 0;
  const jointProbability = totalPrimaryWeight > 0 ? targetJointWeight / totalPrimaryWeight : 0;

  return {
    secondaryProbability,
    targetProbability,
    jointProbability,
  };
}
