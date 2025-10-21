"use client";

import {
  useFrontendTool,
  useAgent,
  CopilotChat,
  CopilotThreadList,
  CopilotChatConfigurationProvider,
} from "@copilotkitnext/react";

export default function CopilotKitPage() {
  const { agent } = useAgent();

  // example implementation using file-uploads
  const handleAddFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file?.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = () => {
        agent?.addMessage({
          role: "user",
          id: crypto.randomUUID(),
          content: [
            {
              type: "binary",
              mimeType: file.type,
              url: reader.result as string,
            },
          ],
        });
        agent?.runAgent();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <main>
      <CopilotChatConfigurationProvider>
        <div className="grid grid-cols-4">
          <CopilotThreadList className="col-span-1 h-screen border-r" />
          <CopilotChat
            className="col-span-3 h-screen"
            inputProps={{
              onAddFile: handleAddFile,
            }}
          />
        </div>
      </CopilotChatConfigurationProvider>
    </main>
  );
}
