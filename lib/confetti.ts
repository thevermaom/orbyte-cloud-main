// A small dependency-free confetti burst drawn on a temporary full-screen canvas.

const COLORS = ["#c9ff5a", "#79d9ff", "#ffffff", "#f4f7f2", "#ffb35c"];
const PIECES = 160;
const DURATION_MS = 2600;
const GRAVITY = 0.32;
const DRAG = 0.985;

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
  round: boolean;
};

export function celebrate(origin?: Element | null) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return;

  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "70",
  });
  document.body.appendChild(canvas);
  context.scale(ratio, ratio);

  const rect = origin?.getBoundingClientRect();
  const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const originY = rect ? rect.top + rect.height / 3 : window.innerHeight / 2;

  const pieces: Piece[] = Array.from({ length: PIECES }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
    const speed = 9 + Math.random() * 11;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 7,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.35,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      round: Math.random() < 0.3,
    };
  });

  const start = performance.now();
  const frame = (now: number) => {
    const elapsed = now - start;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.globalAlpha = Math.max(0, 1 - Math.max(0, elapsed - DURATION_MS * 0.6) / (DURATION_MS * 0.4));

    for (const piece of pieces) {
      piece.vx *= DRAG;
      piece.vy = piece.vy * DRAG + GRAVITY;
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.rotation += piece.spin;

      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.rotation);
      context.fillStyle = piece.color;
      if (piece.round) {
        context.beginPath();
        context.arc(0, 0, piece.size / 2.4, 0, Math.PI * 2);
        context.fill();
      } else {
        context.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
      }
      context.restore();
    }

    if (elapsed < DURATION_MS) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}
