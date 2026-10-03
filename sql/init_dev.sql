-- Tables deletion
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS recipe_ingredients CASCADE;

\ir create_tables.sql
\ir insert_data.sql
