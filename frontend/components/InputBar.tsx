"use client";

import { Send } from "lucide-react";
import { InputBarProps } from "@/types/types";

export default function InputBar({
  input,
  isLoading,
  bootDone,
  inputFocused,
  onInputChange,
  onKeyDown,
  onFocus,
  onBlur,
  onSend,
  inputRef,
}: InputBarProps) {
  const isSendDisabled = !input.trim() || isLoading || !bootDone;

  return (
    <div className="twin-inputbar">
      <div className={`input-wrap${inputFocused ? " focused" : ""}`}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Posez votre question…"
          disabled={isLoading || !bootDone}
          className="twin-input"
        />
        <button
          onClick={onSend}
          disabled={isSendDisabled}
          className={isSendDisabled ? "send-btn-off" : "send-btn-on"}
        >
          <span className="twin-send-label">ENVOYER</span>
          <Send size={11} />
        </button>
      </div>

      <div className="twin-kbd-hints">
        <span>↵ Envoyer</span>
        <span>↑↓ Historique</span>
        <span>Esc Effacer</span>
      </div>
    </div>
  );
}
