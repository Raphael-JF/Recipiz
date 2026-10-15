CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS recipes (
    recipe_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    tag_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS recipe_instructions (
    step INT NOT NULL,
    text TEXT NOT NULL,
    recipe_id INT NOT NULL REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, step)
);

CREATE TABLE IF NOT EXISTS recipe_tags (
    recipe_id INT NOT NULL REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    tag_id INT NOT NULL REFERENCES tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, tag_id)
);

CREATE TABLE IF NOT EXISTS ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ingredient_tags (
    ingredient_id INT NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    tag_id INT NOT NULL REFERENCES tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (ingredient_id, tag_id)
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    quantity NUMERIC,
    unit VARCHAR(50),
    recipe_id INT NOT NULL REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    ingredient_id INT NOT NULL REFERENCES ingredients(ingredient_id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, ingredient_id)
);

-- To make the search more efficient, we can create GIN indexes on the title and name columns using the pg_trgm extension.
CREATE INDEX IF NOT EXISTS recipes_title_trgm_idx
ON recipes
USING GIN (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS ingredients_name_trgm_idx
ON ingredients
USING GIN (name gin_trgm_ops);
