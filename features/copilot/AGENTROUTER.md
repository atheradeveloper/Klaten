# AgentRouter integration for Copilot

This document explains how to configure and test the AgentRouter integration added in branch feature/agentrouter-integration.

Secrets
- The integration expects a repository secret named AGENTROUTER_API_KEY (you've already added it).

Files added
- integration/agentrouter.ts — connector that calls AgentRouter's /models/{model}/invoke endpoint.
- routes/agentrouter-route.ts — Express route that proxies requests from the UI/backend to AgentRouter.
- features/copilot/agent-providers.json — configuration metadata so Copilot can show AgentRouter as a provider.

How to test locally
1. Ensure you have AGENTROUTER_API_KEY set locally. For example on macOS/Linux:

   export AGENTROUTER_API_KEY="<your-key>"

2. Start your server (make sure your app mounts the new route, e.g. `app.use(require('./routes/agentrouter-route').default)`).
3. Call the proxy endpoint:

   curl -X POST "http://localhost:3000/api/agentrouter/invoke" \
     -H "Content-Type: application/json" \
     -d '{"model":"ar-gpt-1","input":{"prompt":"Hello from Copilot"}}'

Expected result: a JSON object with an "output" field containing the model response.

Production notes
- Do NOT store the API key in code or in the repository. Use a secrets store (GitHub Actions secrets, cloud Secret Manager, Kubernetes Secret, etc.).
- Consider adding authentication/authorization to /api/agentrouter/invoke so only authorized users or internal services can call it.
- Optionally add rate limiting, retries, and observability (logs/metrics) around requests to AgentRouter.

If you want, I can now open a PR with these changes and add a short checklist for reviewers.
