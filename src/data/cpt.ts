import type {
  AgeRange,
  Education,
  NestedConditionalProbabilityTable,
} from '../engine/types';

interface AgeEducationConditionalConfig<TargetKey extends string> {
  targetKeys: TargetKey[];
  baseDistribution: Record<TargetKey, number>;
  ageWeights: Record<AgeRange, number>;
  educationWeights: Record<Education, number>;
  ageEffects: Record<TargetKey, Record<AgeRange, number>>;
  educationEffects: Record<TargetKey, Record<Education, number>>;
}

function normalizeDistribution<TargetKey extends string>(
  targetKeys: TargetKey[],
  distribution: Partial<Record<TargetKey, number>>
): Record<TargetKey, number> {
  const total = targetKeys.reduce((sum, key) => sum + (distribution[key] || 0), 0);
  const normalized = {} as Record<TargetKey, number>;

  for (const key of targetKeys) {
    normalized[key] = total > 0 ? (distribution[key] || 0) / total : 0;
  }

  return normalized;
}

export function buildAgeEducationConditionalTable<TargetKey extends string>({
  targetKeys,
  baseDistribution,
  ageWeights,
  educationWeights,
  ageEffects,
  educationEffects,
}: AgeEducationConditionalConfig<TargetKey>): NestedConditionalProbabilityTable<
  AgeRange,
  Education,
  TargetKey
> {
  const ageKeys = Object.keys(ageWeights) as AgeRange[];
  const educationKeys = Object.keys(educationWeights) as Education[];

  const rawTable = {} as NestedConditionalProbabilityTable<AgeRange, Education, TargetKey>;
  for (const age of ageKeys) {
    rawTable[age] = {} as Record<Education, Record<TargetKey, number>>;
    for (const education of educationKeys) {
      const weighted = {} as Partial<Record<TargetKey, number>>;
      for (const target of targetKeys) {
        const score = ageEffects[target][age] + educationEffects[target][education];
        weighted[target] = baseDistribution[target] * Math.exp(score);
      }
      rawTable[age][education] = normalizeDistribution(targetKeys, weighted);
    }
  }

  // 回頭對齊原始 marginal，避免 CPT 讓整體分布漂移太多。
  const aggregate = {} as Partial<Record<TargetKey, number>>;
  for (const target of targetKeys) {
    aggregate[target] = 0;
  }

  for (const age of ageKeys) {
    for (const education of educationKeys) {
      const conditionWeight = (ageWeights[age] || 0) * (educationWeights[education] || 0);
      for (const target of targetKeys) {
        aggregate[target] =
          (aggregate[target] || 0) + conditionWeight * rawTable[age][education][target];
      }
    }
  }

  const calibrationFactors = {} as Record<TargetKey, number>;
  for (const target of targetKeys) {
    const aggregateValue = aggregate[target] || 0;
    calibrationFactors[target] = aggregateValue > 0 ? baseDistribution[target] / aggregateValue : 1;
  }

  const calibratedTable = {} as NestedConditionalProbabilityTable<AgeRange, Education, TargetKey>;
  for (const age of ageKeys) {
    calibratedTable[age] = {} as Record<Education, Record<TargetKey, number>>;
    for (const education of educationKeys) {
      const scaled = {} as Partial<Record<TargetKey, number>>;
      for (const target of targetKeys) {
        scaled[target] = rawTable[age][education][target] * calibrationFactors[target];
      }
      calibratedTable[age][education] = normalizeDistribution(targetKeys, scaled);
    }
  }

  return calibratedTable;
}
