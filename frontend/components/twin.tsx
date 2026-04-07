"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BootAnimation from "../components/BootAnimation";
import WelcomeScreen from "../components/WelcomeScreen";
import MessageList from "../components/MessageList";
import InputBar from "../components/InputBar";
import BackgroundEffects from "../components/BackgroundEffects";
import GlobalStyles from "@/css/twinStyle";
import { useChatSession } from "@/hooks/useChatSession";
import { useBoot } from "@/hooks/useBoot";

export default function Twin() {
  const [inputFocused, setInputFocused] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { bootDone, timeStr } = useBoot();
  const {
    messages,
    input,
    isLoading,
    sessionId,
    handleKey,
    sendMessage,
    setInput,
  } = useChatSession();

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  // Refocus input after response
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // Close sidebar when resizing to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 769px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setSidebarOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const copyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="twin-root">
      <GlobalStyles />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="twin-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="twin-layout">
        {/* Neural background */}
        <div className="twin-bg">
          <BackgroundEffects />
        </div>

        {/* Sidebar */}
        <div
          className={`twin-sidebar${sidebarOpen ? " twin-sidebar--open" : ""}`}
        >
          <Sidebar
            messagesCount={messages.length}
            timeStr={timeStr}
            sessionId={sessionId}
          />
        </div>

        {/* Main */}
        <main className="twin-main">
          <Header onMenuClick={() => setSidebarOpen((o) => !o)} />

          <div ref={scrollRef} className="twin-scroll-area scroll-area">
            {!bootDone && <BootAnimation />}

            {bootDone && isEmpty && (
              <WelcomeScreen
                onSuggestionClick={(text) => {
                  setInput(text);
                  inputRef.current?.focus();
                }}
                inputRef={inputRef}
              />
            )}

            {bootDone && !isEmpty && (
              <MessageList
                messages={messages}
                isLoading={isLoading}
                onCopyMessage={copyMessage}
                copiedId={copied}
              />
            )}
          </div>

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
