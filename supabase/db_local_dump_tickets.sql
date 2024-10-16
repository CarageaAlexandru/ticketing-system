
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."ticket_status" AS ENUM (
    'open',
    'in_progres',
    'information_missing',
    'canceled',
    'done'
);

ALTER TYPE "public"."ticket_status" OWNER TO "postgres";

COMMENT ON TYPE "public"."ticket_status" IS 'The status of a ticket';

CREATE OR REPLACE FUNCTION "public"."set_created_by_value"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  NEW.created_by = (SELECT id from service_users WHERE supabase_user = auth.uid());
  RETURN NEW;
END;$$;

ALTER FUNCTION "public"."set_created_by_value"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."set_ticket_author_name"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  NEW.author_name = (SELECT full_name FROM service_users WHERE 
    supabase_user = auth.uid());
  RETURN NEW;
END;$$;

ALTER FUNCTION "public"."set_ticket_author_name"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."service_users" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "full_name" "text",
    "supabase_user" "uuid"
);

ALTER TABLE "public"."service_users" OWNER TO "postgres";

ALTER TABLE "public"."service_users" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."service_users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."tenant_permissions" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "tenant" "text" NOT NULL,
    "service_user" bigint
);

ALTER TABLE "public"."tenant_permissions" OWNER TO "postgres";

ALTER TABLE "public"."tenant_permissions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."tenant_permissions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."tenants" (
    "id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "domain" "text" NOT NULL
);

ALTER TABLE "public"."tenants" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tickets" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "created_by" bigint NOT NULL,
    "description" "text" NOT NULL,
    "tenant" "text" NOT NULL,
    "status" "public"."ticket_status" DEFAULT 'open'::"public"."ticket_status" NOT NULL,
    "author_name" "text" NOT NULL,
    CONSTRAINT "tickets_title_check" CHECK (("length"("title") > 4))
);

ALTER TABLE "public"."tickets" OWNER TO "postgres";

COMMENT ON COLUMN "public"."tickets"."author_name" IS 'We get the author name from the trigger function';

ALTER TABLE "public"."tickets" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."tickets_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."service_users"
    ADD CONSTRAINT "service_users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tenant_permissions"
    ADD CONSTRAINT "tenant_permissions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_domain_key" UNIQUE ("domain");

ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "tr_tickets_autoset_author_name" BEFORE INSERT ON "public"."tickets" FOR EACH ROW EXECUTE FUNCTION "public"."set_ticket_author_name"();

CREATE OR REPLACE TRIGGER "tr_tickets_autoset_created_by" BEFORE INSERT ON "public"."tickets" FOR EACH ROW EXECUTE FUNCTION "public"."set_created_by_value"();

ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "public_tickets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."service_users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "public_tickets_tenant_fkey" FOREIGN KEY ("tenant") REFERENCES "public"."tenants"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."service_users"
    ADD CONSTRAINT "service_users_supabase_user_fkey" FOREIGN KEY ("supabase_user") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tenant_permissions"
    ADD CONSTRAINT "tenant_permissions_service_user_fkey" FOREIGN KEY ("service_user") REFERENCES "public"."service_users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tenant_permissions"
    ADD CONSTRAINT "tenant_permissions_tenant_fkey" FOREIGN KEY ("tenant") REFERENCES "public"."tenants"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Allow inserting tickets of allowed tenant" ON "public"."tickets" FOR INSERT TO "authenticated" WITH CHECK (COALESCE(((("auth"."jwt"() -> 'app_metadata'::"text") -> 'tenants'::"text") ? "tenant"), false));

CREATE POLICY "Allow reading tickets of allowed tenant" ON "public"."tickets" FOR SELECT TO "authenticated" USING (COALESCE(((("auth"."jwt"() -> 'app_metadata'::"text") -> 'tenants'::"text") ? "tenant"), false));

CREATE POLICY "Can read tenant if has permission" ON "public"."tenants" FOR SELECT TO "authenticated" USING (COALESCE(((("auth"."jwt"() -> 'app_metadata'::"text") -> 'tenants'::"text") ? "id"), false));

CREATE POLICY "access own user data" ON "public"."service_users" FOR SELECT TO "authenticated" USING (("supabase_user" = "auth"."uid"()));

CREATE POLICY "allow deletion of own tickets" ON "public"."tickets" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT
   FROM "public"."service_users"
  WHERE (("service_users"."id" = "tickets"."created_by") AND ("service_users"."supabase_user" = "auth"."uid"())))));

CREATE POLICY "allow reading own permissions" ON "public"."tenant_permissions" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT
   FROM "public"."service_users" "su"
  WHERE (("su"."id" = "tenant_permissions"."service_user") AND ("su"."supabase_user" = "auth"."uid"())))));

ALTER TABLE "public"."service_users" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tenant_permissions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tenants" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tickets" ENABLE ROW LEVEL SECURITY;

CREATE PUBLICATION "logflare_pub" WITH (publish = 'insert, update, delete, truncate');

ALTER PUBLICATION "logflare_pub" OWNER TO "supabase_admin";

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."tenants";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."set_created_by_value"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_created_by_value"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_created_by_value"() TO "service_role";

GRANT ALL ON FUNCTION "public"."set_ticket_author_name"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_ticket_author_name"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_ticket_author_name"() TO "service_role";

GRANT ALL ON TABLE "public"."service_users" TO "anon";
GRANT ALL ON TABLE "public"."service_users" TO "authenticated";
GRANT ALL ON TABLE "public"."service_users" TO "service_role";

GRANT ALL ON SEQUENCE "public"."service_users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."service_users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."service_users_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."tenant_permissions" TO "anon";
GRANT ALL ON TABLE "public"."tenant_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."tenant_permissions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."tenant_permissions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tenant_permissions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tenant_permissions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."tenants" TO "anon";
GRANT ALL ON TABLE "public"."tenants" TO "authenticated";
GRANT ALL ON TABLE "public"."tenants" TO "service_role";

GRANT ALL ON TABLE "public"."tickets" TO "anon";
GRANT ALL ON TABLE "public"."tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."tickets" TO "service_role";

GRANT ALL ON SEQUENCE "public"."tickets_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tickets_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tickets_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
