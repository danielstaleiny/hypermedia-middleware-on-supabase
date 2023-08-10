create table "public"."items" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default now(),
    "name" text,
    "json" jsonb,
    "int" integer,
    "required_str" text not null,
    "is_done" boolean default false
);
alter table "public"."items" enable row level security;
CREATE UNIQUE INDEX items_pkey ON public.items USING btree (id);
alter table "public"."items" add constraint "items_pkey" PRIMARY KEY using index "items_pkey";
