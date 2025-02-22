import * as userRepository from '../database/user-repository'
import { useTry } from '../hooks/useTry'

export const handleListUsers = async (): Promise<void> => {
  const [err] = await useTry(async () => {
    const users = await userRepository.listUsers()
    console.table(users)
  })

  if (err) {
    console.error(err)
    return
  }
}
