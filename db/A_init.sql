-- -- Get rid of the db if it exists
DROP DATABASE IF EXISTS jamsel;
-- -- Create the db
CREATE DATABASE jamsel;
-- Connect to the db
\c jamsel
-- Create users table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  google_id text UNIQUE,
  facebook_id text UNIQUE,
  display_name text,
  first_name text,
  email text UNIQUE
);