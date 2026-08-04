const fetch = require('node-fetch');

const AGENTROUTER_BASE = 'https://api.agentrouter.org/v1';

async function invokeAgentRouterModel(model, input) {
  const apiKey = process.env.AGENTROUTER_API_KEY;
  if (!apiKey) throw new Error('AGENTROUTER_API_KEY environment variable is not set');

  const url = `${AGENTROUTER_BASE}/models/${encodeURIComponent(model)}/invoke`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ input }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AgentRouter API error ${res.status}: ${text}`);
  }

  const payload = await res.json();
  // Adjust the extraction below to match the real AgentRouter response shape
  const output = payload.output ?? (payload.result ?? JSON.stringify(payload));
  return { output, raw: payload };
}

module.exports = { invokeAgentRouterModel };
