const express = require('express');
const { invokeAgentRouterModel } = require('../integration/agentrouter');

const router = express.Router();

// Optional internal auth: if INTERNAL_API_KEY is set, require header x-internal-secret to match
function optionalAuth(req, res, next) {
  const secret = process.env.INTERNAL_API_KEY;
  if (!secret) return next();
  const header = req.get('x-internal-secret');
  if (header !== secret) return res.status(401).json({ error: 'unauthorized' });
  return next();
}

// POST /api/agentrouter/invoke
// body: { model: string, input: any }
router.post('/api/agentrouter/invoke', optionalAuth, async (req, res) => {
  try {
    const { model, input } = req.body;
    if (!model) return res.status(400).json({ error: 'model is required' });

    const result = await invokeAgentRouterModel(model, input ?? {});
    res.json(result);
  } catch (err) {
    // Don't leak secrets in error messages in production
    console.error('AgentRouter invocation failed:', err && err.message ? err.message : err);
    res.status(500).json({ error: 'AgentRouter invocation failed' });
  }
});

module.exports = router;
