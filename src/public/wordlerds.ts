import "basecoat-css/basecoat";
import "basecoat-css/toast";

declare global {
  interface Window {
    signIn: () => Promise<void>;
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
