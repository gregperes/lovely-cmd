import { User } from '../domain/user'
import { useGithubApi } from '../http/github-api'

// Infer github user type to not affect our domain
type GithubUser = {
  login?: string,
  name: string
  location: string
  bio: string
  company: string
}

type GitHubRepo = {
  name?: string,
  url?: string,
  language?: string
}

type GitHubRepoCollection = GitHubRepo[]

export const fetchUser = async (username: string): Promise<User> => {
  const response = await useGithubApi(`users/${username}`)

  if (!response.ok)  {
    throw `GitHub user fetch failed: ${response.status} ${response.statusText}`
  }

  const {
    login,
    name,
    location,
    bio,
    company
  } = await response.json() as GithubUser

  // Adapt github data to domain so if github change the api it should not affect our domain
  const user: User = {
    githubLogin: login ?? '',
    name: name ?? '',
    location: location ?? '',
    bio: bio ?? '',
    company: company ?? ''
  }

  return user
}

export const fetchUserLanguages = async (login: string): Promise<string[]> => {
  const res = await useGithubApi(`users/${login}/repos`)
  
  if (!res.ok) {
    throw `GitHub repos fetch failed: ${res.status} ${res.statusText}`
  }

  const githubRepos = await res.json() as GitHubRepoCollection

  return githubRepos.map(repo => repo.language ?? 'unknown')
}