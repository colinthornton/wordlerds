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
  attempts: many(coopDailyAttempt),
}));

export const coopDailyAttempt = sqliteTable("coop_daily_attempt", {
  id: integer("id").primaryKey(),
  word: text("word", { length: 5 }).notNull(),
  result: text("result", { length: 5 }).notNull(),
  gameId: integer("gamd_id")
    .notNull()
    .references(() => coopDailyGame.id),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const coopDailyAttemptRelations = relations(
  coopDailyAttempt,
  ({ one }) => ({
    coopDailyGame: one(coopDailyGame, {
      fields: [coopDailyAttempt.gameId],
      references: [coopDailyGame.id],
    }),
    user: one(user, {
      fields: [coopDailyAttempt.userId],
      references: [user.id],
    }),
  })
);

export const coopMugenGame = sqliteTable("coop_mugen_game", {
  id: integer("id").primaryKey(),
  solution: text("solution", { length: 5 }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const coopMugenGameRelations = relations(coopMugenGame, ({ many }) => ({
  attempts: many(coopMugenAttempt),
}));

export const coopMugenAttempt = sqliteTable("coop_mugen_attempt", {
  id: integer("id").primaryKey(),
  word: text("word", { length: 5 }).notNull(),
  result: text("result", { length: 5 }).notNull(),
  gameId: integer("gamd_id")
    .notNull()
    .references(() => coopMugenGame.id),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const coopMugenAttemptRelations = relations(
  coopMugenAttempt,
  ({ one }) => ({
    coopDailyGame: one(coopMugenGame, {
      fields: [coopMugenAttempt.gameId],
      references: [coopMugenGame.id],
    }),
    user: one(user, {
      fields: [coopMugenAttempt.userId],
      references: [user.id],
    }),
  })
);
