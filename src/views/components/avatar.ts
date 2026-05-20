import { html } from "hono/html";
import type { User } from "../../models/user";

export const avatar = (props: { user: User }) => {
  const { name, avatar } = props.user;
  return html`<img
    class="size-8 shrink-0 object-cover rounded-full"
    alt="${name}"
    src="${avatar}?size=32"
    srcset="${avatar}?size=64 2x, ${avatar}?size=128 4x"
    width="32"
    height="32"
  />`;
};
