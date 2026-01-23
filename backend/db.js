import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  user: 'recipiz',
  host: 'localhost',
  database: 'recipiz',
  password: 'recipiz',
  port: 5432
})

export default pool
