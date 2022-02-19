DROP TABLE IF EXISTS maps CASCADE;
CREATE TABLE maps (
  id SERIAL PRIMARY KEY NOT NULL,
  creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date_created DATE NOT NULL DEFAULT Now(),
  name varchar(255) NOT NULL DEFAULT 'Untitled Map',
  description TEXT
);
