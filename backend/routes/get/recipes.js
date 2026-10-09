import {getMatchingRecipes, getRecipesPage, getOneRecipePage} from '../../db/accessing.js'
// import * from '@/db/destruction.js'
import * as utils from '../../utils.js'


export default function registerRecipeGetRoutes(fastify) {
  fastify.get('/matchingRecipes', async (request) => {
    const suggestionRecipe = request.query.suggestionSearch
    return await getMatchingRecipes(suggestionRecipe, utils.NUM_RECIPE_SUGGESTIONS)
  })

  fastify.get('/recipes', async (request) => {
    const search = request.query.search 
    const page = parseInt(request.query.page) 

    return await getRecipesPage(search, page, utils.RECIPES_PER_PAGE)
  })


  fastify.get('/recipes/:id', utils.dbTransaction(
    async (request, reply, client) => {
      const { id } = request.params

      const result = await getOneRecipePage(client, id);
      if (result === null) {
        reply.code(404)
        return { error: 'Recipe not found' }
      }
      return result
    }
  ))
}
