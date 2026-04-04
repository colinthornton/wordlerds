import "basecoat-css/basecoat";
import "basecoat-css/toast";

document.querySelector("#sign-in")?.addEventListener("click", async (e) => {
  const button = e.target as HTMLButtonElement;
  button.disabled = true;

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
  button.disabled = false;
});
