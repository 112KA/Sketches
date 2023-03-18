import { CylinderGeometry, Float32BufferAttribute, Uint16BufferAttribute, Vector3 } from 'three'

type CylinderSizing = {
  segmentHeight: number
  segmentCount: number
  height: number
  halfHeight: number
}

const segmentHeight = 1
const segmentCount = 4
const height = segmentHeight * segmentCount
const halfHeight = height * 0.5

export const sizing: CylinderSizing = {
  segmentHeight,
  segmentCount,
  height,
  halfHeight,
}

export class SampleGeometry extends CylinderGeometry {
  constructor() {
    super(0.5, 0.5, sizing.height, 8, sizing.segmentCount * 3, true)

    const position = this.attributes.position

    // create the skin indices and skin weights manually
    // (typically a loader would read this data from a 3D model for you)

    const vertex = new Vector3()

    const skinIndices = []
    const skinWeights = []

    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i)

      // compute skinIndex and skinWeight based on some configuration data

      const y = vertex.y + sizing.halfHeight

      const skinIndex = Math.floor(y / sizing.segmentHeight)
      const skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight

      skinIndices.push(skinIndex, skinIndex + 1, 0, 0)
      skinWeights.push(1 - skinWeight, skinWeight, 0, 0)
    }

    this.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndices, 4))
    this.setAttribute('skinWeight', new Float32BufferAttribute(skinWeights, 4))
  }
}
