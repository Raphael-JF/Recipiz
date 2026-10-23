import argon2 from 'argon2'

export default function registerUserRoutes(fastify) { 

  fastify.post('/auth/register', async (request, reply) => {
    const { username, password } = request.body

    if (
      typeof username !== 'string' ||
      username.length < 3 ||
      username.length > 30 ||
      typeof password !== 'string' ||
      password.length < 12 ||
      password.length > 128
    ) {
      return reply.code(400).send({ error: 'Identifiants invalides' })
    }

    const passwordHash = await argon2.hash(password)

    try {
      await db.query(
        `INSERT INTO users (username, password_hash)
         VALUES ($1, $2)`,
        [username, passwordHash]
      )
    } catch (err) {
      if (err.code === '23505') {
        return reply.code(409).send({ error: 'Nom déjà utilisé' })
      }
      throw err
    }

    return reply.code(201).send({ message: 'Compte créé' })
  })

  fastify.post('/auth/login', async (request, reply) => {
    const { username, password } = request.body

    if (typeof username !== 'string' || typeof password !== 'string') {
      return reply.code(400).send({ error: 'Requête invalide' })
    }

    const result = await db.query(
      'SELECT id, username, password_hash FROM users WHERE username = $1',
      [username]
    )

    const user = result.rows[0]

    if (!user || !(await argon2.verify(user.password_hash, password))) {
      return reply.code(401).send({ error: 'Identifiants incorrects' })
    }

    // Nouveau SessionID après authentification :
    // évite de conserver un identifiant de session préexistant.
    await request.session.regenerate()

    request.session.userId = user.id

    return reply.send({
      id: user.id,
      username: user.username
    })
  })

  fastify.post('/auth/logout', async (request, reply) => {

    await request.session.destroy()

    return reply.send({ message: 'Déconnecté' })
  })


  fastify.get('/auth/me', async (request, reply) => {
    if (!request.session.userId) {
      return reply.code(401).send({ error: 'Non connecté' })
    }

    const result = await db.query(
      'SELECT id, username FROM users WHERE id = $1',
      [request.session.userId]
    )

    const user = result.rows[0]

    if (!user) {
      await request.session.destroy()
      return reply.code(401).send({ error: 'Non connecté' })
    }

    return reply.send(user)
  })

)}
