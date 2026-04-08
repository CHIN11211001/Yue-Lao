// ========================================
// 條件篩選 & 交叉分析計算器
// ========================================
import type {
  FilterCriteria,
  AnalysisResult,
  FunnelStep,
  AgeRange,
  Education,
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
  AGE_MARRIAGE_DISTRIBUTION,
  REGION_DISTRIBUTION,
  ZODIAC_DISTRIBUTION,
  MBTI_DISTRIBUTION,
  INDUSTRY_DISTRIBUTION,
  AGE_CROSS_MATRIX,
  EDUCATION_CROSS_MATRIX,
} from '../data';
import {
  sumSelectedProbability,
  calculateJointProbability,
  sumSelectedFromCrossMatrix,
  calculateMarriageProbWeightedByAge,
} from './probability';

/**
 * 根據篩選條件計算分析結果
 */
export function calculateAnalysis(criteria: FilterCriteria): AnalysisResult {
  const { gender } = criteria;

  // 1. 性別比例
  const genderProb = GENDER_RATIO[gender];

  // 2. 年齡比例 
  const ageDistribution = gender === 'male' ? AGE_DISTRIBUTION_MALE : AGE_DISTRIBUTION_FEMALE;
  // 實體人口比例 (Marginal)
  const ageProbMarginal = sumSelectedProbability<AgeRange>(ageDistribution, criteria.ageRanges);
  
  // 婚配契合比例 (Conditional)
  let ageDistributionCond = ageDistribution;
  if (criteria.myAgeRange) {
    const myGender = gender === 'male' ? 'female' : 'male';
    // 若有自己年齡條件，對方年齡分佈就會受到交配偏好影響
    ageDistributionCond = AGE_CROSS_MATRIX[myGender][criteria.myAgeRange] || ageDistribution;
  }
  const ageProbCond = sumSelectedProbability<AgeRange>(ageDistributionCond, criteria.ageRanges);

  // 3. 身高比例
  const heightProb = sumSelectedProbability(HEIGHT_DISTRIBUTION[gender], criteria.heightRanges);

  // 4. 體重比例
  const weightProb = sumSelectedProbability(WEIGHT_DISTRIBUTION[gender], criteria.weightRanges);

  // 5. 學歷比例
  const eduDistribution = EDUCATION_DISTRIBUTION[gender];
  const eduProbMarginal = sumSelectedProbability(eduDistribution, criteria.educations);
  let eduDistributionCond = eduDistribution;
  if (criteria.myEducation) {
    const myGender = gender === 'male' ? 'female' : 'male';
    eduDistributionCond = EDUCATION_CROSS_MATRIX[myGender][criteria.myEducation] || eduDistribution;
  }
  const eduProbCond = sumSelectedProbability<Education>(eduDistributionCond, criteria.educations);

  // 6. 收入比例
  const incomeProb = sumSelectedProbability(INCOME_DISTRIBUTION[gender], criteria.incomeRanges);

  // 7. 婚姻狀態比例
  // (物理邊際) 基於物理年齡分佈加權的婚姻比例
  const marriageProbMarginal = calculateMarriageProbWeightedByAge(
    ageDistribution,
    AGE_MARRIAGE_DISTRIBUTION[gender],
    criteria.ageRanges,
    criteria.marriageStatuses
  );
  // (婚配契合) 基於契合年齡分佈加權的婚姻比例
  const marriageProbCond = calculateMarriageProbWeightedByAge(
    ageDistributionCond,
    AGE_MARRIAGE_DISTRIBUTION[gender],
    criteria.ageRanges,
    criteria.marriageStatuses
  );

  // 8. 區域比例
  const regionProb = sumSelectedProbability(REGION_DISTRIBUTION, criteria.regions);

  // 9. 星座
  const zodiacProb = sumSelectedProbability(ZODIAC_DISTRIBUTION, criteria.zodiacs);

  // 10. MBTI
  const mbtiProb = sumSelectedProbability(MBTI_DISTRIBUTION, criteria.mbtis);

  // 11. 產業/職業
  const industryProb = sumSelectedProbability(INDUSTRY_DISTRIBUTION[gender], criteria.industries);

  // 聯合機率（這裏計算婚配命中率，用於 UI 的主要 % 數）
  const allCondProbs = [
    ageProbCond, heightProb, weightProb, eduProbCond, incomeProb,
    marriageProbCond, regionProb, zodiacProb, mbtiProb, industryProb,
  ];
  const finalPercentage = calculateJointProbability(allCondProbs);
  
  // 真實實體人口縮減計算 (物理聯合機率)
  const allMarginalProbs = [
    ageProbMarginal, heightProb, weightProb, eduProbMarginal, incomeProb,
    marriageProbMarginal, regionProb, zodiacProb, mbtiProb, industryProb,
  ];
  const physicalPercentage = calculateJointProbability(allMarginalProbs);

  // 目標性別的總人口
  const targetGenderPopulation = genderProb * ADULT_POPULATION;
  // 預估人數必須使用實體人數比例
  const estimatedPopulation = Math.round(physicalPercentage * targetGenderPopulation);

  // 漏斗圖步驟（逐步累積篩選）
  const funnelSteps: FunnelStep[] = [];
  
  funnelSteps.push({
    label: `目標性別`,
    percentage: 1,
    population: Math.round(targetGenderPopulation),
    conditionalPercentage: 1,
  });

  let cumulativeCond = 1;      // 用於顯示機率
  let cumulativeMarginal = 1;  // 用於計算漏斗各層真實人數

  const steps = [
    { label: '年齡條件', probCond: ageProbCond, probMarginal: ageProbMarginal },
    { label: '身高條件', probCond: heightProb, probMarginal: heightProb },
    { label: '體重條件', probCond: weightProb, probMarginal: weightProb },
    { label: '學歷條件', probCond: eduProbCond, probMarginal: eduProbMarginal },
    { label: '收入條件', probCond: incomeProb, probMarginal: incomeProb },
    { label: '產業職業', probCond: industryProb, probMarginal: industryProb },
    { label: '婚姻狀態', probCond: marriageProbCond, probMarginal: marriageProbMarginal },
    { label: '居住區域', probCond: regionProb, probMarginal: regionProb },
    { label: '尋找星座', probCond: zodiacProb, probMarginal: zodiacProb },
    { label: 'MBTI', probCond: mbtiProb, probMarginal: mbtiProb },
  ];

  for (const step of steps) {
    cumulativeCond *= step.probCond;
    cumulativeMarginal *= step.probMarginal;
    funnelSteps.push({
      label: step.label,
      percentage: cumulativeMarginal, // 漏斗的物理寬度與比例使用實體累積
      population: Math.round(cumulativeMarginal * targetGenderPopulation),
      conditionalPercentage: cumulativeCond, // 記錄契合度
    });
  }

  return {
    finalPercentage,
    physicalPercentage,
    estimatedPopulation,
    funnelSteps,
    dimensionPercentages: {
      gender: genderProb,
      age: ageProbCond,
      height: heightProb,
      weight: weightProb,
      education: eduProbCond,
      income: incomeProb,
      marriage: marriageProbCond,
      region: regionProb,
      zodiac: zodiacProb,
      mbti: mbtiProb,
      industry: industryProb,
    },
  };
}
