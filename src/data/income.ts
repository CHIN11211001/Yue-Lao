// ========================================
// 收入分布 — 基於 2023 主計總處薪資統計
// ========================================
import type {
  AgeRange,
  Education,
  Gender,
  GenderedDistribution,
  IncomeRange,
  NestedConditionalProbabilityTable,
} from '../engine/types';
import { AGE_DISTRIBUTION_FEMALE, AGE_DISTRIBUTION_MALE } from './demographics';
import { EDUCATION_DISTRIBUTION } from './education';
import { buildAgeEducationConditionalTable } from './cpt';

/**
 * 月薪分布（含經常性薪資 + 非經常性薪資）
 * 資料來源：主計總處「薪情平臺」及受僱員工薪資調查
 * 2023 年全體受僱員工薪資中位數約 44,000 元
 */
export const INCOME_DISTRIBUTION: GenderedDistribution<IncomeRange> = {
  male: {
    '<30k': 0.145,       // < 3 萬：14.5%
    '30k-50k': 0.320,    // 3-5 萬：32.0%
    '50k-70k': 0.235,    // 5-7 萬：23.5%
    '70k-100k': 0.160,   // 7-10 萬：16.0%
    '100k-150k': 0.090,  // 10-15 萬：9.0%
    '150k+': 0.050,      // 15 萬以上：5.0%
  },
  female: {
    '<30k': 0.205,       // < 3 萬：20.5%
    '30k-50k': 0.355,    // 3-5 萬：35.5%
    '50k-70k': 0.215,    // 5-7 萬：21.5%
    '70k-100k': 0.125,   // 7-10 萬：12.5%
    '100k-150k': 0.065,  // 10-15 萬：6.5%
    '150k+': 0.035,      // 15 萬以上：3.5%
  },
};

const AGE_KEYS: AgeRange[] = ['<=20', '21-25', '26-30', '31-35', '36-40', '41-45', '46-50', '50+'];
const EDUCATION_KEYS: Education[] = [
  'below_high_school',
  'high_school',
  'college',
  'master',
  'doctoral',
];
const INCOME_KEYS: IncomeRange[] = ['<30k', '30k-50k', '50k-70k', '70k-100k', '100k-150k', '150k+'];

const INCOME_BUCKET_SCORES: Record<IncomeRange, number> = {
  '<30k': -1.6,
  '30k-50k': -0.7,
  '50k-70k': 0,
  '70k-100k': 0.8,
  '100k-150k': 1.5,
  '150k+': 2.2,
};

const AGE_INCOME_SHIFTS: Record<AgeRange, number> = {
  '<=20': -1.15,
  '21-25': -0.75,
  '26-30': -0.30,
  '31-35': 0.02,
  '36-40': 0.22,
  '41-45': 0.34,
  '46-50': 0.42,
  '50+': 0.20,
};

const EDUCATION_INCOME_SHIFTS: Record<Education, number> = {
  below_high_school: -0.60,
  high_school: -0.28,
  college: 0,
  master: 0.32,
  doctoral: 0.62,
};

type IncomeByAgeEducationTable = NestedConditionalProbabilityTable<AgeRange, Education, IncomeRange>;

function getAgeDistributionByGender(gender: Gender) {
  return gender === 'male' ? AGE_DISTRIBUTION_MALE : AGE_DISTRIBUTION_FEMALE;
}

function buildIncomeByAgeEducationCpt(gender: Gender): IncomeByAgeEducationTable {
  const ageEffects = {} as Record<IncomeRange, Record<AgeRange, number>>;
  const educationEffects = {} as Record<IncomeRange, Record<Education, number>>;

  for (const income of INCOME_KEYS) {
    ageEffects[income] = {} as Record<AgeRange, number>;
    educationEffects[income] = {} as Record<Education, number>;

    for (const age of AGE_KEYS) {
      ageEffects[income][age] = INCOME_BUCKET_SCORES[income] * AGE_INCOME_SHIFTS[age];
    }
    for (const education of EDUCATION_KEYS) {
      educationEffects[income][education] =
        INCOME_BUCKET_SCORES[income] * EDUCATION_INCOME_SHIFTS[education];
    }
  }

  return buildAgeEducationConditionalTable({
    targetKeys: INCOME_KEYS,
    baseDistribution: INCOME_DISTRIBUTION[gender] as Record<IncomeRange, number>,
    ageWeights: getAgeDistributionByGender(gender) as Record<AgeRange, number>,
    educationWeights: EDUCATION_DISTRIBUTION[gender] as Record<Education, number>,
    ageEffects,
    educationEffects,
  });
}

/**
 * 收入條件機率表 P(收入 | 年齡, 學歷, 性別)
 *
 * 目前先用既有 gender marginal income 分布，配合年齡與學歷的單調趨勢做 heuristic 校準，
 * 再回頭對齊整體 income marginal，作為第一版可解釋的 CPT。
 */
export const INCOME_BY_AGE_EDUCATION_CPT: Record<Gender, IncomeByAgeEducationTable> = {
  male: buildIncomeByAgeEducationCpt('male'),
  female: buildIncomeByAgeEducationCpt('female'),
};
