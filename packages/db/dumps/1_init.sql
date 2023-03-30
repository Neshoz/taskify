SELECT 'CREATE DATABASE taskify'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'taskify')\gexec

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SCHEMA IF NOT EXISTS account AUTHORIZATION postgres;
GRANT ALL ON SCHEMA account TO postgres;

CREATE TABLE account.session (
  sid varchar NOT NULL COLLATE "default",
  sess json NOT NULL,
  expire timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE account.session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX IDX_session_expire ON account.session (expire);

CREATE TABLE IF NOT EXISTS account.user
(
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created timestamp with time zone default current_timestamp,
  modified timestamp with time zone default current_timestamp,
  email character varying(255) NOT NULL unique,
  password character varying(255),
  CONSTRAINT user_pkey PRIMARY KEY (id)
);

CREATE TRIGGER update_user_modified BEFORE UPDATE ON account.user FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

INSERT INTO account.user (id, email, password) VALUES ('597a833e-6a22-49d6-bafc-d4c264d7f3f5', 'root@example.com', '$2b$12$4ZBhr2iGJyL8hI6DC05jkulTLQLPdfohWZMObhiyztbVuoSNebkha');