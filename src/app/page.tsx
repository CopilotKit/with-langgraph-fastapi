"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

export default function CopilotKitPage() {
  const threads = [
    "fa56f891-0165-41e0-a152-5d4cdedd6b79",
    "7b0a1e58-75fa-4fb7-8d3c-23cd0ddaf3ca",
    "cd7ca59a-e803-45d7-8c08-e8c6b3eab7ee",
    "41058711-43e5-466a-9cbd-8df4fb63cafe",
  ];
  const [threadId, setThreadId] = useState(threads[0]);

  return (
    <main className="dark bg-black h-screen w-screen grid grid-cols-4">
      <div className="col-span-1 text-white bg-zinc-800">
        {threads.map((thread) => (
          <button
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 my-1 mx-2 rounded-md cursor-pointer"
            key={thread}
            onClick={() => setThreadId(thread)}
          >
            {thread}
          </button>
        ))}
      </div>
      <CopilotChat
        agentId="sample_agent"
        threadId={threadId}
        input={{ className: "text-white" }}
        className="bg-black col-span-3 max-h-full overflow-auto"
      />
    </main>
  );
}
