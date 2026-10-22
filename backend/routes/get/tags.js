import {getMatchingTags} from '../../db/accessing.js'
import * as utils from '../../utils.js'

export default function registerTagGetRoutes(fastify) {

  fastify.get('/matchingTags', async (request) => {
    const suggestionTag = request.query.suggestionSearch
    return await getMatchingTags(suggestionTag, utils.NUM_INGREDIENT_SUGGESTIONS)
  })
}
