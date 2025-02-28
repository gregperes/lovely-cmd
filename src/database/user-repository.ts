import { uniq } from 'ramda'

import { User, UserWithLanguages } from '../domain'
import { db } from './db'

export const createOrUpdateUser = async (
  {
    githubLogin,
    name,
    location,
    bio,
    company
  }: User
): Promise<number> => {
  const sql = `
    INSERT INTO users (
      github_login, 
      name, 
      location, 
      bio, 
      company
    ) 
    VALUES (
      $(github_login), 
      $(name), 
      $(location), 
      $(bio), 
      $(company)
    )
    ON CONFLICT (github_login) DO UPDATE
      SET name = EXCLUDED.name,
          location = EXCLUDED.location,
          bio = EXCLUDED.bio,
          company = EXCLUDED.company
    RETURNING id
  `

  const result = await db.one(sql, {
    github_login: githubLogin,
    name,
    location,
    bio,
    company,
  })
  
  return result.id
}

export const insertLanguages = async (
  userId: number,
  languages: string[]
): Promise<void> => {
  const uniqueLangs = uniq(languages)

  await db.tx(async t => {
    const deleteSql = 'DELETE FROM languages WHERE user_id = $(userId)'
    await t.none(deleteSql, { userId })
  
    if (uniqueLangs.length > 0) {
      const insertSql = `
        INSERT INTO languages (user_id, language)
        SELECT $(userId), unnest($(langs)::text[])
      `

      await t.none(insertSql, {
        userId,
        langs: uniqueLangs
      })
    }
  })
}

export const listUsers = async (): Promise<UserWithLanguages[]> => {
  const sql = `
    SELECT
      u.id,
      u.github_login as githubLogin,
      u.name,
      u.location,
      u.bio,
      u.company,
      array_remove(array_agg(l.language), NULL) AS languages
    FROM users u
    LEFT JOIN languages l 
      ON l.user_id = u.id
    GROUP BY 
      u.id, 
      u.github_login, 
      u.name, 
      u.location, 
      u.bio, 
      u.company
    ORDER BY u.id
  `
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