import { useTry } from '../hooks/useTry'

import * as userRepository from '../database/user-repository'
import * as github from '../services/github'

export const handleGetUser = async (args: string[]): Promise<void> => {
  const login = args[0]

  const [err, result] = await useTry(async () => {
    if (!login) {
      throw 'Please provide a GitHub login.'
    }

    const user = await github.fetchUser(login)
    user.id = await userRepository.createOrUpdateUser(user)

    const languages = await github.fetchUserLanguages(login)
    await userRepository.insertLanguages(user.id, languages)

    return user
  })

  if (err) {
    console.error(err)
    return
  }

  console.log(
    `User ${result?.githubLogin} stored/updated with ID ${result?.id}.`
  )
}
