"use client";

import { useEffect, useRef } from "react";
import { useCopilotChat } from "@copilotkit/react-core";

const STORAGE_KEY = "copilotkit-chat-history";

/**
 * Hook that persists CopilotKit chat messages to localStorage.
 * Place this inside a component that is a child of <CopilotKit>.
 *
 * On mount it restores any previously saved messages.
 * On every message change it saves the current messages to localStorage.
 */
export function useChatPersistence() {
  const { messages, setMessages } = useCopilotChat();
  const restoredRef = useRef(false);

  // Restore messages from localStorage on first mount
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to restore chat history from localStorage:", e);
    }
  }, [setMessages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (!restoredRef.current) return;

    try {
      // Only persist user and assistant text messages
      const serializableMessages = messages.filter(
        (m: any) => m.role === "user" || m.role === "assistant"
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableMessages));
    } catch (e) {
      console.warn("Failed to save chat history to localStorage:", e);
    }
  }, [messages]);

  return { messages, setMessages };
}
