// integration/agentrouter.ts
// Minimal connector to call AgentRouter API. Read AGENTROUTER_API_KEY from env.
// Adapt this to your backend framework and error handling conventions.

import fetch from 'node-fetch';

const AGENTROUTER_BASE = 'https://api.agentrouter.org/v1';

export type AgentRouterResponse = {
  output: string;
  raw?: any;
};

export async function invokeAgentRouterModel(model: string, input: any): Promise<AgentRouterResponse> {
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
