import { CLUSTERS } from './constants';

/**
 * KUCCPS Weighted Cluster Points Formula
 * C = [√((r/R) × (t/T))] × 48
 * 
 * Where:
 * r = Sum of points from your four relevant cluster subjects
 * R = Maximum possible points from those four subjects (12 × 4 = 48)
 * t = Your total KCSE aggregate grade points (sum of all 7 subjects)
 * T = Maximum total grade points possible in KCSE (7 subjects × 12 = 84)
 * C = Calculated cluster weighted points (max 48)
 */

export interface ClusterCalculation {
  clusterId: number;
  clusterName: string;
  relevantSubjects: string[];
  subjectPoints: number[];
  sumR: number; // r - sum of cluster subject points
  maxR: number; // R - max possible (48)
  totalPoints: number; // t - total KCSE points
  maxTotal: number; // T - max possible (84)
  isEligible: boolean;
  weightedClusterPoints: number;
  competitiveness: 'Highly Competitive' | 'Competitive' | 'Moderately Competitive' | 'Not Eligible';
}

/**
 * Calculate weighted cluster points using official KUCCPS formula
 */
export const calculateWeightedClusterPoints = (
  selectedGrades: Record<string, number>,
  clusterId: number
): ClusterCalculation => {
  const cluster = CLUSTERS.find(c => c.id === clusterId);
  if (!cluster) {
    return {
      clusterId,
      clusterName: 'Unknown',
      relevantSubjects: [],
      subjectPoints: [],
      sumR: 0,
      maxR: 48,
      totalPoints: 0,
      maxTotal: 84,
      isEligible: false,
      weightedClusterPoints: 0,
      competitiveness: 'Not Eligible',
    };
  }

  // Get total points (t)
  const totalPoints = Object.values(selectedGrades).reduce((sum, points) => sum + points, 0);

  // Get sum of cluster-relevant subject points (r)
  let sumR = 0;
  const relevantSubjects: string[] = [];
  const subjectPoints: number[] = [];

  // For each subject group in the cluster, take the highest scoring subject
  for (const subjectGroup of cluster.subjects) {
    const groupPoints = subjectGroup
      .map(subjectId => selectedGrades[subjectId] || 0)
      .sort((a, b) => b - a)[0]; // Get highest score in group
    
    if (groupPoints > 0) {
      sumR += groupPoints;
      subjectPoints.push(groupPoints);
      // Find the subject name (this is simplified, you'd need subject mapping)
      const subjectWithMaxPoints = subjectGroup.find(id => (selectedGrades[id] || 0) === groupPoints);
      if (subjectWithMaxPoints) {
        relevantSubjects.push(subjectWithMaxPoints);
      }
    }
  }

  // Calculate cluster weighted points: C = [√((r/R) × (t/T))] × 48
  const R = 48; // Maximum possible points from 4 cluster subjects
  const T = 84; // Maximum total KCSE points (7 subjects × 12)
  
  let weightedClusterPoints = 0;
  let isEligible = true;

  if (sumR === 0 || totalPoints === 0) {
    isEligible = false;
    weightedClusterPoints = 0;
  } else {
    // Apply formula: C = [√((r/R) × (t/T))] × 48
    const ratio = (sumR / R) * (totalPoints / T);
    const sqrtRatio = Math.sqrt(ratio);
    weightedClusterPoints = sqrtRatio * 48;
  }

  // Determine competitiveness based on typical KUCCPS cutoffs
  let competitiveness: 'Highly Competitive' | 'Competitive' | 'Moderately Competitive' | 'Not Eligible' = 'Not Eligible';
  
  if (weightedClusterPoints >= 45) {
    competitiveness = 'Highly Competitive';
  } else if (weightedClusterPoints >= 40) {
    competitiveness = 'Competitive';
  } else if (weightedClusterPoints >= 30) {
    competitiveness = 'Moderately Competitive';
  } else {
    isEligible = false;
    competitiveness = 'Not Eligible';
  }

  return {
    clusterId,
    clusterName: cluster.name,
    relevantSubjects,
    subjectPoints,
    sumR,
    maxR: R,
    totalPoints,
    maxTotal: T,
    isEligible,
    weightedClusterPoints: Math.round(weightedClusterPoints * 100) / 100, // Round to 2 decimals
    competitiveness,
  };
};

/**
 * Calculate all clusters and return sorted by competitiveness
 */
export const calculateAllClusters = (selectedGrades: Record<string, number>): ClusterCalculation[] => {
  return CLUSTERS.map(cluster =>
    calculateWeightedClusterPoints(selectedGrades, cluster.id)
  ).sort((a, b) => b.weightedClusterPoints - a.weightedClusterPoints);
};

/**
 * Get user-friendly eligibility message
 */
export const getEligibilityMessage = (calculation: ClusterCalculation): string => {
  if (!calculation.isEligible) {
    return `❌ NOT ELIGIBLE\n\nYour cluster weight of ${calculation.weightedClusterPoints.toFixed(2)} points is below the minimum requirement for ${calculation.clusterName}.\n\nMinimum typical requirement: 30+ points\nYour score: ${calculation.weightedClusterPoints.toFixed(2)} points\n\nConsider exploring other clusters or seeking academic guidance.`;
  }

  if (calculation.competitiveness === 'Highly Competitive') {
    return `✅ HIGHLY COMPETITIVE (${calculation.weightedClusterPoints.toFixed(2)} pts)\n\nExcellent standing! You are well-positioned for top-tier institutions and popular programmes in this cluster.`;
  }

  if (calculation.competitiveness === 'Competitive') {
    return `✅ COMPETITIVE (${calculation.weightedClusterPoints.toFixed(2)} pts)\n\nGood standing! You should have good placement prospects at most institutions offering this cluster.`;
  }

  if (calculation.competitiveness === 'Moderately Competitive') {
    return `⚠️ MODERATELY COMPETITIVE (${calculation.weightedClusterPoints.toFixed(2)} pts)\n\nYou qualify but have moderate competitiveness. Focus on institutions with slightly lower cutoffs or consider alternative clusters.`;
  }

  return `❌ NOT ELIGIBLE (${calculation.weightedClusterPoints.toFixed(2)} pts)\n\nUnfortunately, you don't meet the minimum requirements for this cluster.`;
};

export default calculateWeightedClusterPoints;
