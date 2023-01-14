import { Box2, Shape, Vector2, Vector3 } from 'three'

class Line2 {
  constructor(public start = new Vector2(), public end = new Vector2()) {
    this.set(start, end)
  }

  set(start: Vector2, end: Vector2) {
    this.start = start
    this.end = end
  }

  distance() {
    return this.start.distanceTo(this.end)
  }

  delta(target: Vector2) {
    return target.subVectors(this.end, this.start)
  }

  at(t: number, target: Vector2) {
    return this.delta(target).multiplyScalar(t).add(this.start)
  }
}

const _line = new Line2()

export class ShapeSampler {
  private _lines: Vector2[][] = []
  private _cumulativeTotal = 0
  private _distributions: Float32Array[] = []
  private _distribution: Float32Array

  constructor(private _shapes: Shape[]) {
    this._shapes.forEach(shape => this._buildShpae(shape))
    const nFrames = this._distributions.reduce((acc, elem) => {
      return Number(acc) + elem.length
    }, 0)

    this._distribution = new Float32Array(nFrames)

    let currentFrame = 0
    this._distributions.forEach(chunk => {
      this._distribution.set(chunk, currentFrame)
      currentFrame += chunk.length
    })
  }

  _buildShpae(shape: Shape) {
    const curveSegments = 12,
      { shape: shapePoints, holes } = shape.extractPoints(curveSegments)

    let distribution

    distribution = new Float32Array(shapePoints.length - 1)

    for (let i = 0; i < shapePoints.length - 1; i++) {
      _line.set(shapePoints[i], shapePoints[i + 1])
      this._cumulativeTotal += _line.distance()
      distribution[i] = this._cumulativeTotal
      this._lines.push([shapePoints[i], shapePoints[i + 1]])
    }

    this._distributions.push(distribution)

    for (let h = 0, hl = holes.length; h < hl; h++) {
      // console.log('holes[h]', holes[h]);
      const points = holes[h]
      distribution = new Float32Array(points.length - 1)
      // console.log('distribution.length', distribution.length);

      for (let i = 0; i < points.length - 1; i++) {
        _line.set(points[i], points[i + 1])
        this._cumulativeTotal += _line.distance()
        distribution[i] = this._cumulativeTotal
        this._lines.push([points[i], points[i + 1]])
        // console.log('points[i]', points[i]);
      }

      this._distributions.push(distribution)
    }
  }

  sample(targetPosition: Vector3) {
    const cumulativeTotal = this._distribution[this._distribution.length - 1],
      lineIndex = this._binarySearch(Math.random() * cumulativeTotal)

    // console.log('lineIndex', lineIndex, this.lines[lineIndex], cumulativeTotal);
    // _line.set(points[lineIndex], points[lineIndex + 1]);
    _line.set(this._lines[lineIndex][0], this._lines[lineIndex][1])
    _line.at(Math.random(), targetPosition as any)

    targetPosition.z = 0

    return this
  }

  _binarySearch(x: number) {
    const dist = this._distribution
    let start = 0
    let end = dist.length - 1

    let index = -1

    while (start <= end) {
      const mid = Math.ceil((start + end) / 2)

      if (mid === 0 || (dist[mid - 1] <= x && dist[mid] > x)) {
        // console.log(x, start, end, mid);
        index = mid

        break
      } else if (x < dist[mid]) {
        end = mid - 1
      } else {
        start = mid + 1
      }
    }

    return index
  }

  getCenterOffset() {
    const v = new Vector2(),
      boundingBox = new Box2()

    let points: Vector2[] = []

    this._shapes.forEach(shape => (points = points.concat(shape.getPoints())))
    boundingBox.setFromPoints(points)
    boundingBox.getCenter(v)
    return v
  }
}
