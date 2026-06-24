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

window.addEventListener("keydown", (e: KeyboardEvent) => {
  const { key, altKey, ctrlKey, metaKey, shiftKey } = e;
  if (altKey || ctrlKey || metaKey || shiftKey) return;
  switch (key) {
    case "Backspace":
      window.dispatchEvent(new CustomEvent("backspacekeydown"));
      break;
    case "Enter":
      window.dispatchEvent(new CustomEvent("enterkeydown"));
      break;
    default:
      if (!/[a-z]/.test(key)) break;
      window.dispatchEvent(
        new CustomEvent("letterkeydown", { detail: { key } }),
      );
  }
});
