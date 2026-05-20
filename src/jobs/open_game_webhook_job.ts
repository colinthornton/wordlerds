import { Bunqueue } from "bunqueue/client";
import * as path from "node:path";
import { Game } from "../models/game";

export const scheduleGameOpenWebhook = (game: Game) => {
  openGameQueue.add(
    "send_game_open_webhook",
    { gameId: game.id },
    { delay: game.opens_in },
  );
};

const openGameQueue = new Bunqueue<{ gameId: number }>("game_open_webhooks", {
  embedded: true,
  dataPath: path.resolve(__dirname, "../../sqlite/bunqueue.sqlite"),
  processor: async (job) => {
    const success = await sendGameOpenWebhookToDiscord(job.data.gameId);
    if (!success) {
      throw new Error();
    }
  },
});

const sendGameOpenWebhookToDiscord = async (gameId: number) => {
  const game = await Game.findById(gameId);
  if (!game) return false;
  if (game.state !== "IN_PROGRESS") return true; // do nothing if the game's already over

  const webhookUrl = Bun.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const link = Bun.env.ORIGIN;
  const content = `[AGAPE mode activated](${link})`;

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return res.ok;
};
