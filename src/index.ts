import 'dotenv/config'

import { commands } from './cmd'

const showBanner = () => {
  console.log(`
  _       ___   __      __   __
 | |     / _ \\  \\ \\    / /  / /
 | |    | | | |  \\ \\  / /  / / 
 | |    | | | |   \\ \\/ /  / /  
 | |____| |_| |    \\  /  / /___
 |______\\___/      \\/  /_____/

   L O V E L Y   C M D
`)
}

const main = async () => {
  showBanner()

  const args = process.argv.slice(2)
  const command = args[0]
  const cmdFn = commands[command]

  if (!cmdFn) {
    console.log(`Unknown command: ${command}`)
    process.exit(1)
  }

  const cmdArgs = args.slice(1)
  await cmdFn(cmdArgs)

  process.exit(0)
}


main()
  .catch((err) => {
    console.error('Fatal Error:', err.message)
    process.exit(1)
  })