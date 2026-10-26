"use client";

import { useEffect, useState } from "react";

// Below the fixed 72px header, with a little slack so a section counts as
// active slightly before its heading reaches the top.
const ACTIVATION_LINE_PX = 140;

/** Returns the id of the section currently under the header, or null above the first one. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      let current: string | null = null;
      for (const id of ids) {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        if (rect && rect.top <= ACTIVATION_LINE_PX && rect.bottom > ACTIVATION_LINE_PX) current = id;
      }
      setActive(current);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids]);

  return active;
}
