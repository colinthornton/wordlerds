import { html } from "hono/html";
import { layout } from "./layout";

export const signInView = () =>
  layout(html`<button id="sign-in">Sign In</button>`);
