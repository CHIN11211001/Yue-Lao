// ========================================
// 條件篩選 & 交叉分析計算器
// ========================================
import type {
  FilterCriteria,
  AnalysisResult,
  FunnelStep,
  AgeRange,
} from './types';
import {
  ADULT_POPULATION,
  GENDER_RATIO,
  AGE_DISTRIBUTION_MALE,
  AGE_DISTRIBUTION_FEMALE,
  HEIGHT_DISTRIBUTION,
  WEIGHT_DISTRIBUTION,
  EDUCATION_DISTRIBUTION,
  INCOME_DISTRIBUTION,
  MARRIAGE_DISTRIBUTION,
  REGION_DISTRIBUTION,
  ZODIAC_DISTRIBUTION,
  MBTI_DISTRIBUTION,
  INDUSTRY_DISTRIBUTION,
} from '../data';
import {
  sumSelectedProbability,
  calculateJointProbability,
} from './probability';

/**
 * 根據篩選條件計算分析結果
 */
export function calculateAnalysis(criteria: FilterCriteria): AnalysisResult {
  const { gender } = criteria;

  // 1. 性別比例
  const genderProb = GENDER_RATIO[gender];

  // 2. 年齡比例
  const ageDistribution =
    gender === 'male' ? AGE_DISTRIBUTION_MALE : AGE_DISTRIBUTION_FEMALE;
  const ageProb = sumSelectedProbability<AgeRange>(
    ageDistribution,
    criteria.ageRanges
  );

  // 3. 身高比例
  const heightProb = sumSelectedProbability(
    HEIGHT_DISTRIBUTION[gender],
    criteria.heightRanges
  );

  // 4. 體重比例
  const weightProb = sumSelectedProbability(
    WEIGHT_DISTRIBUTION[gender],
    criteria.weightRanges
  );

  // 5. 學歷比例
  const eduProb = sumSelectedProbability(
    EDUCATION_DISTRIBUTION[gender],
    criteria.educations
  );

  // 6. 收入比例
  const incomeProb = sumSelectedProbability(
    INCOME_DISTRIBUTION[gender],
    criteria.incomeRanges
  );

  // 7. 婚姻狀態比例
  const marriageProb = sumSelectedProbability(
    MARRIAGE_DISTRIBUTION[gender],
    criteria.marriageStatuses
  );

  // 8. 區域比例
  const regionProb = sumSelectedProbability(
    REGION_DISTRIBUTION,
    criteria.regions
  );

  // 9. 星座
  const zodiacProb = sumSelectedProbability(
    ZODIAC_DISTRIBUTION,
    criteria.zodiacs
  );

  // 10. MBTI
  const mbtiProb = sumSelectedProbability(
    MBTI_DISTRIBUTION,
    criteria.mbtis
  );

  // 11. 產業/職業
  const industryProb = sumSelectedProbability(
    INDUSTRY_DISTRIBUTION[gender],
    criteria.industries
  );

  // 聯合機率（假設各維度獨立）
  // 排除性別機率，將符合條件的比例基準放在「單一目標性別」之內
  const allProbs = [
    ageProb,
    heightProb,
    weightProb,
    eduProb,
    incomeProb,
    marriageProb,
    regionProb,
    zodiacProb,
    mbtiProb,
    industryProb,
  ];
  const finalPercentage = calculateJointProbability(allProbs);
  
  // 目標性別的總人口
  const targetGenderPopulation = genderProb * ADULT_POPULATION;
  const estimatedPopulation = Math.round(finalPercentage * targetGenderPopulation);

  // 漏斗圖步驟（逐步累積篩選）
  const funnelSteps: FunnelStep[] = [];
  
  // 將目標性別設立為100%基準點
  funnelSteps.push({
    label: `目標性別`,
    percentage: 1,
    population: Math.round(targetGenderPopulation),
  });

  let cumulative = 1;

  const steps: { label: string; prob: number }[] = [
    { label: '年齡條件', prob: ageProb },
    { label: '身高條件', prob: heightProb },
    { label: '體重條件', prob: weightProb },
    { label: '學歷條件', prob: eduProb },
    { label: '收入條件', prob: incomeProb },
    { label: '產業職業', prob: industryProb },
    { label: '婚姻狀態', prob: marriageProb },
    { label: '居住區域', prob: regionProb },
    { label: '尋找星座', prob: zodiacProb },
    { label: 'MBTI', prob: mbtiProb },
  ];

  for (const step of steps) {
    cumulative *= step.prob;
    funnelSteps.push({
      label: step.label,
      percentage: cumulative,
      population: Math.round(cumulative * targetGenderPopulation),
    });
  }

  return {
    finalPercentage,
    estimatedPopulation,
    funnelSteps,
    dimensionPercentages: {
      gender: genderProb,
      age: ageProb,
      height: heightProb,
      weight: weightProb,
      education: eduProb,
      income: incomeProb,
      marriage: marriageProb,
      region: regionProb,
      zodiac: zodiacProb,
      mbti: mbtiProb,
      industry: industryProb,
    },
  };
}
