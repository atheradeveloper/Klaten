const express = require('express');
const bodyParser = require('body-parser');
const agentRouter = require('./routes/agentrouter-route');

const app = express();
app.use(bodyParser.json());

// Mount AgentRouter route
app.use(agentRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on :${port}`));

module.exports = app;
