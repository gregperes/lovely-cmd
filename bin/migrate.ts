// migrate.ts

import 'dotenv/config'

import * as fs from 'node:fs'
import * as path from 'node:path'

import { db } from '../src/database/db'
import { useTry } from '../src/hooks/useTry'

async function runMigrations() {
  const [err] = await useTry(async () => {
    const sqlPath = path.resolve(
      __dirname,
      '../src/database/migrations/create-tables.sql'
    )

    const sql = fs.readFileSync(sqlPath, 'utf8')
    await db.none(sql)

    console.log('Migration successful!')

    process.exit(0)
  })

  if (err) {
    console.error('Migration failed:', err.message)
    process.exit(1)
  }
}

runMigrations()
