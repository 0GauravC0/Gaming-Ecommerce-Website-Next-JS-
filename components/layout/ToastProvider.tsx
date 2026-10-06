"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";

type ToastDetail = {
  title: string;
  message: string;
};

export function showToast(detail: ToastDetail) {
  window.dispatchEvent(new CustomEvent<ToastDetail>("gameforge-toast", { detail }));
}

export function ToastProvider() {
  const [toast, setToast] = useState<ToastDetail | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      setToast((event as CustomEvent<ToastDetail>).detail);
      window.setTimeout(() => setToast(null), 2400);
    };

    window.addEventListener("gameforge-toast", handler);
    return () => window.removeEventListener("gameforge-toast", handler);
  }, []);

  if (!toast) return null;

  return (
    <div className="toast-modal" role="status" aria-live="polite">
      <div className="toast-card">
        <CheckCircle2 size={22} />
        <div>
          <strong>{toast.title}</strong>
          <p>{toast.message}</p>
        </div>
        <button onClick={() => setToast(null)} aria-label="Close alert">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
