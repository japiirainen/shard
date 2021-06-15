-- Up Migration
CREATE EXTENSION IF NOT EXISTS citext;
CREATE TYPE user_type AS ENUM ('athlete', 'coach');
CREATE TABLE people (
    id text PRIMARY KEY,
    username text NOT NULL UNIQUE,
    email text DEFAULT '' NOT NULL UNIQUE,
    user_type user_type,
    createdAt date DEFAULT now() NOT NULL,
    updated_at date DEFAULT now() NOT NULL
);
-- Down Migration
DROP TABLE IF EXISTS user;