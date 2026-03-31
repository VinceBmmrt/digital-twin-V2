import Twin from "@/components/twin";

const SKILLS = [
  "LangChain",
  "LangGraph",
  "Multi-agents",
  "RAG",
  "Fine-tuning",
  "QLoRA",
  "LoRA",
  "OpenAI API",
  "Hugging Face",
  "CrewAI",
  "n8n",
  "MCP Servers",
  "Ollama",
  "Next.js",
  "React",
  "TypeScript",
  "Python",
  "Node.js",
  "Spring Boot",
  "PostgreSQL",
  "ChromaDB",
  "Supabase Vector",
  "MongoDB",
  "Docker",
  "AWS",
  "Vercel",
  "Railway",
  "Modal GPU",
  "PyTorch",
  "Weights & Biases",
  "Playwright",
  "Redux",
];

const STATUS_ITEMS = [
  { key: "SYS", val: "NOMINAL", color: "#4ade80" },
  { key: "AI", val: "ONLINE", color: "#63b3ff" },
  { key: "ENV", val: "PROD", color: "#93d0ff" },
];

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body { height: 100%; overflow: hidden; background: #060d18; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes glowPulse {
          0%,100% { opacity: .55; }
          50%     { opacity: 1; }
        }
        @keyframes nameShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes chatAura {
          0%,100% { box-shadow: 0 0 0 1px rgba(99,179,255,.06), 0 0 40px rgba(99,179,255,.05); }
          50%     { box-shadow: 0 0 0 1px rgba(99,179,255,.11), 0 0 60px rgba(99,179,255,.09); }
        }
        @keyframes scanPage {
          0%   { top: -2px; }
          100% { top: calc(100vh + 2px); }
        }
        @keyframes orbDrift {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-18px); }
        }

        .f1 { animation: fadeUp .5s .05s ease both; }
        .f2 { animation: fadeUp .5s .16s ease both; }
        .f3 { animation: fadeUp .5s .27s ease both; }
        .f4 { animation: fadeUp .5s .38s ease both; }

        .name-shimmer {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.4rem, 5vw, 2.8rem);
          white-space: nowrap;
          background: linear-gradient(90deg, #63b3ff 0%, #c8e8ff 28%, #ffffff 42%, #93d0ff 56%, #63b3ff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: nameShimmer 5s linear infinite;
          letter-spacing: .02em;
          line-height: 1;
          display: block;
        }

        .ticker-wrap:hover .ticker-inner { animation-play-state: paused !important; }
        .skill-tag {
          padding: 2px 12px;
          border: 1px solid rgba(99,179,255,.12);
          border-radius: 999px;
          font-size: 9px; color: #4a7a9b;
          letter-spacing: .12em; white-space: nowrap; cursor: default;
          transition: all .2s; background: rgba(99,179,255,.03);
          font-family: 'DM Mono', monospace; font-weight: 300;
        }
        .skill-tag:hover { background: rgba(99,179,255,.1); border-color: rgba(99,179,255,.32); color: #93d0ff; }

        .chat-window { animation: chatAura 5s ease-in-out infinite; }

        .status-badge {
          display: flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 999px;
          background: rgba(99,179,255,.04); border: 1px solid rgba(99,179,255,.1);
          font-size: 9px; letter-spacing: .1em; font-family: 'DM Mono', monospace;
          transition: border-color .2s;
        }
        .status-badge:hover { border-color: rgba(99,179,255,.22); }

        /* ── Page-level nav label: hide on mobile ── */
        .nav-label { display: inline; }
        /* ── Footer tech tags: hide on mobile ── */
        .footer-tags { display: flex; }
        /* ── Identity subtitle: allow wrap ── */
        .identity-sub { display: flex; flex-wrap: wrap; }

        /* ── Status badges row: wrap on small screens ── */
        .nav-badges { display: flex; gap: 7px; align-items: center; flex-wrap: wrap; justify-content: flex-end; }

        /* ════════════════════════════════════════
           TABLET  (≤ 768px)
        ════════════════════════════════════════ */
        @media (max-width: 768px) {
          .nav-label { display: none; }

          .page-content {
            padding: 10px 14px 8px !important;
            gap: 8px !important;
          }

          .page-nav {
            padding: 8px 14px !important;
          }

          .name-shimmer {
            white-space: normal;
          }

          .identity-label {
            display: none !important;
          }

          .footer-tags { display: none !important; }

          .footer-root {
            justify-content: space-between !important;
          }
        }

        /* ════════════════════════════════════════
           MOBILE  (≤ 480px)
        ════════════════════════════════════════ */
        @media (max-width: 480px) {
          .status-badge span:first-of-type { display: none; }  /* hide KEY: label, keep value */

          .page-content {
            padding: 8px 10px 6px !important;
            gap: 6px !important;
          }

          .page-nav {
            padding: 7px 10px !important;
          }

          .nav-badges { gap: 4px; }

          .status-badge { padding: 3px 7px; }

          .footer-copyright { display: none !important; }
          .footer-powered   { display: none !important; }
          .footer-root      { justify-content: center !important; padding-top: 5px !important; }
          .footer-tags      { display: flex !important; }

          .identity-sub { gap: 6px !important; }

          .ticker-wrap { padding: 5px 0 !important; }
        }
      `}</style>

      {/* ── Ambient orbs ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-8%",
            width: "65vw",
            height: "65vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(99,179,255,.055) 0%,transparent 65%)",
            filter: "blur(80px)",
            animation: "orbDrift 10s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            right: "-4%",
            width: "50vw",
            height: "50vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(99,179,255,.04) 0%,transparent 65%)",
            filter: "blur(65px)",
            animation: "orbDrift 13s ease-in-out infinite",
            animationDelay: "-6s",
          }}
        />
      </div>

      {/* ── Dot grid + scanline + vignette ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "radial-gradient(circle,rgba(99,179,255,.08) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.28,
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(transparent,rgba(99,179,255,.04),transparent)",
            animation: "scanPage 10s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.04) 3px,rgba(0,0,0,.04) 4px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,.4) 100%)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════
          FULL-PAGE FIXED LAYOUT
      ══════════════════════════════════════ */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* NAV */}
        <nav
          className="f1 page-nav"
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "9px 28px",
            borderBottom: "1px solid rgba(99,179,255,.08)",
            background: "rgba(6,13,24,.92)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {["#ff6b6b", "#ffd166", "#06d6a0"].map((c) => (
              <div
                key={c}
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  background: c,
                  opacity: 0.45,
                  boxShadow: `0 0 6px ${c}`,
                }}
              />
            ))}
            <span
              className="nav-label"
              style={{
                marginLeft: "14px",
                fontSize: "9px",
                color: "#3a6480",
                letterSpacing: ".16em",
                fontFamily: "DM Mono",
                fontWeight: 300,
              }}
            >
              AI DIGITAL TWIN · SESSION ACTIVE
            </span>
          </div>
          <div className="nav-badges">
            {STATUS_ITEMS.map(({ key, val, color }) => (
              <div key={key} className="status-badge">
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 5px ${color}`,
                    animation: "glowPulse 2.5s ease-in-out infinite",
                  }}
                />
                <span style={{ color: "#3a6480" }}>{key}:</span>
                <span style={{ color }}>{val}</span>
              </div>
            ))}
          </div>
        </nav>

        {/* CONTENT COLUMN */}
        <div
          className="page-content"
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "14px 28px 10px",
            maxWidth: "1020px",
            width: "100%",
            margin: "0 auto",
            overflow: "hidden",
          }}
        >
          {/* IDENTITY */}
          <header className="f1" style={{ flexShrink: 0 }}>
            <div
              className="identity-label"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "6px",
                fontSize: "8px",
                color: "#2a4a6a",
                letterSpacing: ".2em",
                fontFamily: "DM Mono",
              }}
            >
              <div
                style={{
                  width: "26px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg,transparent,rgba(99,179,255,.35))",
                }}
              />
              AI ENGINEER · DIGITAL TWIN · IN PRODUCTION
              <div
                style={{
                  width: "26px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg,rgba(99,179,255,.35),transparent)",
                }}
              />
            </div>
            <span className="name-shimmer" style={{ marginBottom: "5px" }}>
              VINCENT BOMMERT
            </span>
            <div
              className="identity-sub"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginTop: "5px",
              }}
            >
              <p
                style={{
                  fontSize: "10.5px",
                  color: "#3a6480",
                  letterSpacing: ".05em",
                  margin: 0,
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontFamily: "DM Mono",
                }}
              >
                Ingénieur IA · Multi-agents &amp; RAG en production ·
                Fine-tuning LLM
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#4ade80",
                    boxShadow: "0 0 7px #4ade80",
                    display: "inline-block",
                    animation: "glowPulse 2.2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: "8px",
                    color: "#4ade80",
                    letterSpacing: ".14em",
                    fontFamily: "DM Mono",
                  }}
                >
                  EN LIGNE
                </span>
              </div>
            </div>
          </header>

          {/* SKILLS TICKER */}
          <div
            className="f2 ticker-wrap"
            style={{
              flexShrink: 0,
              borderTop: "1px solid rgba(99,179,255,.07)",
              borderBottom: "1px solid rgba(99,179,255,.07)",
              padding: "7px 0",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "55px",
                background: "linear-gradient(90deg,#060d18,transparent)",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "55px",
                background: "linear-gradient(270deg,#060d18,transparent)",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
            <div
              className="ticker-inner"
              style={{
                display: "flex",
                gap: "9px",
                animation: "scrollLeft 32s linear infinite",
                width: "max-content",
              }}
            >
              {[...SKILLS, ...SKILLS].map((s, i) => (
                <span key={`${s}-${i}`} className="skill-tag">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* CHAT WINDOW */}
          <div
            className="f3 chat-window"
            style={{
              flex: 1,
              minHeight: 0,
              borderRadius: "14px",
              border: "1px solid rgba(99,179,255,.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background:
                  "linear-gradient(90deg,transparent,rgba(99,179,255,.28),transparent)",
                zIndex: 20,
                pointerEvents: "none",
              }}
            />
            <Twin />
          </div>

          {/* FOOTER */}
          <footer
            className="f4 footer-root"
            style={{
              flexShrink: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "8px",
              borderTop: "1px solid rgba(99,179,255,.06)",
            }}
          >
            <span
              className="footer-copyright"
              style={{
                fontSize: "8px",
                color: "#1e3a52",
                letterSpacing: ".1em",
                fontFamily: "DM Mono",
              }}
            >
              © 2025 VINCENT BOMMERT
            </span>
            <div
              className="footer-tags"
              style={{ gap: "14px", alignItems: "center" }}
            >
              {["LLM", "RAG", "MLOPS", "CLOUD"].map((t, i) => (
                <span
                  key={t}
                  style={{
                    fontSize: "8px",
                    color: "#1e3a52",
                    letterSpacing: ".12em",
                    fontFamily: "DM Mono",
                    borderLeft:
                      i === 0 ? "none" : "1px solid rgba(99,179,255,.08)",
                    paddingLeft: i === 0 ? 0 : "14px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <span
              className="footer-powered"
              style={{
                fontSize: "8px",
                color: "#1e3a52",
                letterSpacing: ".08em",
                fontFamily: "DM Mono",
              }}
            >
              Powered by Vincent Bommert AI
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}
