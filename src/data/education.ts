// ========================================
// 學歷分布 — 對齊 114 年第 25 週內政統計通報 表 2
// 教育程度別結婚對數占比（112 年 7 月至 113 年 6 月）
// ========================================
import type { Education, GenderedDistribution } from '../engine/types';

/**
 * 台灣成年人口教育程度分布（5 級制）
 * 基準：依據教育部/內政部全台 15 歲以上人口教育程度粗估
 * 高等教育擴張，加上高齡長者教育程度，形成以下整體物理佔比
 */
export const EDUCATION_DISTRIBUTION: GenderedDistribution<Education> = {
  male: {
    below_high_school: 0.22,  // 國中及以下
    high_school: 0.31,        // 高中(職)
    college: 0.36,            // 專科及大學
    master: 0.09,             // 碩士
    doctoral: 0.02,           // 博士
  },
  female: {
    below_high_school: 0.26,  // 國中及以下（高齡女性較多）
    high_school: 0.29,        // 高中(職)
    college: 0.38,            // 專科及大學
    master: 0.065,            // 碩士
    doctoral: 0.005,          // 博士
  },
};
