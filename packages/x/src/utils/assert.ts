import { AssertionError } from '../errors/AssertionError'

export function assert(condition: any, message?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(message)
  }
}

export function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`Expected 'value' to be defined, but received ${value}`)
  }
}
