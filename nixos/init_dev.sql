-- Connexion à la base recipiz
\c recipiz
ALTER DATABASE recipiz OWNER TO recipiz;

-- Tables deletion
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS recipe_ingredients CASCADE;

-- Tables creation
\ir init_prod.sql

-- data test set
INSERT INTO recipes (title, instructions) VALUES
('Pancakes', 'Mélanger les ingrédients et cuire à la poêle.'),
('Salade de tomates', 'Couper les tomates et ajouter de l''huile d''olive.'),
('Omelette', 'Battre les œufs et cuire à la poêle.');

INSERT INTO ingredients (name) VALUES
('Farine'), ('Lait'), ('Œufs'), ('Sucre'),
('Tomates'), ('Huile d''olive'), ('Sel'), ('Poivre'), ('Beurre');

INSERT INTO recipe_ingredients
    (quantity, unit, recipe_id, ingredient_id)
VALUES
    (200, 'g', 1, 1),
    (300, 'ml', 1, 2),
    (2, 'pcs', 1, 3),
    (50, 'g', 1, 4),
    (3, 'pcs', 2, 5),
    (2, 'c.à.s', 2, 6),
    (1, 'pincée', 2, 7),
    (1, 'pincée', 2, 8),
    (3, 'pcs', 3, 3),
    (1, 'pincée', 3, 7),
    (1, 'pincée', 3, 8),
    (10, 'g', 3, 9);
