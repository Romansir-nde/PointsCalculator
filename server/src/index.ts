import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import calculateRouter from './routes/calculate';
import clustersRouter from './routes/clusters';
import adminRouter from './routes/admin';

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kuccps';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/calculate', calculateRouter);
app.use('/api/clusters', clustersRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => res.send('KUCCPS backend running'));

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Seed default passkey if none exists
    try {
      const Passkey = (await import('./models/Passkey')).default;
      const count = await Passkey.countDocuments();
      const defaultKey = process.env.DEFAULT_PASSKEY || '2007';
      if (count === 0) {
        const pk = new Passkey({ key: defaultKey, createdBy: 'system' });
        await pk.save();
        console.log('Seeded default passkey:', defaultKey);
      }
    } catch (e) {
      console.warn('Could not seed passkey:', e);
    }

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
