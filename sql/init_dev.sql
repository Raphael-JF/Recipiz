-- Tables deletion
DROP TABLE IF EXISTS ingredient_tags     CASCADE; 
DROP TABLE IF EXISTS ingredients         CASCADE; 
DROP TABLE IF EXISTS recipe_ingredients  CASCADE; 
DROP TABLE IF EXISTS recipe_instructions CASCADE; 
DROP TABLE IF EXISTS recipe_tags         CASCADE; 
DROP TABLE IF EXISTS recipes             CASCADE; 
DROP TABLE IF EXISTS users               CASCADE;
DROP TABLE IF EXISTS tags                CASCADE; 
\ir create_tables.sql
