"use client";

import { useState, useEffect } from "react";

interface UseBootReturn {
  bootDone: boolean;
  timeStr: string;
}

export function useBoot(delayMs = 2200): UseBootReturn {
  const [bootDone, setBootDone] = useState(false);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setBootDone(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  useEffect(() => {
    const update = () =>
      setTimeStr(
        new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  return { bootDone, timeStr };
}
