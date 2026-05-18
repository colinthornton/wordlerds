import "basecoat-css/basecoat";
import "basecoat-css/toast";
import confetti from "canvas-confetti";

declare global {
  interface Window {
    signIn: () => Promise<void>;
    fireConfetti: () => void;
  }
}

window.signIn = async () => {
  const res = await fetch("/api/auth/sign-in/social", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider: "discord" }),
  });
  const { redirect, url, message } = await res.json();
  if (redirect && url) {
    return window.location.assign(url);
  }

  console.error(message);
};

window.fireConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 60,
    origin: { y: 0.6 },
    disableForReducedMotion: true,
  });
};
