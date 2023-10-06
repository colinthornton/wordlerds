CREATE TABLE `attempt` (
	`id` integer PRIMARY KEY NOT NULL,
	`word` text(5) NOT NULL,
	`result` text(5) NOT NULL,
	`game_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `game` (
	`id` integer PRIMARY KEY NOT NULL,
	`date` text(10) NOT NULL,
	`solution` text(5) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`discord_id` text NOT NULL,
	`name` text NOT NULL,
	`avatar` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_date_unique` ON `game` (`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_discord_id_unique` ON `user` (`discord_id`);