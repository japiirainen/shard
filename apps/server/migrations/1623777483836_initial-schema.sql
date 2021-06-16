-- Up Migration
CREATE EXTENSION IF NOT EXISTS citext;
CREATE TYPE user_type AS ENUM ('athlete', 'coach');
CREATE TYPE privacy AS ENUM ('private', 'open');
CREATE TABLE people (
    id bigserial PRIMARY KEY,
    username text NOT NULL UNIQUE,
    email text DEFAULT '' NOT NULL UNIQUE,
    password text NOT NULL,
    user_type user_type,
    created_at date DEFAULT now() NOT NULL,
    updated_at date DEFAULT now() NOT NULL
);
CREATE TABLE user_profile (
    id bigserial PRIMARY KEY,
    profile_owner bigserial REFERENCES people,
    bio text DEFAULT '' NOT NULL,
    avatar_url text DEFAULT '' NOT NULL
);
CREATE TABLE training_group (
    id bigserial PRIMARY KEY,
    name text DEFAULT '' NOT NULL,
    owner bigserial REFERENCES people,
    privacy privacy DEFAULT 'open' NOT NULL,
    created_at date DEFAULT now() NOT NULL,
    updated_at date DEFAULT now() NOT NULL
);
-- Down Migration
DROP TABLE IF EXISTS people CASCADE;
DROP TABLE IF EXISTS user_profile;
DROP TABLE IF EXISTS training_group;
DROP TYPE user_type;
DROP TYPE privacy;