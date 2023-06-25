CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.modified = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SCHEMA IF NOT EXISTS webhook AUTHORIZATION postgres;

CREATE TABLE IF NOT EXISTS webhook.webhook (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  created timestamp with time zone default current_timestamp,
  modified timestamp with time zone default current_timestamp,
  url text,
  event_type text,
  CONSTRAINT webhook_pkey PRIMARY KEY (id),
  CONSTRAINT user_fkey FOREIGN KEY (user_id) REFERENCES account.user(id),
  CONSTRAINT event_type_user UNIQUE (user_id, event_type)
);
GRANT ALL ON SCHEMA webhook TO postgres;

CREATE TRIGGER update_webhook_modified BEFORE UPDATE ON webhook.webhook FOR EACH ROW EXECUTE PROCEDURE update_modified_column();