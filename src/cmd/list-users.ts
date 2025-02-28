import * as userRepository from '../database/user-repository'
import { useTry } from '../hooks/useTry'

export const handleListUsers = async (): Promise<void> => {
  const [err] = await useTry(async () => {
    const users = await userRepository.listUsers()
    console.table(
      users.map(u => ({
        ...u,
        languages: u.languages.join(', '),
      }))
    )
  })

  if (err) {
    console.error(err)
    return
  }
}
