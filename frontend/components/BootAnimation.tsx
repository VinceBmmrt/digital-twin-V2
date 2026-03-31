"use client";

import { BOOT_LINES } from "./constants";

export default function BootAnimation() {
  return (
    <div className="boot-container">
      <div className="boot-lines">
        {BOOT_LINES.map(([line, color, glow], i) => (
          <div
            key={String(line)}
            className={`boot-line${glow ? " boot-line--glow" : ""}`}
            style={{
              color,
              animationDelay: `${i * 220}ms`,
              textShadow: glow ? "0 0 12px rgba(99,179,255,.5)" : undefined,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
