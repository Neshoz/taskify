/* CREATE TYPE permission AS ENUM ('list:r', 'list:w'); */
ALTER TABLE collection.list_user ADD COLUMN IF NOT EXISTS permissions text[] NOT NULL DEFAULT ARRAY['list:r'];

UPDATE collection.list_user SET permissions = ARRAY['list:r', 'list:w'] WHERE user_id = '597a833e-6a22-49d6-bafc-d4c264d7f3f5' AND list_id = 'b08d1ade-875c-4823-879e-a40345c626c2';
UPDATE collection.list_user SET permissions = ARRAY['list:r', 'list:w'] WHERE user_id = '391811f8-af92-481f-afd9-fb3bd86aaabc' AND list_id = '7a4d5329-e19f-4528-937a-da073d09f461';
UPDATE collection.list_user SET permissions = ARRAY['list:r'] WHERE user_id = '391811f8-af92-481f-afd9-fb3bd86aaabc' AND list_id = 'b08d1ade-875c-4823-879e-a40345c626c2';