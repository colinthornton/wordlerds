import { html } from "hono/html";
import { layout } from "./layout";

export const signInView = () =>
  layout({
    user: null,
    body: html`<div class="mt-12 grid place-content-center">
      <button
        id="sign-in"
        class="btn uppercase font-bold"
        data-on:click="el.disabled = true; signIn().finally(() => el.disabled = false)"
      >
        Sign In
      </button>
    </div>`,
  });
