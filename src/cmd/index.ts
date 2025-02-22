import { handleGetUser } from './get-user'
import { handleListUsers } from './list-users'
import { handleSearchUsers } from './search-user'

export * from './get-user'
export * from './list-users'
export * from './search-user'

const handleMenu = async () => {
  console.log('Usage:')
  console.log('  get <github_login>')
  console.log('  all')
  console.log('  search [--loc <loc>] [--lang <lang>]')
  process.exit(0)
}

export const commands: Record<string, (args: string[]) => Promise<void>> = {
  'get': handleGetUser,
  'all': handleListUsers,
  'search': handleSearchUsers,
  'undefined': handleMenu,
  '': handleMenu,
}
