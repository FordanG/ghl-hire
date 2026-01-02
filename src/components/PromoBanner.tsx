"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "promo-banner-dismissed";

const messages = [
  "Need a quick page clone?",
  "Clone GHL funnels & websites instantly!",
  "Save hours duplicating client setups.",
  "Managing multiple GHL clients? Clone pages in seconds.",
  "Stop rebuilding funnels from scratch.",
];

export default function PromoBanner() {
  const [isDismissed, setIsDismissed] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsDismissed(false);
      // Pick a random message
      const randomIndex = Math.floor(Math.random() * messages.length);
      setMessage(messages[randomIndex]);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  if (isDismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 pr-12">
      <p className="text-center text-sm">{message} <a href="https://supercloner.app/?ref=3nojbk" target="_blank" rel="noopener noreferrer" className="inline font-semibold underline underline-offset-2 hover:text-blue-100 transition-colors">Try Super Cloner</a></p>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
