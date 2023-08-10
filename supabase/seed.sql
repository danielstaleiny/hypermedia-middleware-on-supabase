INSERT INTO public.items (id, created_at, name, json, "int", required_str, is_done)
VALUES
    ('a09b600d-092c-4164-a067-f0c63c2e70ca', '2023-08-10 20:01:55.373726+00', 'Name1', '{"key": "value"}', 1, 'required string value', false),
    ('a09b600d-092c-4164-a067-f0c63c2e70cb', '2023-08-10 20:02:55.373726+00', 'Name2', '{"key": "value"}', 2, 'required string ', true),
    ('a09b600d-092c-4164-a067-f0c63c2e70cc', '2023-08-10 20:03:55.373726+00', 'Name3', '{"key": "value"}', 3, 'required value', true),
    ('a09b600d-092c-4164-a067-f0c63c2e70cd', '2023-08-10 20:04:55.373726+00', 'Name4', '{"key": "value"}', 4, 'string value', false),
    ('a09b600d-092c-4164-a067-f0c63c2e70ce', '2023-08-10 20:05:55.373726+00', 'Name5', '{"key": "value"}', 5, 'required', true);
