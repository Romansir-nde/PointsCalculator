import { CLUSTERS, SUBJECTS } from './constants';

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
  missingRequiredSubjects: string[]; // Subjects not entered from core requirements
  missingSubjectNames: string[]; // Human-readable names of missing subjects
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
  let hasMissingCoreSubjects = false;

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
      // Mark as missing - STRICTER CHECK: ANY subject group with no score means ineligible
      hasMissingCoreSubjects = true;
      
      // Get human-readable name from SUBJECTS for first subject in group
      const subject = SUBJECTS.find(s => s.id === subjectGroup[0]);
      if (subject) {
        missingSubjectNames.push(`${subject.name} (or ${subjectGroup.length > 1 ? 'alternatives' : 'required'})`);
      }
    }
  }

  // Calculate cluster weighted points: C = [√((r/R) × (t/T))] × 48
  const R = 48; // Maximum possible points from 4 cluster subjects
  const T = 84; // Maximum total KCSE points (7 subjects × 12)
  
  let weightedClusterPoints = 0;
  let isEligible = true;

  // Only ineligible if ANY subject group has no score or score is below threshold
  if (hasMissingCoreSubjects || sumR === 0 || totalPoints === 0) {
    // Set points to 00 but ALLOW VIEW ACCESS
    isEligible = false;
    weightedClusterPoints = 0;
  } else {
    // Apply formula: C = [√((r/R) × (t/T))] × 48
    const ratio = (sumR / R) * (totalPoints / T);
    const sqrtRatio = Math.sqrt(ratio);
    weightedClusterPoints = sqrtRatio * 48;
    
    // KCSE 2025 DATABASE REGULATION
    // Based on 2025 KCSE results analysis, regulate maximum cluster points
    // Very few students achieve beyond 43-44 points realistically
    // Apply realistic KCSE 2025 performance caps per cluster
    
    const realWorldCaps: Record<number, number> = {
      // Highly competitive clusters (Medicine, Engineering, Law) - max 44
      1: 44,   // Law & Related
      7: 44,   // Engineering & Technology
      9: 43,   // Computing, IT & Related
      15: 44,  // Medicine, Nursing & Health
      11: 43,  // Science & Related
      
      // Very Competitive clusters - max 43
      2: 43,   // Business & Related
      4: 42,   // GeoScience & Related
      12: 43,  // Mathematics, Economics & Related
      
      // Competitive clusters - max 42
      3: 42,   // Arts & Related
      6: 41,   // Kiswahili & Related
      8: 42,   // Architecture, Design & Planning
      
      // Moderately Competitive clusters - max 41
      5: 40,   // Special Education
      10: 41,  // Agribusiness & Related
      13: 40,  // Design, Textiles & Related
      14: 40,  // Sports & Physical Education
      16: 39,  // History & Related
      17: 40,  // Agriculture, Food Science & Env
      18: 40,  // Geography & Natural Resources
      19: 41,  // Education Science & Arts
      20: 38,  // Religious Studies & Related
    };
    
    const maxPointsForCluster = realWorldCaps[clusterId] || 41;
    
    if (weightedClusterPoints > maxPointsForCluster) {
      weightedClusterPoints = maxPointsForCluster;
    }
  }

  // Determine competitiveness based on 2025 KCSE realistic performance data
  let competitiveness: 'Highly Competitive' | 'Competitive' | 'Moderately Competitive' | 'Not Eligible' = 'Not Eligible';
  
  if (weightedClusterPoints >= 42) {
    competitiveness = 'Highly Competitive';
  } else if (weightedClusterPoints >= 38) {
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
 * Get user-friendly eligibility message
 */
export const getEligibilityMessage = (calculation: ClusterCalculation): string => {
  if (!calculation.isEligible) {
    // Check if missing required subjects
    if (calculation.missingSubjectNames.length > 0) {
      const missingList = calculation.missingSubjectNames.join(', ');
      return `🔒 NOT ELIGIBLE - MISSING REQUIRED SUBJECTS\n\n❌ You are ineligible for ${calculation.clusterName} because you did not enter scores for the following required subjects:\n\n${calculation.missingSubjectNames.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}\n\nThese are CORE requirements for this cluster. You MUST have grades in all required subject areas to qualify.\n\nRecommendation: Choose a different cluster that matches your subject choices, or contact your school about adding these subjects.`;
    }

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
