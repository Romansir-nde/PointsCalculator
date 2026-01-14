import express from 'express';
import coursesData from '../data/courses.json';

const router = express.Router();

router.get('/:clusterId', (req, res) => {
  const { clusterId } = req.params;
  const courses = (coursesData as any)[clusterId] || [];
  res.json({ clusterId: parseInt(clusterId), courses, count: courses.length });
});

router.get('/', (req, res) => {
  res.json(coursesData);
});

export default router;
