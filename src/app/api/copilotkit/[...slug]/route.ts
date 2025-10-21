import { WebSocketAgent } from "@/lib/agents";
import {
  CopilotRuntime,
  createCopilotEndpoint,
  AgentRunner,
} from "@copilotkitnext/runtime";
import { handle } from "hono/vercel";

const runtime = new CopilotRuntime({
  agents: {
    default: new WebSocketAgent({
      agentId: "sample_agent",
      description: "An example agent using WebSocket connection",
      url: process.env.AGENT_URL || "ws://localhost:8123",
    }),
    foo: new WebSocketAgent({
      agentId: "sample_agent_foo",
      description: "Another example agent using WebSocket connection",
      url: process.env.AGENT_URL || "ws://localhost:8123",
    }),
  },
});

const app = createCopilotEndpoint({
  runtime,
  basePath: "/api/copilotkit",
});

export const GET = handle(app);
export const POST = handle(app);
