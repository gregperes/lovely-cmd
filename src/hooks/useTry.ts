export type TryResult<T> = [err: Error | null, result: T | null]

export type TryCallback<T> = () => Promise<T>

export async function useTry<T>(fn: TryCallback<T>): Promise<TryResult<T>> {
  try {
    const result = await fn()
    return [null, result]
  } catch (error: unknown) {
    if (error instanceof Error) return [error as Error, null]
    return [new Error(error?.toString()), null]
  }
}