import fetch, { Response } from 'node-fetch'

const GITHUB_API_URL = 'https://api.github.com'

export const useGithubApi = async (path: string): Promise<Response> => {
  const url = `${GITHUB_API_URL}/${path}`
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}