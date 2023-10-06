CREATE TABLE `attempt` (
	`id` integer PRIMARY KEY NOT NULL,
	`word` text(5) NOT NULL,
	`result` text(5) NOT NULL,
	`coop_daily_game_id` integer,
	`coop_mugen_game_id` integer,
	`user_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`coop_daily_game_id`) REFERENCES `coop_daily_game`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`coop_mugen_game_id`) REFERENCES `coop_mugen_game`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `coop_daily_game` (
	`id` integer PRIMARY KEY NOT NULL,
	`date` text(10) NOT NULL,
	`solution` text(5) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `coop_mugen_game` (
	`id` integer PRIMARY KEY NOT NULL,
	`solution` text(5) NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`discord_id` text NOT NULL,
	`name` text NOT NULL,
	`avatar` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coop_daily_game_date_unique` ON `coop_daily_game` (`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_discord_id_unique` ON `user` (`discord_id`);