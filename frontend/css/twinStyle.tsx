"use client";

export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
      * { box-sizing: border-box; }

      @keyframes cursorBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes barWave      { 0%,100%{transform:scaleY(.15)} 50%{transform:scaleY(1)} }
      @keyframes bootLine     { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
      @keyframes msgIn        { from{opacity:0;transform:translateY(8px) scale(.99)} to{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes fadeUp       { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      @keyframes shimmer      { 0%{background-position:-200% center} 100%{background-position:200% center} }
      @keyframes glowPulse   { 0%,100%{opacity:.5} 50%{opacity:1} }
      @keyframes avatarPulse { 0%,100%{box-shadow:0 0 0 0 rgba(99,179,255,0)} 50%{box-shadow:0 0 0 6px rgba(99,179,255,0.1)} }
      @keyframes orbFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      @keyframes rotate360   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes chatAura    {
        0%,100% { box-shadow: 0 0 0 1px rgba(99,179,255,.06), 0 0 40px rgba(99,179,255,.05); }
        50%     { box-shadow: 0 0 0 1px rgba(99,179,255,.12), 0 0 60px rgba(99,179,255,.09); }
      }

      .msg-in   { animation: msgIn .3s cubic-bezier(.22,.68,0,1.2) both; }
      .fade-up  { animation: fadeUp .5s ease both; }

      .shimmer-text {
        background: linear-gradient(90deg, #63b3ff 0%, #c8e8ff 38%, #fff 48%, #93d0ff 58%, #63b3ff 100%);
        background-size: 200% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 4s linear infinite;
      }
      .glass-msg {
        background: linear-gradient(135deg, rgba(99,179,255,.07) 0%, rgba(99,179,255,.03) 100%);
        border: 1px solid rgba(99,179,255,.14);
        backdrop-filter: blur(12px);
      }
      .sug-card {
        background: rgba(255,255,255,.025);
        border: 1px solid rgba(99,179,255,.1);
        transition: all .2s cubic-bezier(.22,.68,0,1.2);
        cursor: pointer;
      }
      .sug-card:hover { background: rgba(99,179,255,.08); border-color: rgba(99,179,255,.3); transform: translateY(-1px); }

      .skill-chip { background: rgba(99,179,255,.07); border: 1px solid rgba(99,179,255,.15); transition: all .2s; }
      .skill-chip:hover { background: rgba(99,179,255,.14); border-color: rgba(99,179,255,.3); }

      .send-btn-on  { background: linear-gradient(135deg,rgba(99,179,255,.22),rgba(99,179,255,.12)); border: 1px solid rgba(99,179,255,.4); box-shadow: 0 0 20px rgba(99,179,255,.12); cursor: pointer; }
      .send-btn-on:hover { background: linear-gradient(135deg,rgba(99,179,255,.32),rgba(99,179,255,.18)); }
      .send-btn-off { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06); cursor: not-allowed; }

      .input-wrap { border: 1px solid rgba(99,179,255,.1); background: rgba(255,255,255,.03); transition: border-color .25s, box-shadow .25s; border-radius: 14px; }
      .input-wrap.focused { border-color: rgba(99,179,255,.28); box-shadow: 0 0 0 3px rgba(99,179,255,.06); }

      .scroll-area { overflow-y: auto; }
      .scroll-area::-webkit-scrollbar { width: 3px; }
      .scroll-area::-webkit-scrollbar-thumb { background: rgba(99,179,255,.1); border-radius: 999px; }

      .avatar-ring { animation: avatarPulse 3s ease-in-out infinite; }
      .status-dot  { animation: glowPulse 2s ease-in-out infinite; }
      .orb1 { animation: orbFloat 7s ease-in-out infinite; }
      .orb2 { animation: orbFloat 9s ease-in-out infinite; animation-delay: -4s; }

      /* ─────────────────────────────────────────
         SIDEBAR RESPONSIVE WRAPPER
         Desktop (>768px): static, always visible.
         Tablet / Mobile (≤768px): slides in from
         left as a fixed overlay, z-index 40.
      ───────────────────────────────────────── */
      .twin-sidebar {
        /* Desktop default — normal flex child */
        position: relative;
        z-index: 10;
        flex-shrink: 0;
        transform: none;
        transition: transform .28s cubic-bezier(.4,0,.2,1);
      }

      /* ─────────────────────────────────────────
         TABLET  ≤ 768px
      ───────────────────────────────────────── */
      @media (max-width: 768px) {
        /* Sidebar becomes a fixed overlay */
        .twin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 40;
          transform: translateX(-100%);
        }
        .twin-sidebar--open {
          transform: translateX(0);
        }

        /* Show hamburger button */
        .twin-menu-btn {
          display: flex !important;
          margin-right: 12px;
        }

        /* Header tighter padding */
        .twin-header {
          padding: 12px 18px !important;
        }
        .twin-header-title {
          font-size: 16px !important;
        }

        /* Input bar tighter padding */
        .twin-inputbar {
          padding: 12px 18px 10px !important;
        }

        /* Scroll area tighter padding */
        .twin-scroll-area {
          padding: 18px 20px !important;
        }

        /* Welcome screen top padding */
        .twin-welcome {
          padding-top: 20px !important;
        }
      }

      /* ─────────────────────────────────────────
         MOBILE  ≤ 480px
      ───────────────────────────────────────── */
      @media (max-width: 480px) {
        .twin-header {
          padding: 10px 12px !important;
        }
        .twin-header-title {
          font-size: 14px !important;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .twin-inputbar {
          padding: 10px 12px 8px !important;
        }

        /* Hide keyboard shortcut hints — useless on touch */
        .twin-kbd-hints {
          display: none !important;
        }

        /* Collapse "ENVOYER" label, keep icon only */
        .twin-send-label {
          display: none;
        }

        /* Send button: icon-only, square */
        .send-btn-on, .send-btn-off {
          padding: 8px !important;
          gap: 0 !important;
        }

        .twin-scroll-area {
          padding: 14px 12px !important;
        }

        .twin-welcome {
          padding-top: 12px !important;
        }

        /* WelcomeScreen glass card tighter */
        .twin-welcome .glass-msg {
          padding: 18px !important;
        }
      }
    `}</style>
  );
}
