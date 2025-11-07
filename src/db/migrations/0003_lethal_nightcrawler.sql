CREATE TABLE "refresh_token" (
	"token" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;