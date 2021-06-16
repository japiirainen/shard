-- Up Migration
CREATE EXTENSION IF NOT EXISTS citext;
CREATE TYPE user_type AS ENUM ('athlete', 'coach');
CREATE TYPE privacy AS ENUM ('private', 'open');
CREATE TABLE people (
    id text PRIMARY KEY,
    username text NOT NULL UNIQUE,
    email text DEFAULT '' NOT NULL UNIQUE,
    password text NOT NULL,
    userType user_type,
    createdAt date DEFAULT now() NOT NULL,
    updatedAt date DEFAULT now() NOT NULL
);
CREATE TABLE user_profile (
    id text PRIMARY KEY,
    profileOwner text REFERENCES people,
    bio text DEFAULT '' NOT NULL,
    avatarUrl text DEFAULT '' NOT NULL
);
CREATE TABLE training_group (
    id text PRIMARY KEY,
    name text DEFAULT '' NOT NULL,
    owner text REFERENCES people,
    privacy privacy DEFAULT 'open' NOT NULL,
    createdAt date DEFAULT now() NOT NULL,
    updatedAt date DEFAULT now() NOT NULL
);
-- Down Migration
DROP TABLE IF EXISTS people;
DROP TABLE IF EXISTS user_profile;
DROP TABLE IF EXISTS training_group;