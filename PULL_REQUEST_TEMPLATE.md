---
title: "Add AgentRouter integration"
labels:
  - enhancement
  - automation

---

This PR adds an AgentRouter connector and route so Copilot can invoke models from agentrouter.org.

Files added:
- integration/agentrouter.ts
- routes/agentrouter-route.ts
- features/copilot/agent-providers.json
- features/copilot/AGENTROUTER.md

Notes:
- The integration expects AGENTROUTER_API_KEY to be stored as a repository secret.
- Do not commit API keys into code.

Checklist for reviewers:
- [ ] Confirm the connector matches expected AgentRouter API response format.
- [ ] Ensure the route is mounted and protected by auth in production.
- [ ] Add any additional configuration needed for your deployment environment (K8s secrets, cloud secret manager, etc.).

How to test:
1. Ensure AGENTROUTER_API_KEY is set for the environment.
2. Mount the route in your server and send a POST to /api/agentrouter/invoke with { model, input }.
