import { html } from "hono/html";
import type { User } from "../db/schema";
import { layout } from "./layout";

export const rootView = (props: { user: User }) =>
  layout({
    user: props.user,
    body: html`<pre><code>${JSON.stringify(props.user, null, 2)}</code></pre>
      <button id="sign-out">Sign Out</button>`,
  });
