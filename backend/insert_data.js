import { pool } from './db/pool.js'
import * as creation from './db/creation.js'
import argon2 from 'argon2'

const client = await pool.connect()

try {
  await client.query('BEGIN')

 
creation.registerUser(client, 'raph', await argon2.hash("_-gP%DA~D&8!j*H")) // just for dev

// ================= inserting =========================
creation.insertCompleteRecipe(client, {
    title: 'Spaghetti Carbonara', 
    description: "Un classique italien à base de pâtes, lardons et sauce à l'œuf.",
    ingredients: [
      { name: 'spaghetti', quantity: 400, unit: 'g' },
      { name: 'bacon', quantity: 200, unit: 'g' },
      { name: 'eggs', quantity: 3, unit: 'œufs' },
      { name: 'parmesan', quantity: 100, unit: 'g' },
      { name: 'black pepper', quantity: 1, unit: 'pincée' }
    ],
    instructions: [
    "Faire bouillir de l'eau salée dans une grande casserole.",
    "Ajouter les spaghetti et cuire selon le temps indiqué sur le paquet (environ 8-10 minutes).",
    "Pendant ce temps, couper le bacon en dés et le faire revenir dans une poêle sans ajout de matière grasse.",
    "Battre les œufs avec le parmesan râpé et du poivre.",
    "Égoutter les spaghetti en réservant un peu d'eau de cuisson.",
    "Ajouter les spaghetti égouttés dans la poêle avec le bacon.",
    "Hors du feu, verser lentement l'appareil à œufs tout en remuant rapidement pour créer une sauce onctueuse.",
    "Si nécessaire, ajouter un peu d'eau de cuisson des spaghetti pour ajuster la texture."
    ],
    tags: []
  })

creation.insertCompleteRecipe(client, {
    title: 'Chocolate Cake', 
    description: "Un gâteau moelleux au cacao, parfait pour les amateurs de chocolat.",
    ingredients: [
      { name: 'flour', quantity: 200, unit: 'g' },
      { name: 'sugar', quantity: 200, unit: 'g' },
      { name: 'cocoa powder', quantity: 50, unit: 'g' },
      { name: 'eggs', quantity: 3, unit: 'œufs' },
      { name: 'milk', quantity: 250, unit: 'ml' },
      { name: 'oil', quantity: 100, unit: 'ml' },
      { name: 'baking powder', quantity: 1, unit: 'cuillère à café' }
    ],
    instructions: [
    "Préchauffer le four à 180°C.",
    "Dans un saladier, mélanger la farine, le sucre, le cacao et la levure.",
    "Ajouter les œufs, le lait et l'huile. Bien mélanger jusqu'à obtenir une pâte homogène.",
    "Verser la pâte dans un moule à cake beurré et fariné.",
    "Enfourner pour 30-35 minutes ou jusqu'à ce qu'un couteau inséré au centre ressorte propre."
    ],
    tags: []
  })

creation.insertCompleteRecipe(client, {
    title: 'Avocado Toast', 
    description: "Un petit-déjeuner sain et gourmand à base d'avocat et de pain grillé.",
    ingredients: [
      { name: 'bread', quantity: 2, unit: 'tranches' },
      { name: 'avocado', quantity: 1, unit: 'fruit' },
      { name: 'salt', quantity: 1, unit: 'pincée' },
      { name: 'pepper', quantity: 1, unit: 'tour de moulin' },
      { name: 'olive oil', quantity: 1, unit: 'cuillère à soupe' }
    ],
    instructions: [
    "Griller le pain jusqu'à ce qu'il soit doré et croustillant.",
    "Écraser l'avocat en purée avec une fourchette dans un bol.",
    "Assaisonner la purée d'avocat avec du sel, du poivre et de l'huile d'olive.",
    "Étaler généreusement la purée d'avocat sur les tranches de pain grillé."
    ],
    tags: []
  })

creation.insertCompleteRecipe(client, {
    title: 'Margherita Pizza', 
    description: "Une pizza italienne traditionnelle avec sauce tomate, mozzarella et basilic.",
    ingredients: [
      { name: 'pizza dough', quantity: 1, unit: 'pâte' },
      { name: 'tomato sauce', quantity: 200, unit: 'g' },
      { name: 'mozzarella', quantity: 150, unit: 'g' },
      { name: 'basil leaves', quantity: 4, unit: 'feuilles' }
    ],
    instructions: [
    "Préchauffer le four à 250°C.",
    "Étaler la pâte sur une plaque recouverte de papier sulfurisé.",
    "Étaler la sauce tomate uniformément sur la pâte.",
    "Ajouter les morceaux de mozzarella en les répartissant bien.",
    "Enfourner pour 10-12 minutes ou jusqu'à ce que la croûte soit dorée et le fromage fondu.",
    "Retirer du four, ajouter les feuilles de basilic frais avant de servir."
    ],
    tags: []
  })

creation.insertCompleteRecipe(client, {
    title: 'Greek Salad', 
    description: "Une salade fraîche et colorée avec tomates, concombres, oignon rouge et feta.",
    ingredients: [
      { name: 'cucumber', quantity: 1, unit: 'concombre' },
      { name: 'tomato', quantity: 2, unit: 'tomates' },
      { name: 'red onion', quantity: 1, unit: 'oignon rouge' },
      { name: 'feta cheese', quantity: 150, unit: 'g' },
      { name: 'olives', quantity: 100, unit: 'g' },
      { name: 'olive oil', quantity: 3, unit: 'cuillères à soupe' }
    ],
    instructions: [
    "Couper le concombre et les tomates en tranches.",
    "Émincer finement l'oignon rouge.",
    "Disposer tous les ingrédients dans un grand saladier.",
    "Arroser d'huile d'olive avant de servir."
    ],
    tags: []
  })

creation.insertCompleteRecipe(client, {
    title: 'Baba au rhum', 
    description: "Un dessert traditionnel alsacien imbibé de rhum.",
    ingredients: [
      { name: 'farine', quantity: 50, unit: 'g' },
      { name: 'rhum', quantity: 1.5, unit: 'L'},
      { name: 'éponges', quantity: 2, unit:'pièce'}
    ],
    instructions: [
    "Mélanger 1L de rhum avec 50g de farine.",
    "Boire 30cL de rhum.",
    "Utiliser une éponge pour nettoyer ce qui a dégouliné.",
    "Verser le reste de farine sur la tâche pour absorber le reste de rhum.",
    "Mettre la pâte au fond du four, sur une grille (four éteint).",
    "Laisser reposer une demi-heure.",
    "Pendant ce temps, boire 1/2 L de rhum.",
    "Appeler un ami pour vous aider à boire.",
    "Ouvrir une bouteille supplémentaire, pour partager.",
    "La demi-heure passée, réveiller votre ami avec la deuxième éponge, en la mouillant auparavant.",
    "Mettre en route le four, à 220°C.",
    "Asperger la pâte avec les 20cL de rhum restant.",
    "Sortir du four votre ami qui a voulu boire les dernières gouttes de rhum présentes sur la pâte",
    "Refermer le four.",
    "Mettre un minuteur, avec l'alarme à fond, sur 20 minutes.",
    "Quand le minuteur sonne, sortir la pâte en la laissant sur la grille.",
    "Emmener votre ami aux urgences, il a touché la grille sans main à feu.",
    "De retour, mettre la pâte à la poubelle, elle est immangeable.",
    "Boire encore un coup pour oublier.",
    "S'endormir pour récupérer, jusqu'au lendemain au moins."
    ],
    tags: []
  })

creation.insertCompleteRecipe(client, {
    title: 'Beef Bourguignon', 
    description: "Un ragoût français riche en viande de bœuf mijotée dans du vin rouge.",
    ingredients: [
      { name: 'beef chuck', quantity: 1.5, unit: 'kg' },
      { name: 'red wine', quantity: 750, unit: 'ml' },
      { name: 'onions', quantity: 3, unit: 'oignons' },
      { name: 'carrots', quantity: 4, unit: 'carottes' },
      { name: 'garlic', quantity: 2, unit: 'gousses' },
      { name: 'mushrooms', quantity: 300, unit: 'g' }
    ],
    instructions: [
    "Couper la viande en gros cubes et la faire revenir dans une cocotte.",
    "Retirer la viande et réserver. Dans la même cocotte, faire revenir les oignons, les carottes coupées en rondelles et l'ail émincé.",
    "Ajouter les champignons et laisser cuire quelques minutes.",
    "Déglacer avec le vin rouge et ajouter un bouillon de bœuf.",
    "Remettre la viande dans la cocotte, couvrir et laisser mijoter à feu doux pendant 2-3 heures."
    ],
    tags: []
  })

creation.insertCompleteRecipe(client, {
    title: 'Tiramisu', 
    description: "Un dessert italien à base de mascarpone et de café expresso.",
    ingredients: [
      { name: 'ladyfingers', quantity: 200, unit: 'g' },
      { name: 'mascarpone cheese', quantity: 500, unit: 'g' },
      { name: 'eggs', quantity: 3, unit: 'œufs' },
      { name: 'sugar', quantity: 80, unit: 'g' },
      { name: 'espresso coffee', quantity: 150, unit: 'ml' }
    ],
    instructions: [
    "Séparer les blancs des jaunes d'œufs.",
    "Monter les blancs en neige ferme et réserver.",
    "Fouetter les jaunes avec le sucre jusqu'à blanchiment, puis ajouter la mascarpone.",
    "Incorporer délicatement les blancs montés à la préparation.",
    "Tremper rapidement les boudoirs dans l'expresso et les disposer au fond d'un plat.",
    "Étaler une couche de crème, répéter l'opération et finir par une couche de crème.",
    "Laisser reposer au réfrigérateur pendant au moins 4 heures avant de servir."
    ],
    tags: []
  })

creation.insertCompleteRecipe(client, {
    title: 'Ratatouille', 
    description: "Un plat provençal à base de légumes mijotés dans une sauce tomate.",
    ingredients: [
      { name: 'eggplant', quantity: 1, unit: 'courgette' },
      { name: 'zucchini', quantity: 2, unit: 'concombres' },
      { name: 'tomatoes', quantity: 4, unit: 'tomates' },
      { name: 'bell peppers', quantity: 1, unit: 'poivron' },
      { name: 'onion', quantity: 1, unit: 'oignon' },
      { name: 'garlic', quantity: 2, unit: 'gousses' }
    ],
    instructions: [
    "Couper tous les légumes en dés.",
    "Faire revenir l'oignon et l'ail dans une cocotte.",
    "Ajouter les courgettes et les aubergines, laisser cuire quelques minutes.",
    "Incorporer les poivrons et les tomates coupées en dés.",
    "Laisser mijoter à feu doux pendant 30-40 minutes sans couvrir."
    ],
    tags: []
  })

creation.insertCompleteRecipe(client, {
    title: 'Croque Monsieur', 
    description: "Un sandwich grillé au jambon et fromage, typique de la cuisine française.",
    ingredients: [
      { name: 'bread slices', quantity: 2, unit: 'tranches' },
      { name: 'ham', quantity: 4, unit: 'tranches' },
      { name: 'cheese', quantity: 100, unit: 'g' },
      { name: 'butter', quantity: 2, unit: 'cuillères à soupe' }
    ],
    instructions: [
    "Beurrer généreusement une face des tranches de pain.",
    "Disposer les tranches de jambon et le fromage entre deux tranches de pain.",
    "Faire griller au four ou à la poêle jusqu'à ce que le fromage fonde et que le pain soit bien doré."
    ],
    tags: []
  })

creation.insertCompleteRecipe(client, {
    title: 'Paella', 
    description: "Un plat espagnol à base de riz, fruits de mer et safran.",
    ingredients: [
      { name: 'rice', quantity: 300, unit: 'g' },
      { name: 'chicken', quantity: 400, unit: 'g' },
      { name: 'seafood mix', quantity: 500, unit: 'g' },
      { name: 'saffron', quantity: 1, unit: 'pincée' },
      { name: 'broth', quantity: 750, unit: 'ml' }
    ],
    instructions: [
    "Faire revenir le poulet coupé en morceaux dans une paella.",
    "Ajouter les fruits de mer et faire revenir quelques minutes.",
    "Incorporer le riz, le safran dissous dans un peu d'eau chaude et le bouillon.",
    "Laisser cuire à feu moyen sans remuer pendant 15-20 minutes."
    ],
    tags: []
  })

creation.insertCompleteRecipe(client, {
    title: 'Quiche Lorraine', 
    description: "Une tarte salée française à base de lardons et crème.",
    ingredients: [
      { name: 'pâte brisée', quantity: 1, unit: 'pâte' },
      { name: 'cream', quantity: 250, unit: 'ml' },
      { name: 'eggs', quantity: 3, unit: 'œufs' },
      { name: 'bacon', quantity: 150, unit: 'g' },
      { name: 'gruyère cheese', quantity: 100, unit: 'g' }
    ],
    instructions: [
    "Étaler la pâte dans un moule à tarte et piquer le fond avec une fourchette.",
    "Faire revenir le lardons dans une poêle et les disposer sur la pâte.",
    "Battre la crème avec les œufs, ajouter le fromage râpé et verser sur les lardons.",
    "Enfourner à 180°C pendant 30-35 minutes ou jusqu'à ce que la garniture soit bien dorée."
    ],
    tags: []
  })

creation.insertCompleteRecipe(client, {
    title: 'Moussaka', 
    description: "Un plat grec à base d'aubergines, viande hachée et sauce béchamel.",
    ingredients: [
      { name: 'eggplant', quantity: 2, unit: 'courgettes' },
      { name: 'ground beef', quantity: 500, unit: 'g' },
      { name: 'tomato sauce', quantity: 300, unit: 'ml' },
      { name: 'potatoes', quantity: 2, unit: 'pommes de terre' },
      { name: 'béchamel sauce', quantity: 250, unit: 'ml' }
    ],
    instructions: [
    "Couper les aubergines et les pommes de terre en rondelles.",
    "Faire revenir la viande hachée avec la sauce tomate.",
    "Disposer les couches d'aubergine, de viande et de pomme de terre dans un plat à gratin.",
    "Recouvrir le tout de sauce béchamel et enfourner à 200°C pendant 45 minutes."
    ],
    tags: []
  })

creation.insertCompleteRecipe(client, {
    title: 'Tajine', 
    description: "Un plat marocain mijoté à base d'agneau et fruits secs.",
    ingredients: [
      { name: 'lamb', quantity: 800, unit: 'g' },
      { name: 'onions', quantity: 2, unit: 'oignons' },
      { name: 'apricots', quantity: 150, unit: 'g' },
      { name: 'preserved lemon', quantity: 1, unit: 'citron confit' },
      { name: 'couscous', quantity: 300, unit: 'g' }
    ],
    instructions: [
    "Faire revenir les oignons émincés dans un tajine.",
    "Ajouter la viande coupée en morceaux et laisser dorer.",
    "Incorporer les abricots dénoyautés, le citron confit coupé en morceaux et un peu de bouillon.",
    "Couvrir et laisser mijoter à feu doux pendant 1h30.",
    "Servir avec du couscous bien moelleux."
    ],
    tags: []
  })

creation.insertCompleteRecipe(client, {
    title: 'Risotto', 
    description: "Un plat italien à base de riz crémeux et bouillon.",
    ingredients: [
      { name: 'arborio rice', quantity: 300, unit: 'g' },
      { name: 'onion', quantity: 1, unit: 'oignon' },
      { name: 'white wine', quantity: 150, unit: 'ml' },
      { name: 'parmesan cheese', quantity: 50, unit: 'g' },
      { name: 'chicken broth', quantity: 750, unit: 'ml' }
    ],
    instructions: [
    "Faire revenir l'oignon émincé dans une casserole.",
    "Ajouter le riz et le faire nacrer quelques minutes.",
    "Déglacer avec le vin blanc, puis ajouter le bouillon chaud petit à petit en remuant constamment.",
    "Laisser cuire 18-20 minutes jusqu'à ce que le riz soit al dente.",
    "Hors du feu, incorporer le parmesan râpé et rectifier l'assaisonnement."
    ],
    tags: []
  })


// ===================================================
  await client.query('COMMIT')
} catch (err) {
  await client.query('ROLLBACK')
  throw err
} finally {
  client.release()
}
