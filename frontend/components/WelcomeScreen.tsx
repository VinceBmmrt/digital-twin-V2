"use client";

import { Sparkles, ChevronRight } from "lucide-react";
import { SUGGESTIONS } from "./constants";

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function WelcomeScreen({
  onSuggestionClick,
  inputRef,
}: WelcomeScreenProps) {
  const mono: React.CSSProperties = { fontFamily: "DM Mono, monospace" };
  const display: React.CSSProperties = { fontFamily: "Syne, sans-serif" };

  return (
    <div
      className="fade-up twin-welcome"
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        width: "100%",
        paddingTop: "40px",
      }}
    >
      <div
        className="glass-msg"
        style={{ borderRadius: "16px", padding: "28px", marginBottom: "28px" }}
      >
        <div style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg,rgba(99,179,255,.2),rgba(99,179,255,.06))",
              border: "1px solid rgba(99,179,255,.2)",
            }}
          >
            <Sparkles size={16} color="#63b3ff" />
          </div>
          <div>
            <p
              style={{
                ...display,
                fontWeight: 600,
                color: "#c8e8ff",
                fontSize: "15px",
                margin: "0 0 8px",
              }}
            >
              Bonjour, je suis le Digital Twin de Vincent.
            </p>
            <p
              style={{
                ...mono,
                color: "#4a7a9b",
                fontSize: "12.5px",
                lineHeight: 1.7,
                margin: 0,
                fontWeight: 300,
              }}
            >
              Mes expériences professionnelles, projets personnels et
              compétences techniques sont chargés en contexte. Posez-moi
              n'importe quelle question.
            </p>
          </div>
        </div>
      </div>

      <p
        style={{
          ...mono,
          fontSize: "9px",
          color: "#2a4a6a",
          letterSpacing: ".18em",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}
      >
        Suggestions
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {SUGGESTIONS.map((s, i) => (
          <button
            key={s.text}
            className="sug-card"
            style={{
              borderRadius: "12px",
              padding: "13px 18px",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: "none",
              border: "none",
              width: "100%",
              animationDelay: `${i * 60}ms`,
            }}
            onClick={() => {
              onSuggestionClick(s.text);
              inputRef?.current?.focus();
            }}
          >
            <span style={{ fontSize: "16px" }}>{s.icon}</span>
            <span
              style={{
                ...mono,
                fontSize: "12.5px",
                color: "#5a8aaa",
                fontWeight: 300,
                flex: 1,
                textAlign: "left",
              }}
            >
              {s.text}
            </span>
            <ChevronRight size={12} color="#2a4a6a" />
          </button>
        ))}
      </div>
    </div>
  );
}
