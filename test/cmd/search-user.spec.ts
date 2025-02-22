// test/handleSearchUsers.test.ts

import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'

import { handleSearchUsers } from '../../src/cmd/search-user'
import * as userRepository from '../../src/database/user-repository'

describe('handleSearchUsers (unit)', () => {
  const mockGetUsersByLocation = vi.spyOn(
    userRepository,
    'getUsersByLocation'
  )

  const mockGetUsersByLangAndLoc = vi.spyOn(
    userRepository,
    'getUsersByLangAndLoc'
  )

  const mockGetUsersByLang = vi.spyOn(
    userRepository,
    'getUsersByLang'
  )

  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  const consoleTableSpy = vi.spyOn(console, 'table').mockImplementation(() => {})

  afterEach(() => {
    mockGetUsersByLocation.mockReset()
    mockGetUsersByLangAndLoc.mockReset()
    mockGetUsersByLang.mockReset()

    consoleLogSpy.mockReset()
    consoleTableSpy.mockReset()
  })

  afterAll(() => {
    mockGetUsersByLocation.mockRestore()
    mockGetUsersByLangAndLoc.mockRestore()
    mockGetUsersByLang.mockRestore()

    consoleLogSpy.mockRestore()
    consoleTableSpy.mockRestore()
  })

  it('should show a message if no args provided', async () => {
    await handleSearchUsers([])

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'ATTENTION: You should provide at least one of following [--loc, --lang]'
    )

    expect(mockGetUsersByLocation).not.toHaveBeenCalled()
    expect(mockGetUsersByLangAndLoc).not.toHaveBeenCalled()
    expect(mockGetUsersByLang).not.toHaveBeenCalled()
  })

  it('should call getUsersByLocation if only --location is provided', async () => {
    mockGetUsersByLocation.mockResolvedValueOnce([
      { 
        id: 1, 
        githubLogin: 'test', 
        name: 'Test', 
        bio: 'Bio', 
        location: 'USA', 
        company: 'Company' 
      }
    ])

    await handleSearchUsers(['--loc', 'USA'])

    expect(mockGetUsersByLocation).toHaveBeenCalledWith('USA')
    expect(consoleTableSpy).toHaveBeenCalled()
  })

  it('should call getUsersByLangAndLoc if both location and lang are provided', async () => {
    mockGetUsersByLangAndLoc.mockResolvedValueOnce([
      { 
        id: 2, 
        githubLogin: 'test2', 
        name: 'Test', 
        bio: 'bio', 
        location: 'Brazil', 
        company: 'Brazil' 
      }
    ])

    await handleSearchUsers(['--loc', 'Brazil', '--lang', 'JS'])

    expect(mockGetUsersByLangAndLoc).toHaveBeenCalledWith('Brazil', 'JS')
    expect(consoleTableSpy).toHaveBeenCalled()
  })

  it('should call getUsersByLang if only --lang is provided', async () => {
    mockGetUsersByLang.mockResolvedValueOnce([
      { 
        id: 2, 
        githubLogin: 'test3', 
        name: 'Test', 
        bio: 'bio', 
        location: 'Portugal', 
        company: 'Portugal' 
      }
    ])

    await handleSearchUsers(['--lang', 'Python'])

    expect(mockGetUsersByLang).toHaveBeenCalledWith('Python')
    expect(consoleTableSpy).toHaveBeenCalled()
  })

  it('should show "No users found." if repo returns empty array', async () => {
    mockGetUsersByLocation.mockResolvedValueOnce([])

    await handleSearchUsers(['--loc', 'Nowhere'])

    expect(mockGetUsersByLocation).toHaveBeenCalledWith('Nowhere')
    expect(consoleLogSpy).toHaveBeenCalledWith('Ooops! No users found.')
  })
})
