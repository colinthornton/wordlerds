import { html } from "hono/html";
import { layout } from "./layout";

export const signInView = () =>
  layout({
    user: null,
    body: html`<div class="mt-12 grid place-content-center">
      <a id="sign-in" class="btn uppercase font-bold" href="/oauth/discord">
        Sign In
      </a>
    </div>`,
  });
