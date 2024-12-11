-- +goose Up
-- +goose StatementBegin
CREATE TABLE "users"
(
    "id"         uuid DEFAULT gen_random_uuid(),
    "created_at" timestamptz,
    "updated_at" timestamptz,
    "deleted_at" timestamptz,
    "name"       text,
    "email"      text,
    "password"   text,
    PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_users_email" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "idx_users_deleted_at" ON "users" ("deleted_at","deleted_at");

CREATE TABLE "organizations"
(
    "id"         uuid DEFAULT gen_random_uuid(),
    "created_at" timestamptz,
    "updated_at" timestamptz,
    "deleted_at" timestamptz,
    "name"       text,
    "email"      text,
    PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_organizations_email" ON "organizations" ("email");
CREATE INDEX IF NOT EXISTS "idx_organizations_deleted_at" ON "organizations" ("deleted_at","deleted_at");
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "organizations";
-- +goose StatementEnd
