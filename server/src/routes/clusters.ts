import express from 'express';
import clustersData from '../data/clusters.json';
import cutoffsData from '../data/cutoffs.json';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(clustersData);
});

router.get('/cutoffs', (req, res) => {
  res.json(cutoffsData);
});

export default router;
