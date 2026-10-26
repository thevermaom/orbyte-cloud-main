"use client";

import { useEffect } from "react";

// Headings, cards, FAQ rows and the contact form fade up as they scroll into view.
const TARGETS = "main section h2, main article, main details, main form";
const STAGGER_MS = 80;
const MAX_DELAY_MS = 320;

export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          element.dataset.reveal = "done";
          observer.unobserve(element);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    // Only hide what is below the fold, so nothing visible on load flickers.
    const elements = document.querySelectorAll<HTMLElement>(TARGETS);
    elements.forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      const siblingIndex = Array.prototype.indexOf.call(element.parentElement?.children ?? [], element);
      element.style.setProperty("--reveal-delay", `${Math.min(siblingIndex * STAGGER_MS, MAX_DELAY_MS)}ms`);
      element.dataset.reveal = "pending";
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
