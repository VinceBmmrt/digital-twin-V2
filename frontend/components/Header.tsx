"use client";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="twin-header">
      <button
        className="twin-menu-btn"
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
      >
        {[0, 1, 2].map((i) => (
          <span key={i} className="twin-menu-bar" />
        ))}
      </button>

      <div className="twin-header-left">
        <h1 className="shimmer-text twin-header-title">
          Digital Twin AI – Cloud Version
        </h1>
      </div>

      <div className="twin-header-status">
        <span className="twin-status-dot" />
        <span className="twin-status-label">EN LIGNE</span>
      </div>
    </header>
  );
}
