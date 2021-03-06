DROP TABLE IF EXISTS pins CASCADE;
CREATE TABLE pins (
  id SERIAL PRIMARY KEY NOT NULL,
  map_id INTEGER NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  image_url VARCHAR(255),
  lat FLOAT(32) NOT NULL,
  lng FLOAT(32) NOT NULL
);
