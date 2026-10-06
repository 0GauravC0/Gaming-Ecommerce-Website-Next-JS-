"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { showToast } from "@/components/layout/ToastProvider";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      showToast({ title: "Newsletter not submitted", message: "Please enter a valid email address." });
      return;
    }

    setError("");
    setEmail("");
    showToast({ title: "Subscribed", message: "You will receive gaming deals and launch alerts." });
  };

  return (
    <section className="section container">
      <div className="newsletter gsap-reveal">
        <div>
          <span className="eyebrow">Newsletter</span>
          <h2>Get deal drops before your next match night.</h2>
          <p className="muted">Sign up for new arrivals, low-stock alerts, and setup recommendations.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="newsletter-field">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              type="email"
              aria-label="Newsletter email"
            />
            {error ? <span className="error">{error}</span> : null}
          </div>
          <button className="btn" type="submit">
            Subscribe <Send size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}
