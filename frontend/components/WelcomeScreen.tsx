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
  return (
    <div className="fade-up twin-welcome">
      <div className="glass-msg twin-welcome-card">
        <div className="twin-welcome-intro">
          <div className="twin-welcome-icon">
            <Sparkles size={16} color="#63b3ff" />
          </div>
          <div>
            <p className="twin-welcome-title">
              Bonjour, je suis le Digital Twin de Vincent.
            </p>
            <p className="twin-welcome-body">
              Mes expériences professionnelles, projets personnels et
              compétences techniques sont chargés en contexte. Posez-moi
              n'importe quelle question.
            </p>
          </div>
        </div>
      </div>

      <p className="twin-suggestions-label">Suggestions</p>

      <div className="twin-suggestions-list">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={s.text}
            className="sug-card twin-sug-btn"
            style={{ animationDelay: `${i * 60}ms` }}
            onClick={() => {
              onSuggestionClick(s.text);
              inputRef?.current?.focus();
            }}
          >
            <span className="twin-sug-icon">{s.icon}</span>
            <span className="twin-sug-text">{s.text}</span>
            <ChevronRight size={12} color="#2a4a6a" />
          </button>
        ))}
      </div>
    </div>
  );
}
