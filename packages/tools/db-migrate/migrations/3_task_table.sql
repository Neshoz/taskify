CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.modified = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE IF NOT EXISTS collection.task
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    list_id uuid NOT NULL,
    created timestamp with time zone default current_timestamp,
    modified timestamp with time zone default current_timestamp,
    due_date timestamp with time zone DEFAULT NULL,
    name character varying(255) NOT NULL unique,
    description character varying(255) NOT NULL,
    status boolean NOT NULL default false,
    CONSTRAINT task_pkey PRIMARY KEY (id),
    CONSTRAINT list_fkey FOREIGN KEY(list_id) REFERENCES collection.list(id) ON DELETE CASCADE
);
GRANT ALL ON SCHEMA collection TO postgres;

CREATE TRIGGER update_task_modified BEFORE UPDATE ON collection.task FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

INSERT INTO collection.task (id, list_id, name, description) VALUES ('e27c7db6-7a4c-416f-a835-7f585dc8d56f', 'b08d1ade-875c-4823-879e-a40345c626c2', 'Nesho test task', 'This is a test task');
INSERT INTO collection.task (id, list_id, name, description) VALUES ('430d5220-3c28-45b4-a7be-7b8e2dad0370', '7a4d5329-e19f-4528-937a-da073d09f461', 'Simplex test task', 'This is a test task');
