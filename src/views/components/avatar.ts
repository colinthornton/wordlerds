import { html } from "hono/html";
import type { User } from "../../models/user";

export const avatar = (props: { user: User }) =>
  html`<img
    class="size-8 shrink-0 object-cover rounded-full"
    alt="${props.user.name}"
    src="${props.user.avatar}?size=32"
  />`;
