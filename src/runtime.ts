import {
  CopilotRuntime,
  createCopilotEndpoint,
  InMemoryAgentRunner,
} from "@copilotkitnext/runtime";
import { LangGraphHttpAgent } from "@ag-ui/langgraph";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

// 1. Create the CopilotRuntime instance and utilize the LangGraph AG-UI
//    integration to setup the connection.
const runtime = new CopilotRuntime({
  agents: {
    default: new LangGraphHttpAgent({
      url: process.env.AGENT_URL || "http://localhost:8123",
    }),
  },
  runner: new InMemoryAgentRunner(),
});

// 2. Create a Hono-based endpoint that handles the CopilotKit runtime requests.
const app = createCopilotEndpoint({
  runtime,
  basePath: "/api/copilotkit",
});

// 3. Enable CORS for all origins
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// 4. Start the server
serve({
  fetch: app.fetch,
  port: 4001,
});

console.log("Server running on http://localhost:4001");
