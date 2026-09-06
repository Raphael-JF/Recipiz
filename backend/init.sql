-- Connexion à la base recipiz
\c recipiz

-- Tables
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    instructions TEXT
);

CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id SERIAL PRIMARY KEY,
    quantity NUMERIC,
    unit VARCHAR(50),
    recipe_id INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id INT NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE
);

-- Données initiales
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
