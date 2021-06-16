-- Up Migration
CREATE EXTENSION IF NOT EXISTS citext;
CREATE TYPE user_type AS ENUM ('athlete', 'coach');
CREATE TYPE privacy AS ENUM ('private', 'open');
CREATE TABLE people (
    id text PRIMARY KEY,
    username text NOT NULL UNIQUE,
    email text DEFAULT '' NOT NULL UNIQUE,
    user_type user_type,
    createdAt date DEFAULT now() NOT NULL,
    updated_at date DEFAULT now() NOT NULL
);
CREATE TABLE user_profile (
    id text PRIMARY KEY,
    profile_owner text REFERENCES people,
    bio text DEFAULT '' NOT NULL,
    avatar_url text DEFAULT '' NOT NULL
);
CREATE TABLE training_group (
    id text PRIMARY KEY,
    name text DEFAULT '' NOT NULL,
    owner text REFERENCES people,
    privacy privacy DEFAULT 'open' NOT NULL,
    createdAt date DEFAULT now() NOT NULL,
    updated_at date DEFAULT now() NOT NULL
);
-- Down Migration
DROP TABLE IF EXISTS people;
DROP TABLE IF EXISTS user_profile;
DROP TABLE IF EXISTS training_group;