import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  user: process.env.RECIPIZ_DB_USER ?? 'recipiz',
  host: process.env.RECIPIZ_DB_HOST ?? 'localhost',
  database: process.env.RECIPIZ_DB_NAME ?? 'recipiz',
  password: process.env.RECIPIZ_DB_PASSWORD,
  port: Number(process.env.RECIPIZ_DB_PORT ?? 5432)
})

export default pool
