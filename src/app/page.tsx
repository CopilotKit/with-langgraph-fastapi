"use client";

import { AgentStatePanel } from "@/components/agent-state";
import {
  CopilotKitProvider,
  CopilotSidebar,
  useAgent,
  useFrontendTool,
  useHumanInTheLoop,
} from "@copilotkitnext/react";
import { useState } from "react";
import { toolRenders } from "@/components/gen-ui";
import { z } from "zod";
import { ApprovalRequest, ApprovalResult } from "@/components/approval-ui";

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

  useHumanInTheLoop({
    name: "approveOrDenyMessage",
    parameters: z.object({
      message: z.string().describe("The message to send to the human."),
    }),
    render: ({ args, respond, result }) => {
      if (result) {
        const parsedResult = JSON.parse(result) as { status: "approve" | "deny" };
        return (
          <ApprovalResult message={args.message || ""} status={parsedResult.status} />
        );
      }
      
      return (
        <ApprovalRequest
          message={args.message || ""}
          onApprove={() => respond?.({ status: "approve" })}
          onDeny={() => respond?.({ status: "deny" })}
        />
      );
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
