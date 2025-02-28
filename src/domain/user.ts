export type User = {
  id?: number,
  githubLogin: string
  name: string
  location: string
  bio: string
  company: string
}

export type UserWithLanguages = User & {
  languages: string[]
}