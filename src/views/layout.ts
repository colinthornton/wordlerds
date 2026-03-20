import { html } from "hono/html";

export const layout = (body: string | ReturnType<typeof html>) =>
  html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/public/icon.png" />
        <title>Wordlerds</title>
        <script type="module" src="/public/wordlerds.js"></script>
      </head>
      <body>
        ${body}
      </body>
    </html>`;
