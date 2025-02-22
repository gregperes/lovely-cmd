import { map, uniq } from 'ramda'

import { User } from '../domain'
import { db } from './db'

export const insertUser = async (
  {
    githubLogin,
    name,
    location,
    bio,
    company
  }: User
): Promise<number> => {
  const sql = `
    INSERT INTO users
      (github_login, name, location, bio, company)
    VALUES
      ($1, $2, $3, $4, $5)
    ON CONFLICT (github_login) DO UPDATE
      SET name = EXCLUDED.name,
          location = EXCLUDED.location,
          bio = EXCLUDED.bio,
          company = EXCLUDED.company
    RETURNING id
  `
  const result = await db.one(sql, [
    githubLogin,
    name,
    location,
    bio,
    company,
  ])
  
  return result.id
}

export const insertLanguages = async (
  userId: number,
  languages: string[]
): Promise<void> => {
  const uniqueLangs = uniq(languages)

  const promises = map((lang: string) => {
    const sql = `
      INSERT INTO languages (user_id, language)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `

    return db.none(sql, [userId, lang])
  }, uniqueLangs)

  await Promise.all(promises)
}

export const listUsers = async (): Promise<User[]> => {
  const sql = 'SELECT * FROM users ORDER BY id ASC'
  return db.manyOrNone(sql)
}

export const getUsersByLocation = async (
  location: string
): Promise<User[]> => {
  const sql = `
    SELECT * FROM users
    WHERE location ILIKE $1
    ORDER BY id ASC
  `
  return db.manyOrNone(sql, [`%${location}%`])
}

export const getUsersByLangAndLoc = async (
  location: string,
  language: string
): Promise<User[]> => {
  const sql = `
    SELECT u.*
    FROM users u
    JOIN languages l
      ON l.user_id = u.id
    WHERE u.location ILIKE $1
      AND l.language ILIKE $2
    ORDER BY u.id ASC
  `

  return db.manyOrNone(sql, [`%${location}%`, `%${language}%`])
}

export const getUsersByLang = async (
  language: string
): Promise<User[]> => {
  const sql = `
    SELECT u.*
    FROM users u
    JOIN languages l
      ON l.user_id = u.id
    WHERE l.language ILIKE $1
    GROUP BY u.id
    ORDER BY u.id ASC
  `

  return db.manyOrNone(sql, [`%${language}%`])
}