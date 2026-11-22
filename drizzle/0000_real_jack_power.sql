CREATE TABLE "life_books" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_cats" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_checkins" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_events" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_friends" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_goals" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_groceries" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_habits" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_investments" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_kv" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_meta" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_moments" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_projects" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_reminders" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_trips" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_wishlist" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"sort_date" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX "life_books_sort_date_idx" ON "life_books" USING btree ("sort_date");--> statement-breakpoint
CREATE INDEX "life_cats_sort_date_idx" ON "life_cats" USING btree ("sort_date");--> statement-breakpoint
CREATE INDEX "life_checkins_sort_date_idx" ON "life_checkins" USING btree ("sort_date");--> statement-breakpoint
CREATE INDEX "life_events_sort_date_idx" ON "life_events" USING btree ("sort_date");--> statement-breakpoint
CREATE INDEX "life_friends_sort_date_idx" ON "life_friends" USING btree ("sort_date");--> statement-breakpoint
CREATE INDEX "life_goals_sort_date_idx" ON "life_goals" USING btree ("sort_date");--> statement-breakpoint
CREATE INDEX "life_groceries_sort_date_idx" ON "life_groceries" USING btree ("sort_date");--> statement-breakpoint
CREATE INDEX "life_habits_sort_date_idx" ON "life_habits" USING btree ("sort_date");--> statement-breakpoint
CREATE INDEX "life_investments_sort_date_idx" ON "life_investments" USING btree ("sort_date");--> statement-breakpoint
CREATE INDEX "life_moments_sort_date_idx" ON "life_moments" USING btree ("sort_date");--> statement-breakpoint
CREATE INDEX "life_projects_sort_date_idx" ON "life_projects" USING btree ("sort_date");--> statement-breakpoint
CREATE INDEX "life_reminders_sort_date_idx" ON "life_reminders" USING btree ("sort_date");--> statement-breakpoint
CREATE INDEX "life_tasks_sort_date_idx" ON "life_tasks" USING btree ("sort_date");--> statement-breakpoint
CREATE INDEX "life_transactions_sort_date_idx" ON "life_transactions" USING btree ("sort_date");--> statement-breakpoint
CREATE INDEX "life_trips_sort_date_idx" ON "life_trips" USING btree ("sort_date");--> statement-breakpoint
CREATE INDEX "life_wishlist_sort_date_idx" ON "life_wishlist" USING btree ("sort_date");