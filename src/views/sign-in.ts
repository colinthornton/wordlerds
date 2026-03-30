import { html } from "hono/html";
import type { User } from "../db/schema";
import { layout } from "./layout";

export const signInView = () =>
  layout({
    user: null,
    body: html`<div class="mt-12 grid place-content-center">
      <button id="sign-in" class="btn uppercase font-bold">Sign In</button>
    </div>`,
  });
