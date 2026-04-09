// ========================================
// 產業/職業分布 — 基於主計總處行業別受僱員工統計
// ========================================
import type {
  AgeRange,
  Education,
  Gender,
  GenderedDistribution,
  Industry,
  NestedConditionalProbabilityTable,
} from '../engine/types';
import { AGE_DISTRIBUTION_FEMALE, AGE_DISTRIBUTION_MALE } from './demographics';
import { EDUCATION_DISTRIBUTION } from './education';
import { buildAgeEducationConditionalTable } from './cpt';

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

const INDUSTRY_KEYS: Industry[] = [
  'tech_it',
  'manufacturing',
  'finance',
  'medical',
  'public_edu',
  'service_retail',
  'other',
];

const INDUSTRY_AGE_EFFECTS: Record<Industry, Record<AgeRange, number>> = {
  tech_it: {
    '<=20': -0.55,
    '21-25': 0.00,
    '26-30': 0.30,
    '31-35': 0.35,
    '36-40': 0.18,
    '41-45': -0.05,
    '46-50': -0.18,
    '50+': -0.45,
  },
  manufacturing: {
    '<=20': -0.35,
    '21-25': -0.05,
    '26-30': 0.10,
    '31-35': 0.18,
    '36-40': 0.18,
    '41-45': 0.12,
    '46-50': 0.00,
    '50+': -0.12,
  },
  finance: {
    '<=20': -0.60,
    '21-25': -0.15,
    '26-30': 0.10,
    '31-35': 0.22,
    '36-40': 0.24,
    '41-45': 0.15,
    '46-50': 0.05,
    '50+': -0.22,
  },
  medical: {
    '<=20': -0.90,
    '21-25': -0.35,
    '26-30': -0.05,
    '31-35': 0.18,
    '36-40': 0.28,
    '41-45': 0.22,
    '46-50': 0.10,
    '50+': -0.10,
  },
  public_edu: {
    '<=20': -0.70,
    '21-25': -0.20,
    '26-30': 0.00,
    '31-35': 0.15,
    '36-40': 0.22,
    '41-45': 0.22,
    '46-50': 0.12,
    '50+': 0.00,
  },
  service_retail: {
    '<=20': 0.35,
    '21-25': 0.25,
    '26-30': 0.05,
    '31-35': -0.08,
    '36-40': -0.12,
    '41-45': -0.15,
    '46-50': -0.18,
    '50+': -0.25,
  },
  other: {
    '<=20': 0.08,
    '21-25': 0.05,
    '26-30': 0.00,
    '31-35': -0.02,
    '36-40': 0.00,
    '41-45': 0.04,
    '46-50': 0.08,
    '50+': 0.12,
  },
};

const INDUSTRY_EDUCATION_EFFECTS: Record<Industry, Record<Education, number>> = {
  tech_it: {
    below_high_school: -0.80,
    high_school: -0.25,
    college: 0.35,
    master: 0.55,
    doctoral: 0.40,
  },
  manufacturing: {
    below_high_school: 0.30,
    high_school: 0.25,
    college: -0.05,
    master: -0.25,
    doctoral: -0.45,
  },
  finance: {
    below_high_school: -0.80,
    high_school: -0.25,
    college: 0.35,
    master: 0.50,
    doctoral: 0.25,
  },
  medical: {
    below_high_school: -1.00,
    high_school: -0.60,
    college: 0.10,
    master: 0.60,
    doctoral: 0.85,
  },
  public_edu: {
    below_high_school: -0.75,
    high_school: -0.35,
    college: 0.25,
    master: 0.50,
    doctoral: 0.55,
  },
  service_retail: {
    below_high_school: 0.35,
    high_school: 0.20,
    college: -0.10,
    master: -0.35,
    doctoral: -0.55,
  },
  other: {
    below_high_school: 0.05,
    high_school: 0.02,
    college: 0.00,
    master: -0.02,
    doctoral: -0.05,
  },
};

type IndustryByAgeEducationTable = NestedConditionalProbabilityTable<AgeRange, Education, Industry>;

function getAgeDistributionByGender(gender: Gender) {
  return gender === 'male' ? AGE_DISTRIBUTION_MALE : AGE_DISTRIBUTION_FEMALE;
}

function buildIndustryByAgeEducationCpt(gender: Gender): IndustryByAgeEducationTable {
  return buildAgeEducationConditionalTable({
    targetKeys: INDUSTRY_KEYS,
    baseDistribution: INDUSTRY_DISTRIBUTION[gender] as Record<Industry, number>,
    ageWeights: getAgeDistributionByGender(gender) as Record<AgeRange, number>,
    educationWeights: EDUCATION_DISTRIBUTION[gender] as Record<Education, number>,
    ageEffects: INDUSTRY_AGE_EFFECTS,
    educationEffects: INDUSTRY_EDUCATION_EFFECTS,
  });
}

/**
 * 產業條件機率表 P(產業 | 年齡, 學歷, 性別)
 *
 * 目前依主計總處行業別受僱員工統計的 marginal 分布為基底，
 * 再用年齡與學歷對不同產業的相對偏好做 heuristic 校準。
 */
export const INDUSTRY_BY_AGE_EDUCATION_CPT: Record<Gender, IndustryByAgeEducationTable> = {
  male: buildIndustryByAgeEducationCpt('male'),
  female: buildIndustryByAgeEducationCpt('female'),
};
