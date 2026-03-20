import { html } from "hono/html";
import type { User } from "../db/schema";
import { layout } from "./layout";

export const rootView = (user: User) =>
  layout(
    html`<pre><code>${JSON.stringify(user, null, 2)}</code></pre>
      <button id="sign-out">Sign Out</button>`,
  );
