"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BootAnimation from "../components/BootAnimation";
import WelcomeScreen from "../components/WelcomeScreen";
import MessageList from "../components/MessageList";
import InputBar from "../components/InputBar";
import BackgroundEffects from "../components/BackgroundEffects";
import { Message } from "../types/types";
import GlobalStyles from "@/css/twinStyle";

export default function Twin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [bootDone, setBootDone] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  useEffect(() => {
    const t = setTimeout(() => setBootDone(true), 2200);
    return () => clearTimeout(t);
  }, []);

  const copyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sendMessage = useCallback(
    async (msg?: string) => {
      const text = msg ?? input;
      if (!text.trim() || isLoading) return;
      setInputHistory((prev) => [text, ...prev.slice(0, 19)]);
      setHistoryIdx(-1);
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
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
          let d = `Erreur ${res.status}`;
          try {
            const e = await res.json();
            if (e?.detail) d = String(e.detail);
          } catch {}
          throw new Error(d);
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

  const handleKey = (e: React.KeyboardEvent) => {
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
  };

  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    const u = () =>
      setTimeStr(
        new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    u();
    const iv = setInterval(u, 1000);
    return () => clearInterval(iv);
  }, []);

  const isEmpty = messages.length === 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        fontFamily: "DM Mono, monospace",
        overflow: "hidden",
      }}
    >
      <GlobalStyles />

      {/* Root flex container — fills parent completely */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#08131f",
          overflow: "hidden",
        }}
      >
        {/* Neural BG */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <BackgroundEffects />
        </div>

        {/* Sidebar */}
        <Sidebar
          messagesCount={messages.length}
          timeStr={timeStr}
          sessionId={sessionId}
        />

        {/* Main content */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 10,
            background: "rgba(10,20,36,.55)",
            overflow: "hidden",
          }}
        >
          <Header />
          {/* Messages scroll area */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              padding: "28px 32px",
            }}
          >
            {/* Boot Animation */}
            {!bootDone && <BootAnimation />}

            {/* Welcome Screen */}
            {bootDone && isEmpty && (
              <WelcomeScreen
                onSuggestionClick={(text) => {
                  setInput(text);
                  inputRef.current?.focus();
                }}
                inputRef={inputRef}
              />
            )}

            {/* Messages */}
            {bootDone && !isEmpty && (
              <MessageList
                messages={messages}
                isLoading={isLoading}
                onCopyMessage={copyMessage}
                copiedId={copied}
              />
            )}
          </div>

          {/* Input Bar */}
          <InputBar
            input={input}
            isLoading={isLoading}
            bootDone={bootDone}
            inputFocused={inputFocused}
            onInputChange={setInput}
            onKeyDown={handleKey}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onSend={() => sendMessage()}
            inputRef={inputRef}
          />
        </main>
      </div>
    </div>
  );
}
