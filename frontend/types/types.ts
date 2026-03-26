import { JSX } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Suggestion {
  text: string;
  icon: string;
}

export interface Skill {
  label: string;
  icon: JSX.Element;
  color: string;
}

export interface System {
  label: string;
  ok: boolean;
}

export interface InputBarProps {
  input: string;
  isLoading: boolean;
  bootDone: boolean;
  inputFocused: boolean;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSend: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}
