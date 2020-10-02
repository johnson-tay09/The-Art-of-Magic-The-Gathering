DROP TABLE IF EXISTS magic_table;

CREATE TABLE magic_table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  artist VARCHAR(255),
  image_url VARCHAR(255),
  artist_store_url VARCHAR(255)
);