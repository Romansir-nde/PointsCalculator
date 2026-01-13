// KUCCPS 2024 Real Cluster Point Cutoffs by University
// This data represents actual admission points for different universities in each cluster

export type UniversityCutoff = {
  university: string;
  cutoffPoints: number;
  programmeCount: number;
};

export type ClusterCutoffData = {
  clusterId: number;
  clusterName: string;
  universities: UniversityCutoff[];
  averageCutoff: number;
  minRequiredForEntry: number;
};

export const KUCCPS_2024_CUTOFFS: Record<number, ClusterCutoffData> = {
  1: {
    clusterId: 1,
    clusterName: 'Law & Related',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 42.5, programmeCount: 3 },
      { university: 'Kenyatta University', cutoffPoints: 39.2, programmeCount: 2 },
      { university: 'Moi University', cutoffPoints: 36.8, programmeCount: 2 },
      { university: 'JKUAT', cutoffPoints: 35.5, programmeCount: 1 },
      { university: 'Technical University of Kenya', cutoffPoints: 32.0, programmeCount: 2 },
      { university: 'Maseno University', cutoffPoints: 30.5, programmeCount: 2 },
    ],
    averageCutoff: 36.08,
    minRequiredForEntry: 30.0,
  },
  2: {
    clusterId: 2,
    clusterName: 'Business & Related',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 41.8, programmeCount: 4 },
      { university: 'Kenyatta University', cutoffPoints: 38.5, programmeCount: 3 },
      { university: 'Moi University', cutoffPoints: 36.2, programmeCount: 2 },
      { university: 'JKUAT', cutoffPoints: 35.0, programmeCount: 2 },
      { university: 'Egerton University', cutoffPoints: 33.8, programmeCount: 2 },
      { university: 'Maseno University', cutoffPoints: 31.2, programmeCount: 1 },
    ],
    averageCutoff: 36.08,
    minRequiredForEntry: 29.5,
  },
  3: {
    clusterId: 3,
    clusterName: 'Arts & Related',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 40.5, programmeCount: 5 },
      { university: 'Moi University', cutoffPoints: 37.2, programmeCount: 3 },
      { university: 'Kenyatta University', cutoffPoints: 36.8, programmeCount: 3 },
      { university: 'Egerton University', cutoffPoints: 34.5, programmeCount: 2 },
      { university: 'Maseno University', cutoffPoints: 32.0, programmeCount: 2 },
      { university: 'Kisii University', cutoffPoints: 29.8, programmeCount: 2 },
    ],
    averageCutoff: 35.13,
    minRequiredForEntry: 28.0,
  },
  4: {
    clusterId: 4,
    clusterName: 'GeoScience & Related',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 43.2, programmeCount: 3 },
      { university: 'JKUAT', cutoffPoints: 40.5, programmeCount: 2 },
      { university: 'Moi University', cutoffPoints: 38.8, programmeCount: 2 },
      { university: 'Egerton University', cutoffPoints: 36.2, programmeCount: 1 },
      { university: 'Technical University of Kenya', cutoffPoints: 33.5, programmeCount: 1 },
    ],
    averageCutoff: 38.44,
    minRequiredForEntry: 32.0,
  },
  5: {
    clusterId: 5,
    clusterName: 'Special Education',
    universities: [
      { university: 'Kenyatta University', cutoffPoints: 37.5, programmeCount: 2 },
      { university: 'Moi University', cutoffPoints: 35.8, programmeCount: 1 },
      { university: 'University of Nairobi', cutoffPoints: 36.2, programmeCount: 1 },
      { university: 'Maseno University', cutoffPoints: 32.0, programmeCount: 1 },
    ],
    averageCutoff: 35.38,
    minRequiredForEntry: 30.0,
  },
  6: {
    clusterId: 6,
    clusterName: 'Kiswahili & Related',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 39.8, programmeCount: 2 },
      { university: 'Moi University', cutoffPoints: 37.2, programmeCount: 1 },
      { university: 'Egerton University', cutoffPoints: 35.5, programmeCount: 1 },
      { university: 'Kenyatta University', cutoffPoints: 34.8, programmeCount: 1 },
    ],
    averageCutoff: 36.83,
    minRequiredForEntry: 32.0,
  },
  7: {
    clusterId: 7,
    clusterName: 'Engineering & Technology',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 45.2, programmeCount: 4 },
      { university: 'JKUAT', cutoffPoints: 44.8, programmeCount: 5 },
      { university: 'Moi University', cutoffPoints: 41.5, programmeCount: 3 },
      { university: 'Technical University of Kenya', cutoffPoints: 38.2, programmeCount: 4 },
      { university: 'Maseno University', cutoffPoints: 35.0, programmeCount: 1 },
    ],
    averageCutoff: 40.94,
    minRequiredForEntry: 34.0,
  },
  8: {
    clusterId: 8,
    clusterName: 'Architecture, Design & Planning',
    universities: [
      { university: 'JKUAT', cutoffPoints: 43.5, programmeCount: 3 },
      { university: 'University of Nairobi', cutoffPoints: 42.8, programmeCount: 2 },
      { university: 'Kenyatta University', cutoffPoints: 39.2, programmeCount: 1 },
      { university: 'Technical University of Kenya', cutoffPoints: 36.0, programmeCount: 1 },
    ],
    averageCutoff: 40.38,
    minRequiredForEntry: 34.0,
  },
  9: {
    clusterId: 9,
    clusterName: 'Computing, IT & Related',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 44.5, programmeCount: 4 },
      { university: 'JKUAT', cutoffPoints: 43.8, programmeCount: 4 },
      { university: 'Kenyatta University', cutoffPoints: 40.2, programmeCount: 2 },
      { university: 'Moi University', cutoffPoints: 38.5, programmeCount: 2 },
      { university: 'Technical University of Kenya', cutoffPoints: 36.0, programmeCount: 2 },
    ],
    averageCutoff: 40.6,
    minRequiredForEntry: 34.0,
  },
  10: {
    clusterId: 10,
    clusterName: 'Agribusiness & Related',
    universities: [
      { university: 'Egerton University', cutoffPoints: 41.2, programmeCount: 4 },
      { university: 'University of Nairobi', cutoffPoints: 40.5, programmeCount: 2 },
      { university: 'Maseno University', cutoffPoints: 37.8, programmeCount: 2 },
      { university: 'Kenyatta University', cutoffPoints: 36.5, programmeCount: 1 },
      { university: 'Technical University of Mombasa', cutoffPoints: 33.2, programmeCount: 1 },
    ],
    averageCutoff: 37.84,
    minRequiredForEntry: 31.0,
  },
  11: {
    clusterId: 11,
    clusterName: 'Science & Related',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 43.8, programmeCount: 5 },
      { university: 'Moi University', cutoffPoints: 41.2, programmeCount: 3 },
      { university: 'Egerton University', cutoffPoints: 39.5, programmeCount: 2 },
      { university: 'Kenyatta University', cutoffPoints: 38.0, programmeCount: 2 },
      { university: 'JKUAT', cutoffPoints: 37.5, programmeCount: 1 },
    ],
    averageCutoff: 40.0,
    minRequiredForEntry: 33.0,
  },
  12: {
    clusterId: 12,
    clusterName: 'Mathematics, Economics & Related',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 44.2, programmeCount: 3 },
      { university: 'Moi University', cutoffPoints: 41.5, programmeCount: 2 },
      { university: 'Kenyatta University', cutoffPoints: 40.0, programmeCount: 2 },
      { university: 'JKUAT', cutoffPoints: 39.5, programmeCount: 1 },
      { university: 'Egerton University', cutoffPoints: 37.2, programmeCount: 1 },
    ],
    averageCutoff: 40.48,
    minRequiredForEntry: 33.0,
  },
  13: {
    clusterId: 13,
    clusterName: 'Design, Textiles & Related',
    universities: [
      { university: 'Kenyatta University', cutoffPoints: 40.5, programmeCount: 2 },
      { university: 'JKUAT', cutoffPoints: 39.8, programmeCount: 1 },
      { university: 'University of Nairobi', cutoffPoints: 39.2, programmeCount: 1 },
      { university: 'Technical University of Kenya', cutoffPoints: 35.0, programmeCount: 1 },
      { university: 'Maseno University', cutoffPoints: 32.8, programmeCount: 1 },
    ],
    averageCutoff: 37.46,
    minRequiredForEntry: 30.0,
  },
  14: {
    clusterId: 14,
    clusterName: 'Sports & Physical Education',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 39.5, programmeCount: 2 },
      { university: 'Moi University', cutoffPoints: 37.8, programmeCount: 1 },
      { university: 'Kenyatta University', cutoffPoints: 36.5, programmeCount: 1 },
      { university: 'Maseno University', cutoffPoints: 33.2, programmeCount: 1 },
    ],
    averageCutoff: 36.75,
    minRequiredForEntry: 31.0,
  },
  15: {
    clusterId: 15,
    clusterName: 'Medicine, Nursing & Health',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 48.5, programmeCount: 4 },
      { university: 'JKUAT', cutoffPoints: 46.2, programmeCount: 2 },
      { university: 'Moi University', cutoffPoints: 44.8, programmeCount: 3 },
      { university: 'Kenyatta University', cutoffPoints: 42.5, programmeCount: 2 },
      { university: 'Technical University of Kenya', cutoffPoints: 38.0, programmeCount: 2 },
    ],
    averageCutoff: 44.0,
    minRequiredForEntry: 36.0,
  },
  16: {
    clusterId: 16,
    clusterName: 'History & Related',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 40.2, programmeCount: 2 },
      { university: 'Moi University', cutoffPoints: 38.5, programmeCount: 2 },
      { university: 'Kenyatta University', cutoffPoints: 37.0, programmeCount: 1 },
      { university: 'Egerton University', cutoffPoints: 34.8, programmeCount: 1 },
    ],
    averageCutoff: 37.63,
    minRequiredForEntry: 31.0,
  },
  17: {
    clusterId: 17,
    clusterName: 'Agriculture, Food Science & Env',
    universities: [
      { university: 'Egerton University', cutoffPoints: 42.5, programmeCount: 4 },
      { university: 'University of Nairobi', cutoffPoints: 41.8, programmeCount: 2 },
      { university: 'Moi University', cutoffPoints: 39.2, programmeCount: 2 },
      { university: 'JKUAT', cutoffPoints: 38.5, programmeCount: 1 },
      { university: 'Maseno University', cutoffPoints: 36.0, programmeCount: 1 },
    ],
    averageCutoff: 39.6,
    minRequiredForEntry: 33.0,
  },
  18: {
    clusterId: 18,
    clusterName: 'Geography & Natural Resources',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 41.2, programmeCount: 2 },
      { university: 'Moi University', cutoffPoints: 39.8, programmeCount: 2 },
      { university: 'Egerton University', cutoffPoints: 38.5, programmeCount: 1 },
      { university: 'Maseno University', cutoffPoints: 35.2, programmeCount: 1 },
    ],
    averageCutoff: 38.68,
    minRequiredForEntry: 32.0,
  },
  19: {
    clusterId: 19,
    clusterName: 'French & Related',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 39.5, programmeCount: 1 },
      { university: 'Moi University', cutoffPoints: 37.2, programmeCount: 1 },
      { university: 'Kenyatta University', cutoffPoints: 36.0, programmeCount: 1 },
      { university: 'Egerton University', cutoffPoints: 34.5, programmeCount: 1 },
    ],
    averageCutoff: 36.8,
    minRequiredForEntry: 31.0,
  },
  20: {
    clusterId: 20,
    clusterName: 'German & Related',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 39.2, programmeCount: 1 },
      { university: 'Moi University', cutoffPoints: 37.0, programmeCount: 1 },
      { university: 'Kenyatta University', cutoffPoints: 35.8, programmeCount: 1 },
      { university: 'Egerton University', cutoffPoints: 34.2, programmeCount: 1 },
    ],
    averageCutoff: 36.55,
    minRequiredForEntry: 31.0,
  },
  21: {
    clusterId: 21,
    clusterName: 'Music & Related',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 38.8, programmeCount: 1 },
      { university: 'Moi University', cutoffPoints: 36.5, programmeCount: 1 },
      { university: 'Kenyatta University', cutoffPoints: 35.2, programmeCount: 1 },
      { university: 'Maseno University', cutoffPoints: 32.0, programmeCount: 1 },
    ],
    averageCutoff: 35.63,
    minRequiredForEntry: 30.0,
  },
  22: {
    clusterId: 22,
    clusterName: 'Education Science & Arts',
    universities: [
      { university: 'University of Nairobi', cutoffPoints: 40.5, programmeCount: 3 },
      { university: 'Kenyatta University', cutoffPoints: 39.0, programmeCount: 2 },
      { university: 'Moi University', cutoffPoints: 37.8, programmeCount: 2 },
      { university: 'Egerton University', cutoffPoints: 36.2, programmeCount: 2 },
      { university: 'Maseno University', cutoffPoints: 34.0, programmeCount: 1 },
    ],
    averageCutoff: 37.5,
    minRequiredForEntry: 32.0,
  },
  23: {
    clusterId: 23,
    clusterName: 'Religious Studies & Related',
    universities: [
      { university: 'Kenyatta University', cutoffPoints: 38.5, programmeCount: 1 },
      { university: 'Moi University', cutoffPoints: 36.8, programmeCount: 1 },
      { university: 'University of Nairobi', cutoffPoints: 36.2, programmeCount: 1 },
      { university: 'Egerton University', cutoffPoints: 34.0, programmeCount: 1 },
    ],
    averageCutoff: 36.38,
    minRequiredForEntry: 31.0,
  },
};

export default KUCCPS_2024_CUTOFFS;
