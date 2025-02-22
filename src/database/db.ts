import pgPromise from 'pg-promise'

const cn = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'testdb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
}

const pgp = pgPromise()

export const db = pgp(cn)