// routes/agentrouter-route.ts
import express from 'express';
import { invokeAgentRouterModel } from '../integration/agentrouter';

const router = express.Router();

// POST /api/agentrouter/invoke
// body: { model: string, input: any }
router.post('/api/agentrouter/invoke', async (req, res) => {
  try {
    const { model, input } = req.body;
    if (!model) return res.status(400).json({ error: 'model is required' });

    const result = await invokeAgentRouterModel(model, input ?? {});
    res.json(result);
  } catch (err: any) {
    // Don't leak secrets in error messages in production
    console.error('AgentRouter invocation failed:', err?.message ?? err);
    res.status(500).json({ error: 'AgentRouter invocation failed' });
  }
});

export default router;
