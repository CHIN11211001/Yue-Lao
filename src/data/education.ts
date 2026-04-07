// ========================================
// 學歷分布 — 基於 2023 主計總處人力資源調查
// ========================================
import type { Education, GenderedDistribution } from '../engine/types';

/**
 * 25 歲以上成年人教育程度分布
 * 資料來源：行政院主計總處人力資源調查統計
 */
export const EDUCATION_DISTRIBUTION: GenderedDistribution<Education> = {
  male: {
    below_high_school: 0.125,  // 國中以下 12.5%
    high_school: 0.280,        // 高中職 28.0%
    vocational: 0.105,         // 專科 10.5%
    bachelor: 0.350,           // 大學 35.0%
    master: 0.115,             // 碩士 11.5%
    doctoral: 0.025,           // 博士 2.5%
  },
  female: {
    below_high_school: 0.155,  // 國中以下 15.5%
    high_school: 0.240,        // 高中職 24.0%
    vocational: 0.115,         // 專科 11.5%
    bachelor: 0.370,           // 大學 37.0%
    master: 0.105,             // 碩士 10.5%
    doctoral: 0.015,           // 博士 1.5%
  },
};
