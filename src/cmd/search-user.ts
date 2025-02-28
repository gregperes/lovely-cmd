import * as userRepository from '../database/user-repository'
import { useTry } from '../hooks/useTry'

const getArgValue = (args: string[], flag: string): string | null => {
  const index = args.indexOf(flag)
  
  if (index !== -1 && index < args.length - 1) {
    return args[index + 1]
  }

  return null
}

export const handleSearchUsers = async (args: string[]): Promise<void> => {
  const locArg = getArgValue(args, '--loc')
  const langArg = getArgValue(args, '--lang')

  if (!locArg && !langArg) {
    console.log(
      'ATTENTION: You should provide at least one of following [--loc, --lang]'
    )

    return
  }
  
  const [err, users] = await useTry(async () => {
    if (locArg && langArg) {
      return userRepository.getUsersByLangAndLoc(locArg, langArg)
    }

     if (locArg) {
      return userRepository.getUsersByLocation(locArg)
    } 

    return userRepository.getUsersByLang(langArg as string)
  })

  if (err) {
    console.log(err)
    process.exit(1)
  }

  if (!users || users?.length <= 0) {
    console.log('Ooops! No users found.')
    return
  }

  console.table(users)
}
