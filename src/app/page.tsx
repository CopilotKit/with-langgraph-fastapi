"use client";

import { AgentStatePanel } from "@/components/agent-state";
import {
  CopilotKitProvider,
  CopilotSidebar,
  useAgent,
  useFrontendTool,
} from "@copilotkitnext/react";
import { useState } from "react";
import { toolRenders } from "@/components/gen-ui";
import { z } from "zod";

export default function Page() {
  return (
    <CopilotKitProvider
      runtimeUrl="http://localhost:4001/api/copilotkit"
      showDevConsole="auto"
      renderToolCalls={toolRenders}
    >
      <PageContent />
    </CopilotKitProvider>
  );
}

function PageContent() {
  const [themeColor, setThemeColor] = useState("#00bcff");
  const { agent } = useAgent();
  const state = agent?.state;

  useFrontendTool({
    name: "setThemeColor",
    parameters: z.object({
      themeColor: z
        .string()
        .describe("The theme color to set. Make sure to pick nice colors."),
    }),
    handler: async ({ themeColor }) => {
      setThemeColor(themeColor);
      return `Theme color set to ${themeColor}`;
    },
  });

  return (
    <main>
      <div
        style={{ background: themeColor }}
        className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-16 transition-all duration-500 md:px-8"
      >
        <AgentStatePanel state={state} />
      </div>
      <CopilotSidebar defaultOpen={true} />
    </main>
  );
}
