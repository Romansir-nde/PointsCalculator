import express from 'express';
import Passkey from '../models/Passkey';

const router = express.Router();

// Middleware: simple auth check
const checkAdminAuth = (req: any, res: any, next: any) => {
  const { adminuser, adminpass } = req.headers;
  const envUser = process.env.ADMIN_USER || 'ADMIN';
  const envPass = process.env.ADMIN_PASS || '2025';
  
  if (adminuser === envUser && adminpass === envPass) {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
};

// Get current passkey
router.get('/passkey', async (req, res) => {
  try {
    const latest = await (Passkey as any).findOne().sort({ createdAt: -1 });
    res.json({ key: latest?.key || '2025' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve passkey' });
  }
});

// Change passkey (requires auth)
router.post('/change-passkey', checkAdminAuth, async (req, res) => {
  const { newPasskey } = req.body;
  if (!newPasskey) return res.status(400).json({ error: 'newPasskey required' });
  try {
    const pk = new (Passkey as any)({ key: newPasskey, createdBy: (req.headers as any).adminuser || 'admin' });
    await pk.save();
    return res.json({ success: true, key: newPasskey });
  } catch (ex) {
    console.error(ex);
    return res.status(500).json({ error: 'Failed to save passkey' });
  }
});

// Analyzer: simple deterministic tool
router.post('/analyze', checkAdminAuth, (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });

  const sentences = text.split(/[\.\!\?]\s+/).map(s => s.trim()).filter(Boolean);
  const strengths = sentences.filter(s => /strong|good|excellent|well|high|above/i.test(s)).slice(0,3);
  const weaknesses = sentences.filter(s => /weak|low|missing|failed|not|below|poor/i.test(s)).slice(0,3);
  const suggestions = [];
  
  if (weaknesses.length > 0) {
    suggestions.push('Focus on improving weak clusters by selecting core subjects.');
    suggestions.push('Consider choosing alternative clusters where core subjects match your strengths.');
  } else {
    suggestions.push('Maintain your strong performance and aim for competitive universities.');
  }

  suggestions.push('Consult with guidance counselor for personalized advice.');

  const simplified = `**Student Guidance Summary**\n\n**Strengths:**\n${strengths.length > 0 ? strengths.map((s, i) => `${i+1}. ${s}`).join('\n') : '- None listed'}\n\n**Areas for Improvement:**\n${weaknesses.length > 0 ? weaknesses.map((s, i) => `${i+1}. ${s}`).join('\n') : '- None identified'}\n\n**Recommendations:**\n${suggestions.map((s, i) => `${i+1}. ${s}`).join('\n')}\n`;
  
  return res.json({ simplified, strengths, weaknesses, suggestions });
});

export default router;
