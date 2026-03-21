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

document.querySelector("#sign-out")?.addEventListener("click", async (e) => {
  const button = e.target as HTMLButtonElement;
  button.disabled = true;

  const res = await fetch("/api/auth/sign-out", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const { success, message } = await res.json();
  if (success) {
    return window.location.assign("/sign-in");
  }

  console.error(message);
  button.disabled = false;
});
