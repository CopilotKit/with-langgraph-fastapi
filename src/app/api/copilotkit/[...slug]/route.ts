import {
  CopilotRuntime,
  createCopilotEndpoint,
  InMemoryAgentRunner,
} from "@copilotkitnext/runtime";

import { LangGraphHttpAgent } from "@ag-ui/langgraph";
import { handle } from "hono/vercel";

// 1. Create the CopilotRuntime instance and utilize the LangGraph AG-UI
//    integration to setup the connection.
const runtime = new CopilotRuntime({
  agents: {
    // @ts-ignore
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

// 3. Export GET and POST handlers using Hono's Vercel adapter
export const GET = handle(app);
export const POST = handle(app);
