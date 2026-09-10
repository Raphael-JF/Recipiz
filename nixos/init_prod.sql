\c recipiz
SET ROLE recipiz;

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
