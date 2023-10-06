import { relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: integer("id").primaryKey(),
  discord_id: text("discord_id").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
});

export const coopDailyGame = sqliteTable("coop_daily_game", {
  id: integer("id").primaryKey(),
  date: text("date", { length: 10 }).notNull().unique(),
  solution: text("solution", { length: 5 }).notNull(),
});

export const coopDailyGameRelations = relations(coopDailyGame, ({ many }) => ({
  attempts: many(attempt),
}));

export const coopMugenGame = sqliteTable("coop_mugen_game", {
  id: integer("id").primaryKey(),
  solution: text("solution", { length: 5 }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const coopMugenGameRelations = relations(coopMugenGame, ({ many }) => ({
  attempts: many(attempt),
}));

export const attempt = sqliteTable("attempt", {
  id: integer("id").primaryKey(),
  word: text("word", { length: 5 }).notNull(),
  result: text("result", { length: 5 }).notNull(),
  coopDailyGameId: integer("coop_daily_game_id").references(
    () => coopDailyGame.id
  ),
  coopMugenGameId: integer("coop_mugen_game_id").references(
    () => coopMugenGame.id
  ),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const attemptRelations = relations(attempt, ({ one }) => ({
  coopDailyGame: one(coopDailyGame, {
    fields: [attempt.coopDailyGameId],
    references: [coopDailyGame.id],
  }),
  coopMugenGame: one(coopMugenGame, {
    fields: [attempt.coopMugenGameId],
    references: [coopMugenGame.id],
  }),
  user: one(user, {
    fields: [attempt.userId],
    references: [user.id],
  }),
}));
