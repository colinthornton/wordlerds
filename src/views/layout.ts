import { html } from "hono/html";
import type { User } from "../db/schema";

export const layout = (props: {
  user: User | null;
  body: ReturnType<typeof html>;
}) =>
  html`<!DOCTYPE html>
    <html lang="en" class="dark">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/public/icon.png" />
        <title>Wordlerds</title>
        <link rel="stylesheet" href="/public/wordlerds.css" />
        <script type="module" src="/public/vendor/datastar.js"></script>
        <script type="module" src="/public/wordlerds.js"></script>
      </head>
      <body>
        <header class="h-10 border-b border-b-neutral-700">
          <div
            class="mx-auto max-w-xl h-full px-4 flex justify-between items-center"
          >
            ${props.user
              ? html`<img
                  class="size-8 shrink-0 object-cover rounded-full"
                  alt="${props.user.name}"
                  src="${props.user.avatar}"
                />`
              : html`<div class="size-8 shrink-0"></div>`}
            <h1 class="font-bold uppercase">Wordlerds</h1>
            <div class="size-8 shrink-0"></div>
          </div>
        </header>
        <main class="flex flex-col items-center px-2">${props.body}</main>
        <div
          id="toaster"
          class="toaster bottom-[unset] top-0"
          data-align="center"
        ></div>
      </body>
    </html>`;
