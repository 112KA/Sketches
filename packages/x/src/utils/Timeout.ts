export const TimeoutEventType = { Timeout: 'Timeout', Complete: 'Complete' } as const

export class Timeout extends EventTarget {
  private _elapsedTime: number | null
  private _isComplete: boolean = false

  constructor(private _durationSeconds: number, private _repeat: number = 0) {
    super()

    this._elapsedTime = null
  }

  reset() {
    this._isComplete = false
  }

  tick(elapsedTime: number): void {
    if (this._isComplete) return

    if (this._elapsedTime === null) this._elapsedTime = elapsedTime

    const result = this._durationSeconds < elapsedTime - this._elapsedTime

    // console.log({ result, elapsedTime })

    if (result) {
      this._elapsedTime = null
      if (this._repeat === -1 || 0 < this._repeat) {
        if (this._repeat !== -1) {
          this._repeat--
        }
        this.dispatchEvent(new Event(TimeoutEventType.Timeout))
      } else if (this._repeat === 0) {
        this._isComplete = true
        this.dispatchEvent(new Event(TimeoutEventType.Complete))
      }
    }
  }
}
