CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  github_login TEXT NOT NULL UNIQUE,
  name TEXT,
  location TEXT,
  bio TEXT,
  company TEXT
);

CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  language TEXT NOT NULL
);
