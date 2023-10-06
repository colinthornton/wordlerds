import { asc, desc } from "drizzle-orm";
import { coopMugenAttempt, coopMugenGame, type WordlerdsDB } from "../db";
import { WordleGame } from "./WordleGame";
import { createCoopMugenGame } from "./createCoopMugenGame";

export async function getCoopMugenGame(db: WordlerdsDB) {
  const currentGame = await db.query.coopMugenGame.findFirst({
    columns: { id: true, solution: true },
    with: {
      attempts: {
        columns: { word: true, result: true },
        with: {
          user: { columns: { id: true, name: true, avatar: true } },
        },
        orderBy: [asc(coopMugenAttempt.createdAt)],
      },
    },
    orderBy: [desc(coopMugenGame.id)],
  });
  if (!currentGame) {
    return newGame(db);
  }

  const { id, solution, attempts } = currentGame;
  const wordleGame = new WordleGame(id, solution, attempts);
  if (wordleGame.state.status === "GAME_OVER") {
    return newGame(db);
  }
  return {
    data: currentGame,
    wordleGame,
  };
}

async function newGame(db: WordlerdsDB) {
  const newGame = await createCoopMugenGame(db);
  return {
    data: {
      id: newGame.id,
      solution: newGame.solution,
      attempts: [],
    },
    wordleGame: new WordleGame(newGame.id, newGame.solution, []),
  };
}
