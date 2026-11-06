#!/bin/bash
# Runs once, from /docker-entrypoint-initdb.d, after Postgres creates the database.
# The API has not started yet, so this creates "user_entity" and inserts the admin.
set -euo pipefail

: "${ADMIN_EMAIL:?ADMIN_EMAIL is required}"
: "${ADMIN_NAME:?ADMIN_NAME is required}"
: "${ADMIN_PASSWORD:?ADMIN_PASSWORD is required}"
: "${POSTGRES_USER:?POSTGRES_USER is required}"
: "${POSTGRES_DB:?POSTGRES_DB is required}"

if [ -z "$ADMIN_PASSWORD" ] || [ "${#ADMIN_PASSWORD}" -gt 4096 ]; then
  echo "ADMIN_PASSWORD must be a non-empty string of at most 4096 bytes" >&2
  exit 1
fi

# PasswordHasher normalizes with NFKC. ASCII is unchanged, so the openssl scrypt
# output matches sign-in. Other characters can verify as a different password.
LC_ALL=C
if [[ "$ADMIN_PASSWORD" =~ [^[:print:]] ]]; then
  echo "ADMIN_PASSWORD must be ASCII so the hash matches sign-in" >&2
  exit 1
fi

salt_file=$(mktemp)
trap 'rm -f "$salt_file"' EXIT
openssl rand -out "$salt_file" 16
salt_hex=$(od -An -tx1 "$salt_file" | tr -d ' \n')
pass_hex=$(printf '%s' "$ADMIN_PASSWORD" | od -An -tx1 | tr -d ' \n')
salt_b64=$(openssl base64 -A -in "$salt_file" | tr -d '=')
key_b64=$(
  openssl kdf -binary -keylen 32 \
    -kdfopt "hexpass:${pass_hex}" \
    -kdfopt "hexsalt:${salt_hex}" \
    -kdfopt n:131072 \
    -kdfopt r:8 \
    -kdfopt p:1 \
    SCRYPT | openssl base64 -A | tr -d '='
)
password_hash="\$scrypt\$ln=17,r=8,p=1\$${salt_b64}\$${key_b64}"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -v email="$ADMIN_EMAIL" \
  -v name="$ADMIN_NAME" \
  -v password_hash="$password_hash" <<'SQL'
BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
  CREATE TYPE "user_entity_roles_enum" AS ENUM ('USER', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

CREATE TABLE IF NOT EXISTS "user_entity" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "createdAt" TIMESTAMP WITH TIME ZONE,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "deletedAt" TIMESTAMP WITH TIME ZONE,
  "isActive" boolean NOT NULL DEFAULT true,
  "email" character varying NOT NULL,
  "hashedPassword" character varying,
  "name" character varying NOT NULL,
  "roles" "user_entity_roles_enum"[] NOT NULL DEFAULT '{USER}',
  CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"),
  CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email")
);

COMMENT ON COLUMN "user_entity"."roles" IS 'enum:{USER, ADMIN}';

INSERT INTO "user_entity" (
  "id",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "isActive",
  "email",
  "name",
  "hashedPassword",
  "roles"
)
SELECT
  uuid_generate_v4(),
  now(),
  now(),
  NULL,
  true,
  :'email',
  :'name',
  :'password_hash',
  ARRAY['ADMIN']::"user_entity_roles_enum"[]
WHERE NOT EXISTS (
  SELECT 1 FROM "user_entity" WHERE "email" = :'email'
);

COMMIT;
SQL

echo "Ensured admin user ${ADMIN_EMAIL}"
