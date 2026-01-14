import mongoose from 'mongoose';

const PasskeySchema = new mongoose.Schema({
  key: { type: String, required: true },
  createdBy: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Passkey', PasskeySchema);
