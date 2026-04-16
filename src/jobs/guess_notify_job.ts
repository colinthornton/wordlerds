import { Bunqueue } from "bunqueue/client";
import * as path from "node:path";
import { Guess } from "../models/guess";
import { Feedback } from "../lib/wordle";

export const sendGuessWebhook = (guessId: number) => {
  guessWebhookQueue.add("send_guess_webhook", { guessId });
};

const guessWebhookQueue = new Bunqueue<{ guessId: number }>("guess_webhooks", {
  embedded: true,
  dataPath: path.resolve(__dirname, "../../sqlite/bunqueue.sqlite"),
  processor: async (job) => {
    const success = await sendGuessWebhookToDiscord(job.data.guessId);
    if (!success) {
      throw new Error();
    }
  },
});

const sendGuessWebhookToDiscord = async (guessId: number) => {
  const guess = await Guess.findById(guessId);
  if (!guess) return;

  const webhookUrl = Bun.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const squares = guess.feedback.map((f) => feedbackEmoji[f]).join("");
  const word = guess.word.toUpperCase();
  const link = Bun.env.BETTER_AUTH_URL; // I should rename this but whatever
  const mention = `<@${guess.user.discord_user_id}>`;

  const content = `[${squares} ${word}](${link}) by ${mention}`;

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return res.ok;
};

const feedbackEmoji = {
  [Feedback.NotPresent]: "⬛",
  [Feedback.Present]: "🟨",
  [Feedback.Correct]: "🟩",
};
