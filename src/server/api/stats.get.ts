import { db } from "@/server/db";
import {
  RESULT_CORRECT,
  RESULT_INCORRECT_PLACE,
  RESULT_NOT_FOUND,
} from "~/types/CharResult";

export default defineEventHandler(async (event) => {
  const users = await db.query.user.findMany({
    with: {
      coopDailyAttempts: {
        columns: {
          result: true,
        },
      },
      coopMugenAttempts: {
        columns: {
          result: true,
        },
      },
    },
  });
  const userStats = users
    .map((user) => {
      const guesses =
        user.coopDailyAttempts.length + user.coopMugenAttempts.length;
      if (guesses === 0) {
        return undefined;
      }

      const letters = guesses * 5;
      let blacks = 0;
      let yellows = 0;
      let greens = 0;
      for (const { result: results } of user.coopDailyAttempts.concat(
        user.coopMugenAttempts
      )) {
        for (const result of results) {
          switch (Number(result)) {
            case RESULT_NOT_FOUND:
              blacks++;
              break;
            case RESULT_INCORRECT_PLACE:
              yellows++;
              break;
            case RESULT_CORRECT:
              greens++;
              break;
          }
        }
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
        stats: {
          guesses,
          black: formatPercentage(blacks, letters),
          yellow: formatPercentage(yellows, letters),
          green: formatPercentage(greens, letters),
        },
      };
    })
    .filter((user) => Boolean(user));

  return userStats;
});

const percentFormatter = Intl.NumberFormat("en", {
  style: "percent",
  maximumFractionDigits: 2,
});
function formatPercentage(numerator: number, denominator: number) {
  const decimal = numerator / denominator;
  return percentFormatter.format(decimal);
}
