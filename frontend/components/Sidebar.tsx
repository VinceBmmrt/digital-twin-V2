"use client";

import { SKILLS, SYSTEMS } from "./constants";

interface SidebarProps {
  messagesCount: number;
  timeStr: string;
  sessionId: string;
}

export default function Sidebar({
  messagesCount,
  timeStr,
  sessionId,
}: SidebarProps) {
  const sessionRows = [
    { label: "Messages", value: String(messagesCount) },
    { label: "Heure", value: timeStr },
    ...(sessionId
      ? [{ label: "ID", value: `#${sessionId.slice(0, 6).toUpperCase()}` }]
      : []),
  ];

  return (
    <aside className="sidebar-root">
      {/* Profile */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar-wrap">
          <div className="avatar-ring sidebar-avatar">
            <span className="sidebar-avatar-initials">VB</span>
          </div>
          <div className="status-dot sidebar-avatar-dot" />
        </div>
        <div className="sidebar-identity">
          <div className="sidebar-name">Vincent Bommert</div>
          <div className="sidebar-role">Digital Twin</div>
        </div>
        <div className="sidebar-skills">
          {SKILLS.map((s) => (
            <span
              key={s.label}
              className="skill-chip sidebar-skill-chip"
              style={{ color: s.color }}
            >
              {s.icon} {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Session info */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Session Info</div>
        {sessionRows.map((r) => (
          <div key={r.label} className="sidebar-row">
            <span className="sidebar-row-label">{r.label}</span>
            <span className="sidebar-row-value">{r.value}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-divider" />

      {/* Systems */}
      <div className="sidebar-section sidebar-section--bottom">
        <div className="sidebar-section-title">Systèmes</div>
        {SYSTEMS.map((s) => (
          <div key={s.label} className="sidebar-row">
            <span className="sidebar-row-label">{s.label}</span>
            <div className="sidebar-system-status">
              <div className="sidebar-system-dot" />
              <span className="sidebar-system-ok">OK</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
