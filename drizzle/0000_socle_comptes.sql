CREATE TYPE "public"."accord_parental" AS ENUM('en_attente', 'accorde', 'refuse');--> statement-breakpoint
CREATE TYPE "public"."profil" AS ENUM('chercheur', 'prestataire', 'entreprise', 'jeune', 'mentor', 'admin');--> statement-breakpoint
CREATE TYPE "public"."statut_compte" AS ENUM('actif', 'a_valider', 'suspendu');--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"utilisateur_id" uuid NOT NULL,
	"expire_le" timestamp with time zone NOT NULL,
	"agent_utilisateur" text,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tentatives_connexion" (
	"id" serial PRIMARY KEY NOT NULL,
	"identifiant" text NOT NULL,
	"ip" text,
	"reussie" boolean NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tuteurs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"utilisateur_id" uuid NOT NULL,
	"nom" text NOT NULL,
	"telephone" text NOT NULL,
	"lien" text NOT NULL,
	"accord" "accord_parental" DEFAULT 'en_attente' NOT NULL,
	"accord_le" timestamp with time zone,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tuteurs_utilisateur_id_unique" UNIQUE("utilisateur_id")
);
--> statement-breakpoint
CREATE TABLE "utilisateurs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profil" "profil" NOT NULL,
	"statut" "statut_compte" DEFAULT 'actif' NOT NULL,
	"nom" text NOT NULL,
	"email" text,
	"telephone" text NOT NULL,
	"mot_de_passe_hash" text NOT NULL,
	"date_naissance" date,
	"details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"cgu_acceptees_le" timestamp with time zone,
	"derniere_connexion_le" timestamp with time zone,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	"mis_a_jour_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_utilisateur_id_utilisateurs_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateurs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tuteurs" ADD CONSTRAINT "tuteurs_utilisateur_id_utilisateurs_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateurs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sessions_utilisateur_idx" ON "sessions" USING btree ("utilisateur_id");--> statement-breakpoint
CREATE INDEX "tentatives_identifiant_idx" ON "tentatives_connexion" USING btree ("identifiant","cree_le");--> statement-breakpoint
CREATE INDEX "tentatives_ip_idx" ON "tentatives_connexion" USING btree ("ip","cree_le");--> statement-breakpoint
CREATE UNIQUE INDEX "utilisateurs_email_unique" ON "utilisateurs" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "utilisateurs_telephone_unique" ON "utilisateurs" USING btree ("telephone");