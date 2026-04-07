// ========================================
// MBTI 分布 — 基於台灣/亞洲地區 MBTI 統計推估
// ========================================
import type { MBTIType, Distribution } from '../engine/types';

/**
 * MBTI 16 型人格分布
 * 根據全球及地區性統計，SJ 守護者比例最高，NT 及部分 NF 較低
 */
export const MBTI_DISTRIBUTION: Distribution<MBTIType> = {
  // SJ 守護者 (約 45%)
  ISFJ: 0.13,
  ESFJ: 0.12,
  ISTJ: 0.11,
  ESTJ: 0.09,

  // SP 探險家 (約 25%)
  ISFP: 0.08,
  ESFP: 0.08,
  ISTP: 0.05,
  ESTP: 0.04,

  // NF 外交家 (約 18%)
  INFP: 0.06,
  ENFP: 0.06,
  ENFJ: 0.04,
  INFJ: 0.02, // 通常為最稀有

  // NT 分析家 (約 12%)
  INTP: 0.04,
  ENTP: 0.03,
  INTJ: 0.03,
  ENTJ: 0.02,
};
