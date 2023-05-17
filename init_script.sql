DO
$do$
BEGIN
   IF EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'app_user') THEN

      RAISE NOTICE 'Role "app_user" already exists. Skipping.';
   ELSE
      CREATE ROLE app_user LOGIN PASSWORD 'my_password';
   END IF;
END
$do$;

DO
$do$
BEGIN
   IF EXISTS (SELECT FROM pg_database WHERE datname = 'rick_morty_data') THEN
      RAISE NOTICE 'Database already exists';  -- optional
   ELSE
      PERFORM dblink_exec('dbname=' || current_database()  -- current db
                        , 'CREATE DATABASE rick_morty_data');
   END IF;
END
$do$;

\c rick_morty_data;

DROP TABLE IF EXISTS characters;
CREATE TABLE IF NOT EXISTS characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    status VARCHAR(15) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

INSERT INTO characters (name, last_name, status, created_at, updated_at)
VALUES ('Rick', 'Sanchez', 'Alive', current_timestamp, current_timestamp);

GRANT ALL PRIVILEGES ON TABLE characters TO app_user;
GRANT ALL PRIVILEGES ON SEQUENCE characters_id_seq TO app_user;