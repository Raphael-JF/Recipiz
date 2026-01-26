-- 1️⃣ Création de l'utilisateur
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT
      FROM   pg_catalog.pg_roles
      WHERE  rolname = 'recipiz') THEN

      CREATE ROLE recipiz LOGIN PASSWORD 'recipiz';
   END IF;
END
$do$;

-- 2️⃣ Création de la base de données
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT
      FROM   pg_database
      WHERE  datname = 'recipiz') THEN

      CREATE DATABASE recipiz OWNER recipiz;
   END IF;
END
$do$;

-- 3️⃣ Connexion à la base
\c recipiz

-- 4️⃣ Création de la table recipes
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    instructions TEXT
);

-- 5️⃣ Création de la table ingredients
CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 6️⃣ Création de la table recipe_ingredients
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id SERIAL PRIMARY KEY,
    quantity NUMERIC,
    unit VARCHAR(50),
    recipe_id INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id INT NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE
);

-- 7️⃣ Donner tous les droits à l'utilisateur
GRANT ALL PRIVILEGES ON DATABASE recipiz TO recipiz;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO recipiz;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO recipiz;

-- 8️⃣ Insertion des recettes
INSERT INTO recipes (title, instructions) VALUES
('Pancakes', 'Mélanger les ingrédients et cuire à la poêle.'),
('Salade de tomates', 'Couper les tomates et ajouter de l''huile d''olive.'),
('Omelette', 'Battre les œufs et cuire à la poêle.');

-- 9️⃣ Insertion des ingrédients
INSERT INTO ingredients (name) VALUES
('Farine'), ('Lait'), ('Œufs'), ('Sucre'),
('Tomates'), ('Huile d''olive'), ('Sel'), ('Poivre'), ('Beurre');

-- 🔟 Association recette ↔ ingrédients
-- Pancakes
INSERT INTO recipe_ingredients (quantity, unit, recipe_id, ingredient_id) VALUES
(200, 'g', 1, 1), -- Farine
(300, 'ml', 1, 2), -- Lait
(2, 'pcs', 1, 3), -- Œufs
(50, 'g', 1, 4); -- Sucre

-- Salade de tomates
INSERT INTO recipe_ingredients (quantity, unit, recipe_id, ingredient_id) VALUES
(3, 'pcs', 2, 5), -- Tomates
(2, 'c.à.s', 2, 6), -- Huile d'olive
(1, 'pincée', 2, 7), -- Sel
(1, 'pincée', 2, 8); -- Poivre

-- Omelette
INSERT INTO recipe_ingredients (quantity, unit, recipe_id, ingredient_id) VALUES
(3, 'pcs', 3, 3), -- Œufs
(1, 'pincée', 3, 7), -- Sel
(1, 'pincée', 3, 8), -- Poivre
(10, 'g', 3, 9); -- Beurre
