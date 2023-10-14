import {
  CharResult,
  RESULT_CORRECT,
  RESULT_INCORRECT_PLACE,
  RESULT_NOT_FOUND,
} from "~/types/CharResult";

/**
 * https://discord.com/developers/docs/resources/webhook#execute-webhook
 */
export function getWebhookBody(
  gameTitle: string,
  gameLink: string | URL,
  discordId: string,
  attempt: { count: number; word: string; result: CharResult[] },
) {
  const squares = attempt.result
    .map(
      (r) =>
        ({
          [RESULT_NOT_FOUND]: "⬛",
          [RESULT_INCORRECT_PLACE]: "🟨",
          [RESULT_CORRECT]: "🟩",
        })[r],
    )
    .join("");
  const word = attempt.word.toUpperCase();
  const mention = `<@${discordId}>`;
  const content = `[${gameTitle}](${gameLink})\n${attempt.count}/6 ${mention}\n${squares} ${word}`;
  return {
    content,
    username: "Wordlerds",
  };
}
