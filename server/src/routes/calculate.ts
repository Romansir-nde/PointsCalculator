import express from 'express';
import clustersData from '../data/clusters.json';
import cutoffsData from '../data/cutoffs.json';
import { computeAllClusters, SubjectGrade } from '../lib/formula';

const router = express.Router();

router.post('/', (req, res) => {
  try {
    const { studentId, subjects } = req.body as { studentId?: string; subjects: SubjectGrade[] };
    if (!subjects || !Array.isArray(subjects)) return res.status(400).json({ error: 'subjects array required' });
    if (subjects.length > 7) return res.status(400).json({ error: 'Maximum 7 subjects allowed' });

    const clusters = clustersData as any;
    const out = computeAllClusters(subjects, clusters);

    // Build recommended courses stub (frontend will augment with course DB)
    const recommended: any[] = out.clusters.map((c: any) => {
      const cutoff = (cutoffsData as any)[c.id] || null;
      const topUni = cutoff?.universities?.slice(0,3) || [];
      const eligible = cutoff ? (c.points >= (topUni[0]?.cutoffPoints || cutoff.averageCutoff)) : false;
      return { clusterId: c.id, clusterName: c.name, points: c.points, eligible, topUniversities: topUni };
    });

    return res.json({ studentId: studentId || null, agp: out.agp, meanGrade: out.meanGrade, clusters: out.clusters, recommendedCourses: recommended });
  } catch (ex) {
    console.error(ex);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
