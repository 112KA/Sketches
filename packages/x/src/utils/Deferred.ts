/**
 * @class Deferred
 * @constructor
 */
export class Deferred<T> {
  resolve: (value: T) => void = this.#mock
  reject: (value: T) => void = this.#mock

  clear() {
    this.resolve = this.#mock
    this.reject = this.#mock
  }

  promise() {
    return new Promise<T>((resolve: (value: T) => void, reject: (value: T) => void) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  get isCreatedPromise() {
    return this.resolve !== this.#mock
  }

  #mock(value: T) {
    throw new Error('no promised deferred!')
  }
}

export type DeferredMap<T> = {
  [key: string]: Deferred<T>
}

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
