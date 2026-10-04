import {pool} from './db/pool.js'


export function normalizeIngredientName(value) {
  return value?.trim()
}


// Template route for POST or PUT requests that require a database transaction
export function dbTransaction(behaviour) {
  return async (req, reply) => {
    const client = await pool.connect()

    try {
      await client.query('BEGIN')
      const result = await behaviour(req, reply, client); 
      await client.query('COMMIT')
      if (result !== undefined) {
        reply.send(result)
      }
      // reply.code(200).send()
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
