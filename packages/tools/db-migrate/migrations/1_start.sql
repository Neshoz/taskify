CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SCHEMA IF NOT EXISTS account AUTHORIZATION postgres;
GRANT ALL ON SCHEMA account TO postgres;

CREATE SCHEMA IF NOT EXISTS collection AUTHORIZATION postgres;
GRANT ALL ON SCHEMA collection TO postgres;

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
  password character varying(255) NOT NULL,
  full_name character varying(255) NOT NULL,
  CONSTRAINT user_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS collection.list
(
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created timestamp with time zone default current_timestamp,
  modified timestamp with time zone default current_timestamp,
  name character varying(255) NOT NULL unique,
  CONSTRAINT list_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS collection.list_user
(
  list_id uuid NOT NULL,
  user_id uuid NOT NULL,
  CONSTRAINT list_user_pkey PRIMARY KEY (list_id, user_id),
  CONSTRAINT list_fkey FOREIGN KEY(list_id) REFERENCES collection.list(id) ON DELETE CASCADE,
  CONSTRAINT user_fkey FOREIGN KEY(user_id) REFERENCES account.user(id) ON DELETE CASCADE
);

CREATE TRIGGER update_user_modified BEFORE UPDATE ON account.user FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_list_modified BEFORE UPDATE ON collection.list FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

INSERT INTO account.user (id, email, full_name, password) VALUES ('597a833e-6a22-49d6-bafc-d4c264d7f3f5', 'nesho@taskify.io', 'Nesho', '$2b$12$4ZBhr2iGJyL8hI6DC05jkulTLQLPdfohWZMObhiyztbVuoSNebkha');
INSERT INTO account.user (id, email, full_name, password) VALUES ('391811f8-af92-481f-afd9-fb3bd86aaabc', 'simplex@taskify.io', 'Simplex', '$2b$12$4ZBhr2iGJyL8hI6DC05jkulTLQLPdfohWZMObhiyztbVuoSNebkha');

INSERT INTO collection.list (id, name) VALUES ('b08d1ade-875c-4823-879e-a40345c626c2', 'Nesho test list');
INSERT INTO collection.list (id, name) VALUES ('7a4d5329-e19f-4528-937a-da073d09f461', 'Simplex test list');

INSERT INTO collection.list_user(list_id, user_id) VALUES ('b08d1ade-875c-4823-879e-a40345c626c2', '597a833e-6a22-49d6-bafc-d4c264d7f3f5');
INSERT INTO collection.list_user(list_id, user_id) VALUES ('7a4d5329-e19f-4528-937a-da073d09f461', '391811f8-af92-481f-afd9-fb3bd86aaabc');
INSERT INTO collection.list_user(list_id, user_id) VALUES ('b08d1ade-875c-4823-879e-a40345c626c2', '391811f8-af92-481f-afd9-fb3bd86aaabc');