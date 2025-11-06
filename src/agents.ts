import { LangGraphHttpAgent } from "@ag-ui/langgraph";

export const myAgents = {
  mastraAgent: new LangGraphHttpAgent({
    url: process.env.AGENT_URL || "http://localhost:8123",
  }),
  langgraphAgent: new LangGraphHttpAgent({
    url: process.env.AGENT_URL || "http://localhost:8123",
  }),
  pydanticAgent: new LangGraphHttpAgent({
    url: process.env.AGENT_URL || "http://localhost:8123",
  }),
  awsStrandsAgent: new LangGraphHttpAgent({
    url: process.env.AGENT_URL || "http://localhost:8123",
  }),
  microsoftAgentFrameworkAgent: new LangGraphHttpAgent({
    url: process.env.AGENT_URL || "http://localhost:8123",
  }),
  googleAdkAgent: new LangGraphHttpAgent({
    url: process.env.AGENT_URL || "http://localhost:8123",
  }),
};

