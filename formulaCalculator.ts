import { CLUSTERS, SUBJECTS } from './constants';

/**
 * KUCCPS Weighted Cluster Points Formula
 * C = [√((r/R) × (t/T))] × 48
 * 
 * ALL CLUSTERS ARE PERMANENTLY ACCESSIBLE TO STUDENTS
 * No restrictions based on missing subjects or low points
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
  isEligible: boolean; // Always true - all clusters accessible
  weightedClusterPoints: number;
  competitiveness: 'Highly Competitive' | 'Competitive' | 'Moderately Competitive';
  missingRequiredSubjects: string[]; // For information only - doesn't block access
  missingSubjectNames: string[]; // For information only - doesn't block access
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
      isEligible: true,
      weightedClusterPoints: 0,
      competitiveness: 'Moderately Competitive',
      missingRequiredSubjects: [],
      missingSubjectNames: [],
    };
  }

  // Get total points (t)
  const totalPoints = Object.values(selectedGrades).reduce((sum, points) => sum + points, 0);

  // Track missing CORE subjects (only check single-subject groups which are mandatory)
  const missingRequiredSubjects: string[] = [];
  const missingSubjectNames: string[] = [];
  
  // Get sum of cluster-relevant subject points (r)
  let sumR = 0;
  const relevantSubjects: string[] = [];
  const subjectPoints: number[] = [];

  // For each subject group in the cluster, take the highest scoring subject
  for (let i = 0; i < cluster.subjects.length; i++) {
    const subjectGroup = cluster.subjects[i];
    const groupPoints = subjectGroup
      .map(subjectId => selectedGrades[subjectId] || 0)
      .sort((a, b) => b - a)[0]; // Get highest score in group
    
    if (groupPoints > 0) {
      sumR += groupPoints;
      subjectPoints.push(groupPoints);
      // Find the subject name
      const subjectWithMaxPoints = subjectGroup.find(id => (selectedGrades[id] || 0) === groupPoints);
      if (subjectWithMaxPoints) {
        relevantSubjects.push(subjectWithMaxPoints);
      }
    } else {
      // Only mark as missing if this is a CORE subject (single-item array = mandatory)
      if (subjectGroup.length === 1) {
        const coreSubjectId = subjectGroup[0];
        missingRequiredSubjects.push(coreSubjectId);
        
        // Get human-readable name from SUBJECTS
        const subject = SUBJECTS.find(s => s.id === coreSubjectId);
        if (subject) {
          missingSubjectNames.push(subject.name);
        }
      }
    }
  }

  // Calculate cluster weighted points - always calculate regardless of missing subjects
  const R = 48; // Maximum possible points from 4 cluster subjects
  const T = 84; // Maximum total KCSE points (7 subjects × 12)
  
  let weightedClusterPoints = 0;
  let isEligible = true; // Always eligible - all clusters accessible

  // Calculate points even if some subjects are missing
  if (sumR > 0 && totalPoints > 0) {
    // Calculate raw formula result using official KUCCPS formula
    // C = [√((r/R) × (t/T))] × 48
    const ratio = (sumR / R) * (totalPoints / T);
    const sqrtRatio = Math.sqrt(ratio);
    weightedClusterPoints = sqrtRatio * 48;
  } else {
    // Even with 0 points, keep cluster accessible
    weightedClusterPoints = 0;
  }

  // Determine competitiveness based on actual calculated points
  let competitiveness: 'Highly Competitive' | 'Competitive' | 'Moderately Competitive' = 'Moderately Competitive';
  
  if (weightedClusterPoints >= 40) {
    competitiveness = 'Highly Competitive';
  } else if (weightedClusterPoints >= 35) {
    competitiveness = 'Competitive';
  } else if (weightedClusterPoints >= 0) {
    competitiveness = 'Moderately Competitive';
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
    missingRequiredSubjects,
    missingSubjectNames,
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
 * Get user-friendly eligibility message - ALL CLUSTERS ALWAYS ACCESSIBLE
 */
export const getEligibilityMessage = (calculation: ClusterCalculation): string => {
  if (calculation.competitiveness === 'Highly Competitive') {
    return `✅ HIGHLY COMPETITIVE (${calculation.weightedClusterPoints.toFixed(2)} pts)\n\nExcellent standing! You are well-positioned for top-tier institutions and popular programmes in this cluster.`;
  }

  if (calculation.competitiveness === 'Competitive') {
    return `✅ COMPETITIVE (${calculation.weightedClusterPoints.toFixed(2)} pts)\n\nGood standing! You should have good placement prospects at most institutions offering this cluster.`;
  }

  return `⚠️ ACCESSIBLE (${calculation.weightedClusterPoints.toFixed(2)} pts)\n\nThis cluster is accessible to you. Review the course listings and university cutoffs to find suitable programmes.`;
};

export default calculateWeightedClusterPoints;
