import Twin from "@/components/twin";
import "@/css/pageStyle.css";

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

const FOOTER_TAGS = ["LLM", "RAG", "MLOPS", "CLOUD"];

export default function Home() {
  return (
    <>
      {/* ── Background decorations ── */}
      <div className="bg-orbs">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>
      <div className="bg-dots" />
      <div className="bg-fx">
        <div className="bg-scan" />
        <div className="bg-lines" />
        <div className="bg-vignette" />
      </div>

      {/* ── Full-page layout ── */}
      <div className="page-fixed">
        {/* NAV */}
        <nav className="f1 page-nav">
          <div className="nav-left">
            {["#ff6b6b", "#ffd166", "#06d6a0"].map((c) => (
              <div
                key={c}
                className="nav-dot"
                style={{ background: c, boxShadow: `0 0 6px ${c}` }}
              />
            ))}
            <span className="nav-label">AI DIGITAL TWIN · SESSION ACTIVE</span>
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

        {/* CONTENT */}
        <div className="page-content">
          {/* IDENTITY */}
          <header className="f1 identity-header">
            <div className="identity-label">
              <div className="identity-rule identity-rule--l" />
              AI ENGINEER · DIGITAL TWIN · IN PRODUCTION
              <div className="identity-rule identity-rule--r" />
            </div>
            <span className="name-shimmer">VINCENT BOMMERT</span>
            <div className="identity-sub">
              <p className="identity-tagline">
                Ingénieur IA · Multi-agents &amp; RAG en production ·
                Fine-tuning LLM
              </p>
              <div className="identity-online">
                <span className="identity-online-dot" />
                <span className="identity-online-label">EN LIGNE</span>
              </div>
            </div>
          </header>

          {/* SKILLS TICKER */}
          <div className="f2 ticker-wrap ticker-section">
            <div className="ticker-fade-l" />
            <div className="ticker-fade-r" />
            <div className="ticker-inner">
              {[...SKILLS, ...SKILLS].map((s, i) => (
                <span key={`${s}-${i}`} className="skill-tag">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* CHAT WINDOW */}
          <div className="f3 chat-window chat-box">
            <div className="chat-shimmer-line" />
            <Twin />
          </div>

          {/* FOOTER */}
          <footer className="f4 page-footer">
            <span className="footer-copyright">© 2025 VINCENT BOMMERT</span>
            <div className="footer-tags">
              {FOOTER_TAGS.map((t) => (
                <span key={t} className="footer-tag">
                  {t}
                </span>
              ))}
            </div>
            <span className="footer-powered">
              Powered by Vincent Bommert AI
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}
