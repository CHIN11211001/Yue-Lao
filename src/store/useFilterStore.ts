// ========================================
// Zustand 全域狀態管理
// ========================================
import { create } from 'zustand';
import type {
  Gender,
  AgeRange,
  HeightRange,
  WeightRange,
  Education,
  IncomeRange,
  MarriageStatus,
  Region,
  Zodiac,
  MBTIType,
  Industry,
  FilterCriteria,
  AnalysisResult,
} from '../engine/types';
import { calculateAnalysis } from '../engine/calculator';

interface FilterState extends FilterCriteria {
  /** 分析結果 */
  result: AnalysisResult;

  /** 動作 */
  setGender: (gender: Gender) => void;
  toggleAgeRange: (range: AgeRange) => void;
  toggleHeightRange: (range: HeightRange) => void;
  toggleWeightRange: (range: WeightRange) => void;
  toggleEducation: (edu: Education) => void;
  toggleIncomeRange: (range: IncomeRange) => void;
  toggleMarriageStatus: (status: MarriageStatus) => void;
  toggleRegion: (region: Region) => void;
  toggleZodiac: (zodiac: Zodiac) => void;
  toggleMbti: (mbti: MBTIType) => void;
  toggleIndustry: (industry: Industry) => void;
  resetAll: () => void;
}

const DEFAULT_CRITERIA: FilterCriteria = {
  gender: 'male',
  ageRanges: [],
  heightRanges: [],
  weightRanges: [],
  educations: [],
  incomeRanges: [],
  marriageStatuses: [],
  regions: [],
  zodiacs: [],
  mbtis: [],
  industries: [],
};

function toggleInArray<T>(arr: T[], item: T): T[] {
  return arr.includes(item)
    ? arr.filter((i) => i !== item)
    : [...arr, item];
}

function recalculate(criteria: FilterCriteria): AnalysisResult {
  return calculateAnalysis(criteria);
}

export const useFilterStore = create<FilterState>((set) => ({
  ...DEFAULT_CRITERIA,
  result: recalculate(DEFAULT_CRITERIA),

  setGender: (gender) =>
    set((state) => {
      const next = { ...state, gender };
      return { gender, result: recalculate(next) };
    }),

  toggleAgeRange: (range) =>
    set((state) => {
      const ageRanges = toggleInArray(state.ageRanges, range);
      const next = { ...state, ageRanges };
      return { ageRanges, result: recalculate(next) };
    }),

  toggleHeightRange: (range) =>
    set((state) => {
      const heightRanges = toggleInArray(state.heightRanges, range);
      const next = { ...state, heightRanges };
      return { heightRanges, result: recalculate(next) };
    }),

  toggleWeightRange: (range) =>
    set((state) => {
      const weightRanges = toggleInArray(state.weightRanges, range);
      const next = { ...state, weightRanges };
      return { weightRanges, result: recalculate(next) };
    }),

  toggleEducation: (edu) =>
    set((state) => {
      const educations = toggleInArray(state.educations, edu);
      const next = { ...state, educations };
      return { educations, result: recalculate(next) };
    }),

  toggleIncomeRange: (range) =>
    set((state) => {
      const incomeRanges = toggleInArray(state.incomeRanges, range);
      const next = { ...state, incomeRanges };
      return { incomeRanges, result: recalculate(next) };
    }),

  toggleMarriageStatus: (status) =>
    set((state) => {
      const marriageStatuses = toggleInArray(state.marriageStatuses, status);
      const next = { ...state, marriageStatuses };
      return { marriageStatuses, result: recalculate(next) };
    }),

  toggleRegion: (region) =>
    set((state) => {
      const regions = toggleInArray(state.regions, region);
      const next = { ...state, regions };
      return { regions, result: recalculate(next) };
    }),

  toggleZodiac: (zodiac) =>
    set((state) => {
      const zodiacs = toggleInArray(state.zodiacs, zodiac);
      const next = { ...state, zodiacs };
      return { zodiacs, result: recalculate(next) };
    }),

  toggleMbti: (mbti) =>
    set((state) => {
      const mbtis = toggleInArray(state.mbtis, mbti);
      const next = { ...state, mbtis };
      return { mbtis, result: recalculate(next) };
    }),

  toggleIndustry: (industry) =>
    set((state) => {
      const industries = toggleInArray(state.industries, industry);
      const next = { ...state, industries };
      return { industries, result: recalculate(next) };
    }),

  resetAll: () =>
    set(() => ({
      ...DEFAULT_CRITERIA,
      result: recalculate(DEFAULT_CRITERIA),
    })),
}));
