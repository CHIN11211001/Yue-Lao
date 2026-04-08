// ========================================
// 婚姻配對交叉概率矩陣
// 資料來源：114 年第 25 週內政統計通報
// 112 年 7 月至 113 年 6 月結婚登記
// ========================================
import type { AgeRange, Education, CrossDistributionMatrix } from '../engine/types';

/**
 * 年齡層別結婚配對 — 條件概率矩陣
 *
 * AGE_CROSS_MATRIX[myAge][targetAge] = P(對方年齡=targetAge | 我的年齡=myAge)
 *
 * 計算方式：表 1 中每格除以該列（男方）合計或該行（女方）合計
 * 例如 男方 26-30 歲，女方 26-30 歲 = 18.67 / 27.72 ≈ 0.6735
 *
 * male: 以男方年齡為 row，查女方年齡的條件概率
 * female: 以女方年齡為 row，查男方年齡的條件概率
 */

// ---- 男方視角：P(女方年齡 | 男方年齡) ----
// 原始數據（單位 %，每列加總 = 男性該年齡層合計）
const RAW_AGE_MALE: Record<AgeRange, [number, number, number, number, number, number, number, number]> = {
  '<=20': [0.58, 0.30, 0.03, 0.01, 0.00, 0.00, 0.00, 0.00], // 合計 0.93 (實際 0.92，取通報值)
  '21-25': [0.88, 4.71, 1.54, 0.25, 0.04, 0.01, 0.00, 0.00], // 合計 7.44 (實際 7.43)
  '26-30': [0.31, 4.35, 18.67, 3.73, 0.52, 0.12, 0.02, 0.00], // 合計 27.72
  '31-35': [0.10, 1.30, 10.59, 15.55, 2.17, 0.45, 0.08, 0.02], // 合計 30.26
  '36-40': [0.02, 0.36, 2.44, 6.12, 4.94, 1.06, 0.17, 0.04], // 合計 15.17 (實際 15.15)
  '41-45': [0.01, 0.12, 0.62, 1.76, 2.65, 2.34, 0.48, 0.10], // 合計 8.09 (實際 8.08)
  '46-50': [0.01, 0.03, 0.11, 0.35, 0.69, 1.20, 0.99, 0.29], // 合計 3.72 (實際 3.67)
  '50+': [0.00, 0.01, 0.05, 0.14, 0.32, 0.84, 1.34, 3.97],   // 合計 6.67
};

// ---- 女方視角：P(男方年齡 | 女方年齡) ----
// 原始數據（每欄加總 = 女性該年齡層合計）
// 需要把上面的矩陣轉置
const RAW_AGE_FEMALE: Record<AgeRange, [number, number, number, number, number, number, number, number]> = {
  '<=20': [0.58, 0.88, 0.31, 0.10, 0.02, 0.01, 0.01, 0.00], // 合計 1.90 (實際 1.91)
  '21-25': [0.30, 4.71, 4.35, 1.30, 0.36, 0.12, 0.03, 0.01], // 合計 11.19 (實際 11.18)
  '26-30': [0.03, 1.54, 18.67, 10.59, 2.44, 0.62, 0.11, 0.05], // 合計 34.05
  '31-35': [0.01, 0.25, 3.73, 15.55, 6.12, 1.76, 0.35, 0.14], // 合計 27.93 (實際 27.91)
  '36-40': [0.00, 0.04, 0.52, 2.17, 4.94, 2.65, 0.69, 0.32], // 合計 11.34 (實際 11.33)
  '41-45': [0.00, 0.01, 0.12, 0.45, 1.06, 2.34, 1.20, 0.84], // 合計 6.07 (實際 6.02)
  '46-50': [0.00, 0.00, 0.02, 0.08, 0.17, 0.48, 0.99, 1.34], // 合計 3.09 (實際 3.08)
  '50+': [0.00, 0.00, 0.00, 0.02, 0.04, 0.10, 0.29, 3.97],   // 合計 4.43 (實際 4.42)
};

const AGE_KEYS: AgeRange[] = ['<=20', '21-25', '26-30', '31-35', '36-40', '41-45', '46-50', '50+'];

function buildCrossMatrix<T extends string>(
  raw: Record<T, number[]>,
  keys: T[],
  totals: Record<T, number>,
): CrossDistributionMatrix<T> {
  const matrix = {} as CrossDistributionMatrix<T>;
  for (const myKey of keys) {
    const row = {} as Record<T, number>;
    const total = totals[myKey];
    for (let i = 0; i < keys.length; i++) {
      row[keys[i]] = total > 0 ? raw[myKey][i] / total : 0;
    }
    matrix[myKey] = row;
  }
  return matrix;
}

// 男性各年齡層合計
const MALE_AGE_TOTALS: Record<AgeRange, number> = {
  '<=20': 0.93, '21-25': 7.44, '26-30': 27.72, '31-35': 30.26,
  '36-40': 15.17, '41-45': 8.09, '46-50': 3.72, '50+': 6.67,
};

// 女性各年齡層合計
const FEMALE_AGE_TOTALS: Record<AgeRange, number> = {
  '<=20': 1.90, '21-25': 11.19, '26-30': 34.05, '31-35': 27.93,
  '36-40': 11.34, '41-45': 6.07, '46-50': 3.09, '50+': 4.43,
};

/**
 * 年齡交叉概率矩陣（按性別分）
 *
 * AGE_CROSS_MATRIX.male[myAge][targetFemaleAge] = P(女方年齡 | 男方年齡)
 * AGE_CROSS_MATRIX.female[myAge][targetMaleAge] = P(男方年齡 | 女方年齡)
 */
export const AGE_CROSS_MATRIX = {
  male: buildCrossMatrix(RAW_AGE_MALE, AGE_KEYS, MALE_AGE_TOTALS),
  female: buildCrossMatrix(RAW_AGE_FEMALE, AGE_KEYS, FEMALE_AGE_TOTALS),
};

// ========================================
// 教育程度交叉概率矩陣
// ========================================

type EduKey = Education;
const EDU_KEYS: EduKey[] = ['below_high_school', 'high_school', 'college', 'master', 'doctoral'];

// ---- 男方視角：P(女方學歷 | 男方學歷) ----
const RAW_EDU_MALE: Record<EduKey, [number, number, number, number, number]> = {
  below_high_school: [1.35, 1.86, 1.02, 0.05, 0.00], // 合計 4.28
  high_school:       [1.70, 8.98, 10.36, 0.37, 0.01], // 合計 21.42
  college:           [0.83, 6.42, 44.27, 4.88, 0.14], // 合計 56.54
  master:            [0.07, 0.41, 10.48, 5.52, 0.16], // 合計 16.64
  doctoral:          [0.00, 0.02, 0.53, 0.50, 0.08],  // 合計 1.13
};

// ---- 女方視角：P(男方學歷 | 女方學歷) ----
const RAW_EDU_FEMALE: Record<EduKey, [number, number, number, number, number]> = {
  below_high_school: [1.35, 1.70, 0.83, 0.07, 0.00], // 合計 3.95
  high_school:       [1.86, 8.98, 6.42, 0.41, 0.02], // 合計 17.69
  college:           [1.02, 10.36, 44.27, 10.48, 0.53], // 合計 66.66
  master:            [0.05, 0.37, 4.88, 5.52, 0.50],  // 合計 11.32
  doctoral:          [0.00, 0.01, 0.14, 0.16, 0.08],  // 合計 0.39
};

const MALE_EDU_TOTALS: Record<EduKey, number> = {
  below_high_school: 4.28, high_school: 21.42, college: 56.54,
  master: 16.64, doctoral: 1.13,
};

const FEMALE_EDU_TOTALS: Record<EduKey, number> = {
  below_high_school: 3.95, high_school: 17.69, college: 66.66,
  master: 11.32, doctoral: 0.39,
};

/**
 * 教育程度交叉概率矩陣（按性別分）
 *
 * EDUCATION_CROSS_MATRIX.male[myEdu][targetFemaleEdu] = P(女方學歷 | 男方學歷)
 * EDUCATION_CROSS_MATRIX.female[myEdu][targetMaleEdu] = P(男方學歷 | 女方學歷)
 */
export const EDUCATION_CROSS_MATRIX = {
  male: buildCrossMatrix(RAW_EDU_MALE, EDU_KEYS, MALE_EDU_TOTALS),
  female: buildCrossMatrix(RAW_EDU_FEMALE, EDU_KEYS, FEMALE_EDU_TOTALS),
};
