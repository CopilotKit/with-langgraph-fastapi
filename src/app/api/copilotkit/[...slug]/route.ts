import { LangGraphHttpAgent } from "@ag-ui/langgraph";
import {
  CopilotRuntime,
  createCopilotEndpoint,
  AgentRunner,
} from "@copilotkitnext/runtime";
import { handle } from "hono/vercel";

const runtime = new CopilotRuntime({
  agents: {
    default: new LangGraphHttpAgent({
      url: process.env.AGENT_URL || "http://localhost:8123",
    }),
    foo: new LangGraphHttpAgent({
      url: process.env.AGENT_URL || "http://localhost:8123",
    }),
  },
});

const app = createCopilotEndpoint({
  runtime,
  basePath: "/api/copilotkit",
});

export const GET = handle(app);
export const POST = handle(app);
