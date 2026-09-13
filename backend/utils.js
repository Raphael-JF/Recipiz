import * as db from './db.js'


export function normalizeIngredientName(value) {
  return value?.trim()
}


// Template route for POST or PUT requests that require a database transaction
export function templateAlterRoute(behaviour) {
  return async (req, reply) => {
    const client = await db.pool.connect()

    try {
      await client.query('BEGIN')
      await behaviour(req, reply, client); 
      await client.query('COMMIT')
      reply.code(201).send()
    } catch (error) {
      await client.query('ROLLBACK')
      reply.code(500).send({
        error: error.message
      })
    } finally {
      client.release()
    }
  }
}
