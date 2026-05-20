import "basecoat-css/basecoat";
import "basecoat-css/toast";
import confetti from "canvas-confetti";

declare global {
  interface Window {
    fireConfetti: () => void;
  }
}

window.fireConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 60,
    origin: { y: 0.6 },
    disableForReducedMotion: true,
  });
};
