"use client";

import { InputBarProps } from "@/types/types";
import { Send } from "lucide-react";

export default function InputBar({
  input,
  isLoading,
  bootDone,
  inputFocused,
  onInputChange,
  onKeyDown,
  onFocus,
  onBlur,
  onSend,
  inputRef,
}: InputBarProps) {
  const mono: React.CSSProperties = { fontFamily: "DM Mono, monospace" };
  const isSendDisabled = !input.trim() || isLoading || !bootDone;

  return (
    <div
      className="twin-inputbar"
      style={{
        flexShrink: 0,
        flexGrow: 0,
        padding: "18px 32px 16px",
        borderTop: "1px solid rgba(99,179,255,.1)",
        background: "rgba(8,16,30,.95)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        className={`input-wrap${inputFocused ? " focused" : ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Posez votre question…"
          disabled={isLoading || !bootDone}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#b8d8f0",
            fontSize: "13.5px",
            ...mono,
            fontWeight: 300,
            minWidth: 0,
          }}
        />
        <button
          onClick={onSend}
          disabled={isSendDisabled}
          className={!isSendDisabled ? "send-btn-on" : "send-btn-off"}
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "11px",
            ...mono,
            letterSpacing: ".12em",
            fontWeight: 500,
            color: !isSendDisabled ? "#93d0ff" : "#2a4a6a",
            transition: "all .2s",
          }}
        >
          {/* "ENVOYER" label hidden on mobile via CSS */}
          <span className="twin-send-label">ENVOYER</span>
          <Send size={11} />
        </button>
      </div>

      {/* Keyboard hints — hidden on mobile */}
      <div
        className="twin-kbd-hints"
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "8px",
          paddingLeft: "4px",
        }}
      >
        <span
          style={{
            ...mono,
            fontSize: "9px",
            color: "#2a4a6a",
            letterSpacing: ".1em",
          }}
        >
          ↵ Envoyer
        </span>
        <span
          style={{
            ...mono,
            fontSize: "9px",
            color: "#1e3a52",
            letterSpacing: ".1em",
          }}
        >
          ↑↓ Historique
        </span>
        <span
          style={{
            ...mono,
            fontSize: "9px",
            color: "#1e3a52",
            letterSpacing: ".1em",
          }}
        >
          Esc Effacer
        </span>
      </div>
    </div>
  );
}
