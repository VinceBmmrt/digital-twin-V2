"use client";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const mono: React.CSSProperties = { fontFamily: "DM Mono, monospace" };
  const display: React.CSSProperties = { fontFamily: "Syne, sans-serif" };

  return (
    <header
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 32px",
        borderBottom: "1px solid rgba(99,179,255,.1)",
        background: "rgba(8,16,30,.95)",
        backdropFilter: "blur(20px)",
      }}
      className="twin-header"
    >
      {/* Hamburger — visible only on mobile via CSS */}
      <button
        className="twin-menu-btn"
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
        style={{
          display: "none" /* shown via media query */,
          background: "none",
          border: "1px solid rgba(99,179,255,.15)",
          borderRadius: "8px",
          padding: "6px 8px",
          cursor: "pointer",
          flexDirection: "column",
          gap: "4px",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: "16px",
              height: "1.5px",
              background: "#4a7a9b",
              borderRadius: "1px",
            }}
          />
        ))}
      </button>

      <div style={{ minWidth: 0, flex: 1 }}>
        <h1
          className="shimmer-text twin-header-title"
          style={{ ...display, fontSize: "20px", fontWeight: 700, margin: 0 }}
        >
          Digital Twin AI – Cloud Version
        </h1>
        <p
          style={{
            ...mono,
            fontSize: "11px",
            color: "#3a6480",
            margin: "3px 0 0",
            letterSpacing: ".05em",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#4ade80",
            boxShadow: "0 0 6px #4ade80",
            animation: "glowPulse 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            ...mono,
            fontSize: "10px",
            color: "#4a9b6a",
            letterSpacing: ".1em",
          }}
        >
          EN LIGNE
        </span>
      </div>
    </header>
  );
}
