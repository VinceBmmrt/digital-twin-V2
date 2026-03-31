"use client";

export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');

      * { box-sizing: border-box; }

      /* ─── Keyframes ─────────────────────────────── */
      @keyframes cursorBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes barWave      { 0%,100%{transform:scaleY(.15)} 50%{transform:scaleY(1)} }
      @keyframes bootLine     { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
      @keyframes msgIn        { from{opacity:0;transform:translateY(8px) scale(.99)} to{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes fadeUp       { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      @keyframes shimmer      { 0%{background-position:-200% center} 100%{background-position:200% center} }
      @keyframes glowPulse    { 0%,100%{opacity:.5} 50%{opacity:1} }
      @keyframes avatarPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(99,179,255,0)} 50%{box-shadow:0 0 0 6px rgba(99,179,255,.1)} }
      @keyframes orbFloat     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      @keyframes rotate360    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes chatAura     {
        0%,100% { box-shadow: 0 0 0 1px rgba(99,179,255,.06), 0 0 40px rgba(99,179,255,.05); }
        50%     { box-shadow: 0 0 0 1px rgba(99,179,255,.12), 0 0 60px rgba(99,179,255,.09); }
      }

      /* ─── Utility animations ────────────────────── */
      .msg-in  { animation: msgIn .3s cubic-bezier(.22,.68,0,1.2) both; }
      .fade-up { animation: fadeUp .5s ease both; }
      .orb1    { animation: orbFloat 7s ease-in-out infinite; }
      .orb2    { animation: orbFloat 9s ease-in-out infinite; animation-delay: -4s; }
      .avatar-ring { animation: avatarPulse 3s ease-in-out infinite; }
      .status-dot  { animation: glowPulse 2s ease-in-out infinite; }

      /* ─── Shimmer text ──────────────────────────── */
      .shimmer-text {
        background: linear-gradient(90deg, #63b3ff 0%, #c8e8ff 38%, #fff 48%, #93d0ff 58%, #63b3ff 100%);
        background-size: 200% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 4s linear infinite;
      }

      /* ─── Glass card ────────────────────────────── */
      .glass-msg {
        background: linear-gradient(135deg, rgba(99,179,255,.07) 0%, rgba(99,179,255,.03) 100%);
        border: 1px solid rgba(99,179,255,.14);
        backdrop-filter: blur(12px);
      }

      /* ─── Scrollbar ─────────────────────────────── */
      .scroll-area { overflow-y: auto; }
      .scroll-area::-webkit-scrollbar { width: 3px; }
      .scroll-area::-webkit-scrollbar-thumb { background: rgba(99,179,255,.1); border-radius: 999px; }

      /* ─── Skill chip ────────────────────────────── */
      .skill-chip {
        background: rgba(99,179,255,.07);
        border: 1px solid rgba(99,179,255,.15);
        transition: all .2s;
      }
      .skill-chip:hover { background: rgba(99,179,255,.14); border-color: rgba(99,179,255,.3); }

      /* ─── Send buttons ──────────────────────────── */
      .send-btn-on {
        background: linear-gradient(135deg,rgba(99,179,255,.22),rgba(99,179,255,.12));
        border: 1px solid rgba(99,179,255,.4);
        box-shadow: 0 0 20px rgba(99,179,255,.12);
        cursor: pointer;
        display: flex; align-items: center; gap: 8px;
        padding: 8px 16px; border-radius: 10px;
        font-family: 'DM Mono', monospace; font-size: 11px;
        letter-spacing: .12em; font-weight: 500; color: #93d0ff;
        transition: all .2s;
      }
      .send-btn-on:hover { background: linear-gradient(135deg,rgba(99,179,255,.32),rgba(99,179,255,.18)); }
      .send-btn-off {
        background: rgba(255,255,255,.03);
        border: 1px solid rgba(255,255,255,.06);
        cursor: not-allowed;
        display: flex; align-items: center; gap: 8px;
        padding: 8px 16px; border-radius: 10px;
        font-family: 'DM Mono', monospace; font-size: 11px;
        letter-spacing: .12em; font-weight: 500; color: #2a4a6a;
        transition: all .2s;
      }

      /* ─── Input wrap ────────────────────────────── */
      .input-wrap {
        display: flex; align-items: center; gap: 12px; padding: 12px 16px;
        border: 1px solid rgba(99,179,255,.1);
        background: rgba(255,255,255,.03);
        border-radius: 14px;
        transition: border-color .25s, box-shadow .25s;
      }
      .input-wrap.focused {
        border-color: rgba(99,179,255,.28);
        box-shadow: 0 0 0 3px rgba(99,179,255,.06);
      }

      /* ─── Suggestion card ───────────────────────── */
      .sug-card {
        background: rgba(255,255,255,.025);
        border: 1px solid rgba(99,179,255,.1);
        transition: all .2s cubic-bezier(.22,.68,0,1.2);
        cursor: pointer;
      }
      .sug-card:hover { background: rgba(99,179,255,.08); border-color: rgba(99,179,255,.3); transform: translateY(-1px); }

      /* ═══════════════════════════════════════════════
         TWIN ROOT LAYOUT
      ═══════════════════════════════════════════════ */
      .twin-root {
        position: absolute; inset: 0;
        font-family: 'DM Mono', monospace;
        overflow: hidden;
      }
      .twin-layout {
        position: absolute; inset: 0;
        display: flex; width: 100%; height: 100%;
        background: #08131f; overflow: hidden;
      }
      .twin-bg { position: absolute; inset: 0; z-index: 0; }
      .twin-main {
        flex: 1; min-width: 0; min-height: 0;
        display: flex; flex-direction: column;
        position: relative; z-index: 10;
        background: rgba(10,20,36,.55);
        overflow: hidden;
      }
      .twin-scroll-area {
        flex: 1; min-height: 0;
        overflow-y: auto; overflow-x: hidden;
        padding: 28px 32px;
      }
      .twin-backdrop {
        position: absolute; inset: 0; z-index: 30;
        background: rgba(0,0,0,.55);
        backdrop-filter: blur(2px);
      }

      /* ─── Sidebar ───────────────────────────────── */
      .twin-sidebar {
        position: relative; z-index: 10; flex-shrink: 0;
        transform: none;
        transition: transform .28s cubic-bezier(.4,0,.2,1);
      }
      .sidebar-root {
        position: relative; z-index: 10;
        width: 240px; min-width: 240px; max-width: 240px;
        display: flex; flex-direction: column;
        background: rgba(4,8,16,.97);
        border-right: 1px solid rgba(99,179,255,.15);
        flex-shrink: 0; height: 100%;
      }
      .sidebar-profile {
        padding: 28px 20px 24px;
        border-bottom: 1px solid rgba(99,179,255,.08);
        display: flex; flex-direction: column;
        align-items: center; gap: 14px;
      }
      .sidebar-avatar-wrap { position: relative; }
      .sidebar-avatar {
        width: 64px; height: 64px; border-radius: 16px;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg,rgba(99,179,255,.2),rgba(99,179,255,.06));
        border: 1px solid rgba(99,179,255,.25);
      }
      .sidebar-avatar-initials {
        font-family: 'Syne', sans-serif;
        font-size: 22px; font-weight: 700; color: #63b3ff;
      }
      .sidebar-avatar-dot {
        position: absolute; bottom: -4px; right: -4px;
        width: 13px; height: 13px; border-radius: 50%;
        background: #4ade80; border: 2px solid #060d18;
        box-shadow: 0 0 6px #4ade80;
      }
      .sidebar-identity { text-align: center; }
      .sidebar-name {
        font-family: 'Syne', sans-serif;
        font-weight: 700; font-size: 15px; color: #fff; letter-spacing: .03em;
      }
      .sidebar-role {
        font-family: 'DM Mono', monospace;
        font-size: 10px; color: #4a7a9b; margin-top: 3px;
        letter-spacing: .1em; text-transform: uppercase;
      }
      .sidebar-skills {
        display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;
      }
      .sidebar-skill-chip {
        display: flex; align-items: center; gap: 4px;
        padding: 2px 8px; border-radius: 6px;
        font-family: 'DM Mono', monospace;
        font-size: 9px; letter-spacing: .1em; text-transform: uppercase;
      }
      .sidebar-section { padding: 20px; }
      .sidebar-section--bottom { margin-top: auto; }
      .sidebar-section-title {
        font-family: 'DM Mono', monospace;
        font-size: 9px; color: #2a4a6a;
        letter-spacing: .18em; text-transform: uppercase; margin-bottom: 14px;
      }
      .sidebar-row {
        display: flex; align-items: center; margin-bottom: 10px;
      }
      .sidebar-row-label {
        font-family: 'DM Mono', monospace;
        font-size: 10px; color: #4a7a9b; flex: 1;
      }
      .sidebar-row-value {
        font-family: 'DM Mono', monospace;
        font-size: 10px; color: #63b3ff; font-weight: 500;
      }
      .sidebar-divider { height: 1px; background: rgba(99,179,255,.06); margin: 0 20px; }
      .sidebar-system-status { display: flex; align-items: center; gap: 6px; }
      .sidebar-system-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: #4ade80; box-shadow: 0 0 4px #4ade80;
        animation: glowPulse 2.5s ease-in-out infinite;
      }
      .sidebar-system-ok {
        font-family: 'DM Mono', monospace;
        font-size: 9px; color: #4ade80;
      }

      /* ─── Header ────────────────────────────────── */
      .twin-header {
        flex-shrink: 0; display: flex; align-items: center; justify-content: space-between;
        padding: 18px 32px;
        border-bottom: 1px solid rgba(99,179,255,.1);
        background: rgba(8,16,30,.95);
        backdrop-filter: blur(20px);
      }
      .twin-header-left { min-width: 0; flex: 1; }
      .twin-header-title {
        font-family: 'Syne', sans-serif;
        font-size: 20px; font-weight: 700; margin: 0;
      }
      .twin-header-status { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
      .twin-status-dot {
        width: 8px; height: 8px; border-radius: 50%;
        background: #4ade80; box-shadow: 0 0 6px #4ade80;
        animation: glowPulse 2s ease-in-out infinite;
      }
      .twin-status-label {
        font-family: 'DM Mono', monospace;
        font-size: 10px; color: #4a9b6a; letter-spacing: .1em;
      }
      /* Hamburger — hidden on desktop */
      .twin-menu-btn {
        display: none;
        background: none; border: 1px solid rgba(99,179,255,.15);
        border-radius: 8px; padding: 6px 8px; cursor: pointer;
        flex-direction: column; gap: 4px;
        align-items: center; justify-content: center;
        flex-shrink: 0; margin-right: 12px;
      }
      .twin-menu-bar {
        display: block; width: 16px; height: 1.5px;
        background: #4a7a9b; border-radius: 1px;
      }

      /* ─── InputBar ──────────────────────────────── */
      .twin-inputbar {
        flex-shrink: 0; flex-grow: 0;
        padding: 18px 32px 16px;
        border-top: 1px solid rgba(99,179,255,.1);
        background: rgba(8,16,30,.95);
        backdrop-filter: blur(20px);
      }
      .twin-input {
        flex: 1; min-width: 0;
        background: transparent; border: none; outline: none;
        color: #b8d8f0; font-size: 13.5px;
        font-family: 'DM Mono', monospace; font-weight: 300;
      }
      .twin-kbd-hints {
        display: flex; gap: 20px; margin-top: 8px; padding-left: 4px;
        font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: .1em;
      }
      .twin-kbd-hints span:nth-child(1) { color: #2a4a6a; }
      .twin-kbd-hints span:nth-child(2),
      .twin-kbd-hints span:nth-child(3) { color: #1e3a52; }

      /* ─── WelcomeScreen ─────────────────────────── */
      .twin-welcome {
        max-width: 560px; margin: 0 auto; width: 100%; padding-top: 40px;
      }
      .twin-welcome-card { border-radius: 16px; padding: 28px; margin-bottom: 28px; }
      .twin-welcome-intro { display: flex; gap: 18px; align-items: flex-start; }
      .twin-welcome-icon {
        width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg,rgba(99,179,255,.2),rgba(99,179,255,.06));
        border: 1px solid rgba(99,179,255,.2);
      }
      .twin-welcome-title {
        font-family: 'Syne', sans-serif;
        font-weight: 600; color: #c8e8ff; font-size: 15px; margin: 0 0 8px;
      }
      .twin-welcome-body {
        font-family: 'DM Mono', monospace;
        color: #4a7a9b; font-size: 12.5px; line-height: 1.7; margin: 0; font-weight: 300;
      }
      .twin-suggestions-label {
        font-family: 'DM Mono', monospace;
        font-size: 9px; color: #2a4a6a;
        letter-spacing: .18em; text-transform: uppercase; margin-bottom: 12px;
      }
      .twin-suggestions-list { display: flex; flex-direction: column; gap: 8px; }
      .twin-sug-btn {
        border-radius: 12px; padding: 13px 18px; text-align: left;
        display: flex; align-items: center; gap: 14px;
        background: none; border: none; width: 100%;
      }
      .twin-sug-icon { font-size: 16px; }
      .twin-sug-text {
        font-family: 'DM Mono', monospace;
        font-size: 12.5px; color: #5a8aaa; font-weight: 300; flex: 1; text-align: left;
      }

      /* ─── BootAnimation ─────────────────────────── */
      .boot-container {
        height: 100%; display: flex; align-items: center; justify-content: center;
      }
      .boot-lines {
        font-family: 'DM Mono', monospace; font-size: 11px; line-height: 2.2;
      }
      .boot-line {
        opacity: 0;
        animation: bootLine .22s ease both;
      }

      /* ═══════════════════════════════════════════════
         RESPONSIVE — TABLET ≤ 768px
      ═══════════════════════════════════════════════ */
      @media (max-width: 768px) {
        .twin-sidebar {
          position: fixed; top: 0; left: 0; bottom: 0;
          z-index: 40; transform: translateX(-100%);
        }
        .twin-sidebar--open { transform: translateX(0); }

        .twin-menu-btn { display: flex; }

        .twin-header { padding: 12px 18px; }
        .twin-header-title { font-size: 16px; }

        .twin-inputbar { padding: 12px 18px 10px; }
        .twin-scroll-area { padding: 18px 20px; }
        .twin-welcome { padding-top: 20px; }
      }

      /* ═══════════════════════════════════════════════
         RESPONSIVE — MOBILE ≤ 480px
      ═══════════════════════════════════════════════ */
      @media (max-width: 480px) {
        .twin-header { padding: 10px 12px; }
        .twin-header-title {
          font-size: 14px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .twin-inputbar { padding: 10px 12px 8px; }
        .twin-kbd-hints { display: none; }
        .twin-send-label { display: none; }
        .send-btn-on, .send-btn-off { padding: 8px; gap: 0; }

        .twin-scroll-area { padding: 14px 12px; }
        .twin-welcome { padding-top: 12px; }
        .twin-welcome-card { padding: 18px; }
      }
    `}</style>
  );
}
