import type { EmissionStats } from "./types";

export type GreedLevel = "low" | "moderate" | "high" | "extreme";

export interface ComponentScores {
  whaleConcentration: number; // 0-100
  upgradeRate: number; // 0-100
  hiddenRatio: number; // 0-100
  refundRate: number; // 0-100 (inverse - lower refunds = higher greed)
  ownerDispersion: number; // 0-100 (inverse - fewer owners = higher greed)
}

export interface GreedIndex {
  collectionName: string;
  greed: number; // 0-100
  fear: number; // 0-100 (inverse of greed)
  components: ComponentScores;
  level: GreedLevel;
}

export function calculateFearGreedIndex(
  collectionName: string,
  stats: EmissionStats,
): GreedIndex {
  const components = calculateComponents(stats);

  // Weighted sum (0-100). Higher means more greed.
  const greed = clamp01to100(
    components.whaleConcentration * 0.3 +
      components.upgradeRate * 0.25 +
      components.hiddenRatio * 0.2 +
      components.refundRate * 0.15 +
      components.ownerDispersion * 0.1,
  );

  return {
    collectionName,
    greed,
    fear: clamp01to100(100 - greed),
    components,
    level: getGreedLevel(greed),
  };
}

function clamp01to100(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function calculateComponents(stats: EmissionStats): ComponentScores {
  const emission = stats.emission;
  if (emission <= 0) {
    return {
      whaleConcentration: 0,
      upgradeRate: 0,
      hiddenRatio: 0,
      refundRate: 0,
      ownerDispersion: 0,
    };
  }

  const whaleHold = stats.top_30_whales_hold ?? 0;
  const whaleConcentration = Math.min(100, (whaleHold / emission) * 100);

  const upgradeRate = Math.min(100, (stats.upgraded / emission) * 100);
  const hiddenRatio = Math.min(100, (stats.hidden / emission) * 100);

  // Lower refunds => higher greed score.
  const refundRate = Math.max(0, 100 - Math.min(100, (stats.refunded / emission) * 100));

  const ownerRatio = stats.unique_owners > 0 ? stats.unique_owners / emission : 0;
  const ownerDispersion = Math.max(0, 100 - Math.min(100, ownerRatio * 100));

  return {
    whaleConcentration,
    upgradeRate,
    hiddenRatio,
    refundRate,
    ownerDispersion,
  };
}

function getGreedLevel(score: number): GreedLevel {
  if (score < 25) return "low";
  if (score < 50) return "moderate";
  if (score < 75) return "high";
  return "extreme";
}

export function calculateAverageGreed(collections: Record<string, EmissionStats>): number {
  const entries = Object.entries(collections);
  if (entries.length === 0) return 0;

  const total = entries.reduce((sum, [name, stats]) => {
    return sum + calculateFearGreedIndex(name, stats).greed;
  }, 0);

  return total / entries.length;
}

export function getTopGreediestCollections(
  collections: Record<string, EmissionStats>,
  limit: number,
): GreedIndex[] {
  return Object.entries(collections)
    .map(([name, stats]) => calculateFearGreedIndex(name, stats))
    .sort((a, b) => b.greed - a.greed)
    .slice(0, limit);
}
