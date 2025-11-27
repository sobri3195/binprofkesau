CREATE TABLE "audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"aksi" text NOT NULL,
	"entitas" text NOT NULL,
	"entitas_id" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"meta" jsonb
);
--> statement-breakpoint
CREATE TABLE "fasilitas" (
	"id" text PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"jenis" text NOT NULL,
	"komando" text NOT NULL,
	"satuan" text,
	"koordinat" jsonb NOT NULL,
	"ringkasan" jsonb NOT NULL,
	"dokter_list" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifikasi" (
	"id" text PRIMARY KEY NOT NULL,
	"kategori" text NOT NULL,
	"judul" text NOT NULL,
	"isi" text NOT NULL,
	"dibaca" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pelatihan" (
	"id" text PRIMARY KEY NOT NULL,
	"personel_id" text NOT NULL,
	"jenis" text NOT NULL,
	"tanggal_mulai" timestamp,
	"tanggal_selesai" timestamp,
	"sertifikat_berlaku_hingga" timestamp,
	"status_pelaksanaan" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personel" (
	"id" text PRIMARY KEY NOT NULL,
	"nrp" text NOT NULL,
	"nama" text NOT NULL,
	"pangkat" text NOT NULL,
	"korps" text NOT NULL,
	"satuan" text NOT NULL,
	"status" text NOT NULL,
	"jabatan" text NOT NULL,
	"pekerjaan" text NOT NULL,
	"keluhan_bulanan" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "personel_nrp_unique" UNIQUE("nrp")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text NOT NULL,
	"satuan" text,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pelatihan" ADD CONSTRAINT "pelatihan_personel_id_personel_id_fk" FOREIGN KEY ("personel_id") REFERENCES "public"."personel"("id") ON DELETE cascade ON UPDATE no action;