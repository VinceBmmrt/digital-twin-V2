"use client";

import { useState, useCallback } from "react";
import { Message } from "../types/types";

interface UseChatSessionReturn {
  messages: Message[];
  input: string;
  isLoading: boolean;
  sessionId: string;
  inputHistory: string[];
  historyIdx: number;
  setInput: (v: string) => void;
  setHistoryIdx: (i: number) => void;
  sendMessage: (msg?: string) => Promise<void>;
  handleKey: (e: React.KeyboardEvent) => void;
}

export function useChatSession(): UseChatSessionReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const sendMessage = useCallback(
    async (msg?: string) => {
      const text = msg ?? input;
      if (!text.trim() || isLoading) return;

      setInputHistory((prev) => [text, ...prev.slice(0, 19)]);
      setHistoryIdx(-1);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "user",
          content: text,
          timestamp: new Date(),
        },
      ]);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/chat`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: text,
              session_id: sessionId || undefined,
            }),
          },
        );

        if (!res.ok) {
          let detail = `Erreur ${res.status}`;
          try {
            const e = await res.json();
            if (e?.detail) detail = String(e.detail);
          } catch {}
          throw new Error(detail);
        }

        const data = await res.json();
        if (!sessionId) setSessionId(data.session_id);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.response,
            timestamp: new Date(),
          },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `Une erreur est survenue : ${err instanceof Error ? err.message : "Erreur inconnue"}`,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, sessionId],
  );

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const n = Math.min(historyIdx + 1, inputHistory.length - 1);
        setHistoryIdx(n);
        setInput(inputHistory[n] ?? "");
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const n = Math.max(historyIdx - 1, -1);
        setHistoryIdx(n);
        setInput(n === -1 ? "" : inputHistory[n]);
      }
      if (e.key === "Escape") {
        setInput("");
        setHistoryIdx(-1);
      }
    },
    [sendMessage, historyIdx, inputHistory],
  );

  return {
    messages,
    input,
    isLoading,
    sessionId,
    inputHistory,
    historyIdx,
    setInput,
    setHistoryIdx,
    sendMessage,
    handleKey,
  };
}
