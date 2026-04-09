// ========================================
// 體位數據 — 基於《我國2013-2016 年國民營養調查體位分析與常模建立-(I)
// 身高、體重、身體質量指數》表二、表四、表六
// ========================================
import type {
  AgeRange,
  ConditionalProbabilityTable,
  Distribution,
  Gender,
  GenderedDistribution,
  HeightRange,
  NestedConditionalProbabilityTable,
  WeightRange,
} from '../engine/types';
import { AGE_DISTRIBUTION_FEMALE, AGE_DISTRIBUTION_MALE } from './demographics';

type PhysiqueSourceAgeBand =
  | '19-30'
  | '30-45'
  | '45-55'
  | '55-65'
  | '65-70'
  | '70-75'
  | '75-80'
  | '80-85'
  | '85+';

interface NormalStats {
  mean: number;
  sd: number;
}

interface RangeBoundary<T extends string> {
  key: T;
  lower?: number;
  upper?: number;
}

const SOURCE_AGE_BANDS: PhysiqueSourceAgeBand[] = [
  '19-30',
  '30-45',
  '45-55',
  '55-65',
  '65-70',
  '70-75',
  '75-80',
  '80-85',
  '85+',
];

const HEIGHT_KEYS: HeightRange[] = [
  '<155',
  '155-159',
  '160-164',
  '165-169',
  '170-174',
  '175-179',
  '180-184',
  '185-189',
  '190+',
];

const WEIGHT_KEYS: WeightRange[] = [
  '<45kg',
  '45-55kg',
  '55-65kg',
  '65-75kg',
  '75-85kg',
  '85-95kg',
  '95kg+',
];

const HEIGHT_BINS: RangeBoundary<HeightRange>[] = [
  { key: '<155', upper: 155 },
  { key: '155-159', lower: 155, upper: 160 },
  { key: '160-164', lower: 160, upper: 165 },
  { key: '165-169', lower: 165, upper: 170 },
  { key: '170-174', lower: 170, upper: 175 },
  { key: '175-179', lower: 175, upper: 180 },
  { key: '180-184', lower: 180, upper: 185 },
  { key: '185-189', lower: 185, upper: 190 },
  { key: '190+', lower: 190 },
];

const HEIGHT_REPRESENTATIVES: Record<HeightRange, number> = {
  '<155': 152.5,
  '155-159': 157.0,
  '160-164': 162.0,
  '165-169': 167.0,
  '170-174': 172.0,
  '175-179': 177.0,
  '180-184': 182.0,
  '185-189': 187.0,
  '190+': 192.5,
};

const WEIGHT_BINS: RangeBoundary<WeightRange>[] = [
  { key: '<45kg', upper: 45 },
  { key: '45-55kg', lower: 45, upper: 55 },
  { key: '55-65kg', lower: 55, upper: 65 },
  { key: '65-75kg', lower: 65, upper: 75 },
  { key: '75-85kg', lower: 75, upper: 85 },
  { key: '85-95kg', lower: 85, upper: 95 },
  { key: '95kg+', lower: 95 },
];

// 由於原始論文年齡帶與 app 年齡帶不同，第一版先做保守 mapping。
// 50+ 以區間寬度近似加權，讓高齡帶不會被單一子區間主導。
const AGE_RANGE_TO_SOURCE_WEIGHTS: Record<AgeRange, Partial<Record<PhysiqueSourceAgeBand, number>>> = {
  '<=20': { '19-30': 1 },
  '21-25': { '19-30': 1 },
  '26-30': { '19-30': 1 },
  '31-35': { '30-45': 1 },
  '36-40': { '30-45': 1 },
  '41-45': { '30-45': 1 },
  '46-50': { '45-55': 1 },
  '50+': {
    '45-55': 5,
    '55-65': 10,
    '65-70': 5,
    '70-75': 5,
    '75-80': 5,
    '80-85': 5,
    '85+': 10,
  },
};

const HEIGHT_STATS_BY_SOURCE_AGE: Record<Gender, Record<PhysiqueSourceAgeBand, NormalStats>> = {
  male: {
    '19-30': { mean: 172.8, sd: 6.6 },
    '30-45': { mean: 171.0, sd: 5.7 },
    '45-55': { mean: 167.8, sd: 6.5 },
    '55-65': { mean: 165.7, sd: 5.73 },
    '65-70': { mean: 163.9, sd: 5.49 },
    '70-75': { mean: 163.3, sd: 5.84 },
    '75-80': { mean: 162.6, sd: 5.88 },
    '80-85': { mean: 161.2, sd: 6.14 },
    '85+': { mean: 159.6, sd: 7.25 },
  },
  female: {
    '19-30': { mean: 159.67, sd: 5.78 },
    '30-45': { mean: 158.84, sd: 5.53 },
    '45-55': { mean: 156.8, sd: 5.53 },
    '55-65': { mean: 154.57, sd: 5.25 },
    '65-70': { mean: 152.46, sd: 5.42 },
    '70-75': { mean: 151.42, sd: 5.14 },
    '75-80': { mean: 149.14, sd: 5.54 },
    '80-85': { mean: 148.68, sd: 5.61 },
    '85+': { mean: 148.08, sd: 6.91 },
  },
};

const WEIGHT_STATS_BY_SOURCE_AGE: Record<Gender, Record<PhysiqueSourceAgeBand, NormalStats>> = {
  male: {
    '19-30': { mean: 71.16, sd: 14.03 },
    '30-45': { mean: 73.08, sd: 13.88 },
    '45-55': { mean: 70.96, sd: 10.88 },
    '55-65': { mean: 69.68, sd: 10.63 },
    '65-70': { mean: 68.27, sd: 10.43 },
    '70-75': { mean: 65.1, sd: 9.79 },
    '75-80': { mean: 64.02, sd: 10.46 },
    '80-85': { mean: 60.63, sd: 9.22 },
    '85+': { mean: 58.04, sd: 9.32 },
  },
  female: {
    '19-30': { mean: 58.44, sd: 16.02 },
    '30-45': { mean: 58.17, sd: 11.74 },
    '45-55': { mean: 59.5, sd: 10.01 },
    '55-65': { mean: 58.88, sd: 9.37 },
    '65-70': { mean: 57.63, sd: 9.56 },
    '70-75': { mean: 57.08, sd: 8.27 },
    '75-80': { mean: 55.85, sd: 10.6 },
    '80-85': { mean: 55.13, sd: 10.36 },
    '85+': { mean: 52.92, sd: 10.86 },
  },
};

const BMI_STATS_BY_SOURCE_AGE: Record<Gender, Record<PhysiqueSourceAgeBand, NormalStats>> = {
  male: {
    '19-30': { mean: 23.86, sd: 4.65 },
    '30-45': { mean: 25.01, sd: 4.64 },
    '45-55': { mean: 25.18, sd: 3.39 },
    '55-65': { mean: 25.34, sd: 3.31 },
    '65-70': { mean: 25.37, sd: 3.38 },
    '70-75': { mean: 24.31, sd: 3.04 },
    '75-80': { mean: 24.25, sd: 3.84 },
    '80-85': { mean: 23.4, sd: 3.32 },
    '85+': { mean: 22.61, sd: 3.07 },
  },
  female: {
    '19-30': { mean: 22.86, sd: 5.75 },
    '30-45': { mean: 23.04, sd: 4.53 },
    '45-55': { mean: 24.17, sd: 4.0 },
    '55-65': { mean: 24.64, sd: 3.72 },
    '65-70': { mean: 24.78, sd: 3.86 },
    '70-75': { mean: 24.87, sd: 3.4 },
    '75-80': { mean: 25.08, sd: 4.42 },
    '80-85': { mean: 24.84, sd: 4.05 },
    '85+': { mean: 24.04, sd: 4.31 },
  },
};

function getAgeDistributionByGender(gender: Gender): Distribution<AgeRange> {
  return gender === 'male' ? AGE_DISTRIBUTION_MALE : AGE_DISTRIBUTION_FEMALE;
}

function normalizeDistribution<T extends string>(
  distribution: Partial<Record<T, number>>,
  keys: T[]
): Record<T, number> {
  const total = keys.reduce((sum, key) => sum + (distribution[key] || 0), 0);
  const normalized = {} as Record<T, number>;

  for (const key of keys) {
    normalized[key] = total > 0 ? (distribution[key] || 0) / total : 0;
  }

  return normalized;
}

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * absX);
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
      Math.exp(-absX * absX);
  return sign * y;
}

function normalCdf(x: number, mean: number, sd: number): number {
  if (sd <= 0) return x < mean ? 0 : 1;
  return 0.5 * (1 + erf((x - mean) / (sd * Math.SQRT2)));
}

function normalRangeProbability(
  lower: number | undefined,
  upper: number | undefined,
  mean: number,
  sd: number
): number {
  const upperCdf = upper === undefined ? 1 : normalCdf(upper, mean, sd);
  const lowerCdf = lower === undefined ? 0 : normalCdf(lower, mean, sd);
  return Math.max(0, upperCdf - lowerCdf);
}

function buildNormalDistribution<T extends string>(
  stats: NormalStats,
  bins: RangeBoundary<T>[],
  keys: T[]
): Record<T, number> {
  const distribution = {} as Partial<Record<T, number>>;
  for (const bin of bins) {
    distribution[bin.key] = normalRangeProbability(bin.lower, bin.upper, stats.mean, stats.sd);
  }
  return normalizeDistribution(distribution, keys);
}

function blendSourceWeights(
  weights: Partial<Record<PhysiqueSourceAgeBand, number>>
): Record<PhysiqueSourceAgeBand, number> {
  return normalizeDistribution(weights, SOURCE_AGE_BANDS);
}

function blendDistributions<T extends string>(
  sourceWeights: Record<PhysiqueSourceAgeBand, number>,
  sourceDistributions: Record<PhysiqueSourceAgeBand, Record<T, number>>,
  keys: T[]
): Record<T, number> {
  const blended = {} as Partial<Record<T, number>>;
  for (const key of keys) {
    blended[key] = 0;
  }

  for (const sourceAge of SOURCE_AGE_BANDS) {
    const weight = sourceWeights[sourceAge] || 0;
    if (weight <= 0) continue;

    for (const key of keys) {
      blended[key] = (blended[key] || 0) + weight * sourceDistributions[sourceAge][key];
    }
  }

  return normalizeDistribution(blended, keys);
}

function buildWeightDistributionFromBmi(
  heightCm: number,
  bmiStats: NormalStats
): Record<WeightRange, number> {
  const heightMetersSquared = (heightCm / 100) ** 2;
  const distribution = {} as Partial<Record<WeightRange, number>>;

  for (const bin of WEIGHT_BINS) {
    const bmiLower = bin.lower === undefined ? undefined : bin.lower / heightMetersSquared;
    const bmiUpper = bin.upper === undefined ? undefined : bin.upper / heightMetersSquared;
    distribution[bin.key] = normalRangeProbability(
      bmiLower,
      bmiUpper,
      bmiStats.mean,
      bmiStats.sd
    );
  }

  return normalizeDistribution(distribution, WEIGHT_KEYS);
}

function buildSourceWeightGivenHeightAgeCpt(
  gender: Gender,
  sourceAge: PhysiqueSourceAgeBand,
  heightDistribution: Record<HeightRange, number>
): Record<HeightRange, Record<WeightRange, number>> {
  const bmiStats = BMI_STATS_BY_SOURCE_AGE[gender][sourceAge];
  const targetWeightDistribution = buildNormalDistribution(
    WEIGHT_STATS_BY_SOURCE_AGE[gender][sourceAge],
    WEIGHT_BINS,
    WEIGHT_KEYS
  );

  const rawRows = {} as Record<HeightRange, Record<WeightRange, number>>;
  for (const height of HEIGHT_KEYS) {
    rawRows[height] = buildWeightDistributionFromBmi(
      HEIGHT_REPRESENTATIVES[height],
      bmiStats
    );
  }

  const aggregate = {} as Partial<Record<WeightRange, number>>;
  for (const weight of WEIGHT_KEYS) {
    aggregate[weight] = 0;
  }

  for (const height of HEIGHT_KEYS) {
    const pHeight = heightDistribution[height] || 0;
    for (const weight of WEIGHT_KEYS) {
      aggregate[weight] = (aggregate[weight] || 0) + pHeight * rawRows[height][weight];
    }
  }

  const calibrationFactors = {} as Record<WeightRange, number>;
  for (const weight of WEIGHT_KEYS) {
    const aggregateValue = aggregate[weight] || 0;
    calibrationFactors[weight] =
      aggregateValue > 0 ? targetWeightDistribution[weight] / aggregateValue : 1;
  }

  const calibratedRows = {} as Record<HeightRange, Record<WeightRange, number>>;
  for (const height of HEIGHT_KEYS) {
    const scaled = {} as Partial<Record<WeightRange, number>>;
    for (const weight of WEIGHT_KEYS) {
      scaled[weight] = rawRows[height][weight] * calibrationFactors[weight];
    }
    calibratedRows[height] = normalizeDistribution(scaled, WEIGHT_KEYS);
  }

  return calibratedRows;
}

const SOURCE_HEIGHT_DISTRIBUTIONS: Record<
  Gender,
  Record<PhysiqueSourceAgeBand, Record<HeightRange, number>>
> = {
  male: {} as Record<PhysiqueSourceAgeBand, Record<HeightRange, number>>,
  female: {} as Record<PhysiqueSourceAgeBand, Record<HeightRange, number>>,
};

const SOURCE_WEIGHT_DISTRIBUTIONS: Record<
  Gender,
  Record<PhysiqueSourceAgeBand, Record<WeightRange, number>>
> = {
  male: {} as Record<PhysiqueSourceAgeBand, Record<WeightRange, number>>,
  female: {} as Record<PhysiqueSourceAgeBand, Record<WeightRange, number>>,
};

const SOURCE_WEIGHT_GIVEN_HEIGHT_CPTS: Record<
  Gender,
  Record<PhysiqueSourceAgeBand, Record<HeightRange, Record<WeightRange, number>>>
> = {
  male: {} as Record<PhysiqueSourceAgeBand, Record<HeightRange, Record<WeightRange, number>>>,
  female: {} as Record<PhysiqueSourceAgeBand, Record<HeightRange, Record<WeightRange, number>>>,
};

for (const gender of ['male', 'female'] as const) {
  for (const sourceAge of SOURCE_AGE_BANDS) {
    SOURCE_HEIGHT_DISTRIBUTIONS[gender][sourceAge] = buildNormalDistribution(
      HEIGHT_STATS_BY_SOURCE_AGE[gender][sourceAge],
      HEIGHT_BINS,
      HEIGHT_KEYS
    );
    SOURCE_WEIGHT_DISTRIBUTIONS[gender][sourceAge] = buildNormalDistribution(
      WEIGHT_STATS_BY_SOURCE_AGE[gender][sourceAge],
      WEIGHT_BINS,
      WEIGHT_KEYS
    );
    SOURCE_WEIGHT_GIVEN_HEIGHT_CPTS[gender][sourceAge] = buildSourceWeightGivenHeightAgeCpt(
      gender,
      sourceAge,
      SOURCE_HEIGHT_DISTRIBUTIONS[gender][sourceAge]
    );
  }
}

function buildHeightByAgeCpt(
  gender: Gender
): ConditionalProbabilityTable<AgeRange, HeightRange> {
  const table = {} as ConditionalProbabilityTable<AgeRange, HeightRange>;

  for (const age of Object.keys(AGE_RANGE_TO_SOURCE_WEIGHTS) as AgeRange[]) {
    const sourceWeights = blendSourceWeights(AGE_RANGE_TO_SOURCE_WEIGHTS[age]);
    table[age] = blendDistributions(
      sourceWeights,
      SOURCE_HEIGHT_DISTRIBUTIONS[gender],
      HEIGHT_KEYS
    );
  }

  return table;
}

function buildBmiByAgeStats(gender: Gender): Record<AgeRange, NormalStats> {
  const result = {} as Record<AgeRange, NormalStats>;

  for (const age of Object.keys(AGE_RANGE_TO_SOURCE_WEIGHTS) as AgeRange[]) {
    const sourceWeights = blendSourceWeights(AGE_RANGE_TO_SOURCE_WEIGHTS[age]);
    let mean = 0;
    let variance = 0;

    for (const sourceAge of SOURCE_AGE_BANDS) {
      const weight = sourceWeights[sourceAge] || 0;
      if (weight <= 0) continue;
      mean += weight * BMI_STATS_BY_SOURCE_AGE[gender][sourceAge].mean;
    }

    for (const sourceAge of SOURCE_AGE_BANDS) {
      const weight = sourceWeights[sourceAge] || 0;
      if (weight <= 0) continue;
      const stats = BMI_STATS_BY_SOURCE_AGE[gender][sourceAge];
      variance += weight * (stats.sd ** 2 + (stats.mean - mean) ** 2);
    }

    result[age] = { mean, sd: Math.sqrt(Math.max(variance, 0.0001)) };
  }

  return result;
}

function buildWeightGivenHeightAgeCpt(
  gender: Gender
): NestedConditionalProbabilityTable<AgeRange, HeightRange, WeightRange> {
  const table = {} as NestedConditionalProbabilityTable<AgeRange, HeightRange, WeightRange>;

  for (const age of Object.keys(AGE_RANGE_TO_SOURCE_WEIGHTS) as AgeRange[]) {
    const sourceWeights = blendSourceWeights(AGE_RANGE_TO_SOURCE_WEIGHTS[age]);
    table[age] = {} as ConditionalProbabilityTable<HeightRange, WeightRange>;

    for (const height of HEIGHT_KEYS) {
      const blended = {} as Partial<Record<WeightRange, number>>;
      for (const weight of WEIGHT_KEYS) {
        blended[weight] = 0;
      }

      for (const sourceAge of SOURCE_AGE_BANDS) {
        const weight = sourceWeights[sourceAge] || 0;
        if (weight <= 0) continue;

        for (const targetWeight of WEIGHT_KEYS) {
          blended[targetWeight] =
            (blended[targetWeight] || 0) +
            weight * SOURCE_WEIGHT_GIVEN_HEIGHT_CPTS[gender][sourceAge][height][targetWeight];
        }
      }

      table[age][height] = normalizeDistribution(blended, WEIGHT_KEYS);
    }
  }

  return table;
}

function aggregateHeightDistribution(
  gender: Gender,
  heightByAgeCpt: ConditionalProbabilityTable<AgeRange, HeightRange>
): Record<HeightRange, number> {
  const ageDistribution = getAgeDistributionByGender(gender);
  const aggregate = {} as Partial<Record<HeightRange, number>>;

  for (const height of HEIGHT_KEYS) {
    aggregate[height] = 0;
  }

  for (const age of Object.keys(ageDistribution) as AgeRange[]) {
    const pAge = ageDistribution[age] || 0;
    for (const height of HEIGHT_KEYS) {
      aggregate[height] = (aggregate[height] || 0) + pAge * heightByAgeCpt[age][height];
    }
  }

  return normalizeDistribution(aggregate, HEIGHT_KEYS);
}

function aggregateWeightDistribution(
  gender: Gender,
  heightByAgeCpt: ConditionalProbabilityTable<AgeRange, HeightRange>,
  weightGivenHeightAgeCpt: NestedConditionalProbabilityTable<AgeRange, HeightRange, WeightRange>
): Record<WeightRange, number> {
  const ageDistribution = getAgeDistributionByGender(gender);
  const aggregate = {} as Partial<Record<WeightRange, number>>;

  for (const weight of WEIGHT_KEYS) {
    aggregate[weight] = 0;
  }

  for (const age of Object.keys(ageDistribution) as AgeRange[]) {
    const pAge = ageDistribution[age] || 0;
    for (const height of HEIGHT_KEYS) {
      const pHeightGivenAge = heightByAgeCpt[age][height] || 0;
      for (const weight of WEIGHT_KEYS) {
        aggregate[weight] =
          (aggregate[weight] || 0) +
          pAge * pHeightGivenAge * weightGivenHeightAgeCpt[age][height][weight];
      }
    }
  }

  return normalizeDistribution(aggregate, WEIGHT_KEYS);
}

export const HEIGHT_BY_AGE_CPT: Record<Gender, ConditionalProbabilityTable<AgeRange, HeightRange>> = {
  male: buildHeightByAgeCpt('male'),
  female: buildHeightByAgeCpt('female'),
};

export const BMI_BY_AGE_STATS: Record<Gender, Record<AgeRange, NormalStats>> = {
  male: buildBmiByAgeStats('male'),
  female: buildBmiByAgeStats('female'),
};

export const WEIGHT_GIVEN_HEIGHT_AGE_CPT: Record<
  Gender,
  NestedConditionalProbabilityTable<AgeRange, HeightRange, WeightRange>
> = {
  male: buildWeightGivenHeightAgeCpt('male'),
  female: buildWeightGivenHeightAgeCpt('female'),
};

export const HEIGHT_DISTRIBUTION: GenderedDistribution<HeightRange> = {
  male: aggregateHeightDistribution('male', HEIGHT_BY_AGE_CPT.male),
  female: aggregateHeightDistribution('female', HEIGHT_BY_AGE_CPT.female),
};

export const WEIGHT_DISTRIBUTION: GenderedDistribution<WeightRange> = {
  male: aggregateWeightDistribution('male', HEIGHT_BY_AGE_CPT.male, WEIGHT_GIVEN_HEIGHT_AGE_CPT.male),
  female: aggregateWeightDistribution('female', HEIGHT_BY_AGE_CPT.female, WEIGHT_GIVEN_HEIGHT_AGE_CPT.female),
};
