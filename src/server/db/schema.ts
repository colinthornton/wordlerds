import { relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: integer("id").primaryKey(),
  discord_id: text("discord_id").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
});

export const game = sqliteTable("game", {
  id: integer("id").primaryKey(),
  date: text("date", { length: 10 }).notNull().unique(),
  solution: text("solution", { length: 5 }).notNull(),
});

export const gameRelations = relations(game, ({ many }) => ({
  attempts: many(attempt),
}));

export const attempt = sqliteTable("attempt", {
  id: integer("id").primaryKey(),
  word: text("word", { length: 5 }).notNull(),
  result: text("result", { length: 5 }).notNull(),
  gameId: integer("game_id")
    .notNull()
    .references(() => game.id),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const attemptRelations = relations(attempt, ({ one }) => ({
  game: one(game, {
    fields: [attempt.gameId],
    references: [game.id],
  }),
  user: one(user, {
    fields: [attempt.userId],
    references: [user.id],
  }),
}));
