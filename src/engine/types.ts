// ========================================
// 月老 Yue Lao — 型別定義
// ========================================

/** 性別 */
export type Gender = 'male' | 'female';

/** 年齡區間（對齊內政部婚姻統計 8 級制） */
export type AgeRange =
  | '<=20'
  | '21-25'
  | '26-30'
  | '31-35'
  | '36-40'
  | '41-45'
  | '46-50'
  | '50+';

/** 身高區間（公分） */
export type HeightRange =
  | '<155'
  | '155-159'
  | '160-164'
  | '165-169'
  | '170-174'
  | '175-179'
  | '180-184'
  | '185-189'
  | '190+';

/** 體重區間 */
export type WeightRange = 
  | '<45kg' 
  | '45-55kg' 
  | '55-65kg' 
  | '65-75kg' 
  | '75-85kg' 
  | '85-95kg' 
  | '95kg+';

/** 星座 */
export type Zodiac = 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

/** MBTI 人格 */
export type MBTIType = 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

/** 產業職業 */
export type Industry = 'tech_it' | 'manufacturing' | 'finance' | 'medical' | 'public_edu' | 'service_retail' | 'other';

/** 教育程度（對齊內政部婚姻統計 5 級制） */
export type Education =
  | 'below_high_school'
  | 'high_school'
  | 'college'
  | 'master'
  | 'doctoral';

/** 月收入（新台幣） */
export type IncomeRange =
  | '<30k'
  | '30k-50k'
  | '50k-70k'
  | '70k-100k'
  | '100k-150k'
  | '150k+';

/** 婚姻狀態 */
export type MarriageStatus =
  | 'single'
  | 'married'
  | 'divorced_widowed';

/** 居住區域 */
export type Region =
  | 'north'
  | 'central'
  | 'south'
  | 'east_island';

/** 篩選條件 */
export interface FilterCriteria {
  gender: Gender;
  /** 用戶自身年齡層（用於交叉概率） */
  myAgeRange?: AgeRange;
  /** 用戶自身學歷（用於交叉概率） */
  myEducation?: Education;
  ageRanges: AgeRange[];
  heightRanges: HeightRange[];
  weightRanges: WeightRange[];
  educations: Education[];
  incomeRanges: IncomeRange[];
  marriageStatuses: MarriageStatus[];
  regions: Region[];
  zodiacs: Zodiac[];
  mbtis: MBTIType[];
  industries: Industry[];
}

/** 分布數據（某維度各數值的百分比分布） */
export type Distribution<T extends string> = Partial<Record<T, number>>;

/** 按性別分的分布 */
export type GenderedDistribution<T extends string> = Record<Gender, Distribution<T>>;

/** 交叉分布矩陣（row=自己, col=對方, 值=條件概率） */
export type CrossDistributionMatrix<T extends string> = Record<T, Record<T, number>>;

/** 單步篩選結果 */
export interface FunnelStep {
  label: string;
  /** 實體累積比例 (Marginal cumulative) 用於漏斗寬度與物理計算 */
  percentage: number;
  /** 對應的物理實體過濾人數 */
  population: number;
  /** 婚配命中率 (Conditional cumulative) 用於說明 */
  conditionalPercentage?: number;
}

/** 分析結果 */
export interface AnalysisResult {
  /** 聯合目標機率（有填我的條件時為婚配命中率） */
  finalPercentage: number;
  /** 實體人口聯合機率（純邊際物理比例） */
  physicalPercentage: number;
  /** 預估全台符合條件人數 */
  estimatedPopulation: number;
  /** 漏斗圖各層數據 */
  funnelSteps: FunnelStep[];
  /** 各維度的篩選比例（用於顯示 UI Chip 的獨立數字） */
  dimensionPercentages: {
    gender: number;
    age: number;
    height: number;
    weight: number;
    education: number;
    income: number;
    marriage: number;
    region: number;
    zodiac: number;
    mbti: number;
    industry: number;
  };
}

/** 標籤映射 */
export const AGE_LABELS: Record<AgeRange, string> = {
  '<=20': '20 歲以下',
  '21-25': '21-25 歲',
  '26-30': '26-30 歲',
  '31-35': '31-35 歲',
  '36-40': '36-40 歲',
  '41-45': '41-45 歲',
  '46-50': '46-50 歲',
  '50+': '50 歲以上',
};

export const HEIGHT_LABELS: Record<HeightRange, string> = {
  '<155': '155 以下',
  '155-159': '155-159',
  '160-164': '160-164',
  '165-169': '165-169',
  '170-174': '170-174',
  '175-179': '175-179',
  '180-184': '180-184',
  '185-189': '185-189',
  '190+': '190 以上',
};

export const WEIGHT_LABELS: Record<WeightRange, string> = {
  '<45kg': '45 以下',
  '45-55kg': '45-55kg',
  '55-65kg': '55-65kg',
  '65-75kg': '65-75kg',
  '75-85kg': '75-85kg',
  '85-95kg': '85-95kg',
  '95kg+': '95 以上',
};

export const ZODIAC_LABELS: Record<Zodiac, string> = {
  aries: '牡羊座', taurus: '金牛座', gemini: '雙子座',
  cancer: '巨蟹座', leo: '獅子座', virgo: '處女座',
  libra: '天秤座', scorpio: '天蠍座', sagittarius: '射手座',
  capricorn: '摩羯座', aquarius: '水瓶座', pisces: '雙魚座',
};

export const INDUSTRY_LABELS: Record<Industry, string> = {
  tech_it: '科技資訊',
  manufacturing: '製造營造',
  finance: '金融保險',
  medical: '醫療保健',
  public_edu: '教育軍公教',
  service_retail: '服務餐飲',
  other: '其他',
};

export const MBTI_LABELS: Record<MBTIType, string> = {
  INTJ: 'INTJ', INTP: 'INTP', ENTJ: 'ENTJ', ENTP: 'ENTP',
  INFJ: 'INFJ', INFP: 'INFP', ENFJ: 'ENFJ', ENFP: 'ENFP',
  ISTJ: 'ISTJ', ISFJ: 'ISFJ', ESTJ: 'ESTJ', ESFJ: 'ESFJ',
  ISTP: 'ISTP', ISFP: 'ISFP', ESTP: 'ESTP', ESFP: 'ESFP',
};

export const EDUCATION_LABELS: Record<Education, string> = {
  below_high_school: '國中以下',
  high_school: '高中(職)',
  college: '專科及大學',
  master: '碩士',
  doctoral: '博士',
};

export const INCOME_LABELS: Record<IncomeRange, string> = {
  '<30k': '3 萬以下',
  '30k-50k': '3-5 萬',
  '50k-70k': '5-7 萬',
  '70k-100k': '7-10 萬',
  '100k-150k': '10-15 萬',
  '150k+': '15 萬以上',
};

export const MARRIAGE_LABELS: Record<MarriageStatus, string> = {
  single: '未婚',
  married: '已婚',
  divorced_widowed: '離婚/喪偶',
};

export const REGION_LABELS: Record<Region, string> = {
  north: '北部',
  central: '中部',
  south: '南部',
  east_island: '東部與離島',
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: '男性',
  female: '女性',
};
