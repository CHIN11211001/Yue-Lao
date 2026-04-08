// ========================================
// 星座分布 — 基於全年出生比例推估
// ========================================
import type { Zodiac, Distribution } from '../engine/types';

/**
 * 星座分布
 * 實際上雖然有淡旺季（如天蠍、天秤略多），但統計上大致為均勻分佈
 * 每個星座約佔 8.33% (1/12)
 */
const avg = 1 / 12;

export const ZODIAC_DISTRIBUTION: Distribution<Zodiac> = {
  aries: avg - 0.005,       // 春季略少
  taurus: avg,
  gemini: avg,
  cancer: avg + 0.005,      // 夏秋交際微高
  leo: avg + 0.005,
  virgo: avg + 0.005,
  libra: avg + 0.005,
  scorpio: avg + 0.005,
  sagittarius: avg - 0.005, // 冬季略少
  capricorn: avg - 0.005,
  aquarius: avg - 0.005,
  pisces: avg - 0.005,
};
