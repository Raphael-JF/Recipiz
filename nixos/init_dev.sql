-- Connexion à la base recipiz
\c recipiz
ALTER DATABASE recipiz OWNER TO recipiz;

-- Tables deletion
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS recipe_ingredients CASCADE;

-- Tables creation
\ir init_prod.sql

-- Data test set - Expanded recipes
INSERT INTO recipes (title, instructions) VALUES
-- Breakfast
('Pancakes', 'Mélanger 200g de farine, 300ml de lait, 2 œufs et 50g de sucre. Cuire à la poêle avec du beurre.'),
('French Toast', 'Tremper des tranches de pain dans un mélange d’œufs battus, lait et cannelle. Faire griller à la poêle.'),
('Scrambled Eggs', 'Battre les œufs avec du sel et du poivre, cuire à feu doux en remuant constamment.'),
('Avocado Toast', 'Écraser une demi-avocat sur du pain grillé. Assaisonner avec du sel, du poivre et un filet d’huile d’olive.'),
-- Lunch
('Salade de tomates', 'Couper les tomates en dés et ajouter 2 cuillères à soupe d’huile d’olive, sel et poivre. Option : ajouter des oignons rouges.'),
('Pâtes Carbonara', 'Faire revenir du lardons dans une poêle, ajouter des pâtes cuites, puis un mélange d’œufs et de parmesan.'),
('Quiche Lorraine', 'Étaler une pâte brisée, garnir de lardons, d’oignons et d’une crème fraîche mélangée à des œufs. Cuire 30 min à 180°C.'),
-- Dinner
('Omelette', 'Battre les œufs avec du sel et du poivre, cuire à la poêle avec un peu de beurre jusqu’à ce qu’ils soient fermes.'),
('Grilled Chicken', 'Mariner des morceaux de poulet dans de l’huile d’olive, du citron et des herbes. Griller 15-20 min.'),
('Beef Stew', 'Faire revenir des morceaux de bœuf avec des oignons et des carottes. Ajouter un bouillon, laisser mijoter 2h.'),
-- Desserts
('Chocolate Cake', 'Mélanger farine, sucre, cacao et œufs. Cuire au four 30 min à 180°C.'),
('Crème Brûlée', 'Faire cuire une crème vanille jusqu’à épaississement, puis caraméliser le sucre sur le dessus.'),
('Apple Pie', 'Étaler une pâte, garnir de pommes émincées et de cannelle. Recouvrir d’une autre couche de pâte et cuire 40 min à 190°C.'),
-- Snacks
('Hummus', 'Mixer pois chiches, tahini, huile d’olive, ail et citron jusqu’à obtenir une texture lisse.'),
('Chips and Guacamole', 'Couper des avocats en deux, écraser la chair avec du citron, de l’oignon rouge et de la coriandre. Servir avec des chips.'),
-- Drinks
('Lemonade', 'Presser des citrons pour obtenir le jus, mélanger avec de l’eau et du sucre. Servir frais.'),
('Smoothie', 'Mixer bananes, fraises et lait jusqu’à obtenir une texture homogène.');

INSERT INTO ingredients (name) VALUES
-- Base ingredients
('Farine'), ('Lait'), ('Œufs'), ('Sucre'), ('Sel'), ('Poivre'), ('Beurre'),
('Huile d''olive'), ('Cannelle'), ('Citron'), ('Ail'), ('Oignon rouge'),
-- Produce
('Tomates'), ('Avocat'), ('Pommes'), ('Banane'), ('Fraise'), ('Carotte'), ('Oignon'), ('Lardons'), ('Poulet'), ('Bœuf'), ('Pâtes'), ('Pain'),
-- Dairy and others
('Crème fraîche'), ('Parmesan'), ('Tahini'), ('Pois chiches'), ('Cacao'), ('Vanille'), ('Chips'), ('Corianadre');

INSERT INTO recipe_ingredients
    (quantity, unit, recipe_id, ingredient_id)
VALUES
-- Pancakes
(200, 'g', 1, 1), (300, 'ml', 1, 2), (2, 'pcs', 1, 3), (50, 'g', 1, 4),
-- French Toast
(8, 'tr', 2, 16), (2, 'pcs', 2, 3), (300, 'ml', 2, 2), (1, 'c.à.c', 2, 11),
-- Scrambled Eggs
(4, 'pcs', 3, 3), (1, 'pincée', 3, 7), (1, 'pincée', 3, 8),
-- Avocado Toast
(2, 'tr', 4, 16), (1/2, 'pcs', 4, 5), (1, 'c.à.s', 4, 6), (1, 'pincée', 4, 7), (1, 'pincée', 4, 8),
-- Salade de tomates
(3, 'pcs', 5, 5), (2, 'c.à.s', 5, 6), (1, 'pincée', 5, 7), (1, 'pincée', 5, 8),
-- Pâtes Carbonara
(200, 'g', 6, 19), (100, 'g', 6, 23), (4, 'pcs', 6, 3), (50, 'g', 6, 24),
-- Quiche Lorraine
(1, 'pâte', 7, 25), (100, 'g', 7, 23), (50, 'g', 7, 26), (200, 'ml', 7, 27),
-- Omelette
(4, 'pcs', 8, 3), (1, 'pincée', 8, 7), (1, 'pincée', 8, 8),
-- Grilled Chicken
(500, 'g', 9, 28), (2, 'c.à.s', 9, 6), (1/2, 'pcs', 9, 10), (1, 'c.à.c', 9, 13),
-- Beef Stew
(500, 'g', 10, 29), (1, 'pcs', 10, 14), (2, 'pcs', 10, 15), (750, 'ml', 10, 30),
-- Chocolate Cake
(200, 'g', 11, 1), (200, 'g', 11, 4), (50, 'g', 11, 22), (3, 'pcs', 11, 3), (1, 'c.à.s', 11, 6),
-- Crème Brûlée
(500, 'ml', 12, 2), (1, 'gousse', 12, 31), (1, 'c.à.c', 12, 32),
-- Apple Pie
(2, 'pommes', 13, 17), (1, 'c.à.c', 13, 11), (2, 'pâtes', 13, 25),
-- Hummus
(400, 'g', 14, 15), (80, 'g', 14, 25), (2, 'c.à.s', 14, 6), (1, 'gousse', 14, 12),
-- Chips and Guacamole
(1, 'pcs', 15, 5), (1/2, 'oignon rouge', 15, 9), (1, 'c.à.c', 15, 25),
-- Lemonade
(4, '', 16, 10), (500, 'ml', 16, 23), (200, 'g', 16, 4),
-- Smoothie
(2, 'doigts', 17, 18), (100, 'g', 17, 19), (500, 'ml', 17, 2);
