import { html } from "hono/html";
import { dictionary } from "../../lib/wordle";

const hardModeEmojis = [
  "1265484171598364733",
  "1312821859250737275",
  "1139222642226900992",
  "1418331504391491747",
  "1311168297550741524",
];
const hardModeTitles = [
  `This ain't easy mode`,
  `How disappointing`,
  `Please use the correct letters`,
];
export const hardModeToast = () => {
  const emoji =
    hardModeEmojis[Math.floor(Math.random() * hardModeEmojis.length)];
  const title = hardModeTitles[
    Math.floor(Math.random() * hardModeTitles.length)
  ] as string;
  return toast({ emoji, title });
};

const notInDictionaryEmojis = [
  "857092293462851604",
  "1138304000702304336",
  "1007113546183741540",
  "1230604141936640050",
  "1283610197801173104",
];
export const notInDictionaryToast = (word: string) => {
  const emoji = notInDictionaryEmojis[
    Math.floor(Math.random() * notInDictionaryEmojis.length)
  ] as string;
  return toast({
    emoji,
    title: `There are ${Intl.NumberFormat("en-US").format(dictionary.size)} words in the Wordle dictionary`,
    description: `"${word}" ain't one of them`,
  });
};

export const toast = (props: {
  title: string;
  emoji?: string;
  description?: string;
}) =>
  html`<div
    class="toast"
    role="status"
    aria-atomic="true"
    aria-hidden="false"
    data-category="error"
  >
    <div class="toast-content">
      ${props.emoji &&
      html`<img
        aria-hidden="true"
        src="https://cdn.discordapp.com/emojis/${props.emoji}.webp?size=24"
        class="size-6 object-contain"
      />`}
      <section>
        <h2>${props.title}</h2>
        ${props.description && html`<p>${props.description}</p>`}
      </section>
    </div>
  </div>`;
