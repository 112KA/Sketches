import {
  BufferAttribute,
  BufferGeometry,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  ShaderMaterial,
} from 'three'
import { InstancedPolygonalTrailShader } from './glsl'
import { TEXTURE_SIZE } from './Constants'

const SIZE = TEXTURE_SIZE

/**
 * □ □ □ □ □ □ □ □ □ □ - 行をinstanceにする
 * □ □ □ □ □ □ □ □ □ □
 */

export class InstancedPolygonalTrailMesh extends Mesh {
  private _nPoints: number
  constructor(private _nSectionShapes: number) {
    const geometry = new InstancedBufferGeometry(),
      material = new ShaderMaterial({
        uniforms: {
          texturePosition: { value: null },
          textureVelocity: { value: null },
          resolution: { value: SIZE },
        },
        vertexShader: InstancedPolygonalTrailShader.vertex,
        fragmentShader: InstancedPolygonalTrailShader.fragment,
      })

    super(geometry, material)

    this._nPoints = SIZE.x * this._nSectionShapes
    geometry.instanceCount = SIZE.y

    const position = new Float32Array(this._nPoints * 3),
      sectionIndex = new Float32Array(this._nPoints * 1),
      instanceIndex = new Float32Array(geometry.instanceCount),
      indexArray = []

    let iPosition = 0
    const radius = 1

    for (let i = 0; i < SIZE.x; i++) {
      for (let k = 0; k < this._nSectionShapes; k++) {
        let radians = ((Math.PI * 2) / this._nSectionShapes) * k
        position[iPosition++] = Math.cos(radians) * radius
        position[iPosition++] = 0
        position[iPosition++] = Math.sin(radians) * radius

        sectionIndex[i * this._nSectionShapes + k] = i

        if (i > 0) {
          let currentBase = i * this._nSectionShapes
          let underBase = (i - 1) * this._nSectionShapes
          let kNext = (k + 1) % this._nSectionShapes

          indexArray.push(currentBase + k, underBase + kNext, currentBase + kNext)
          indexArray.push(currentBase + k, underBase + k, underBase + kNext)
        }
      }
    }

    geometry.setAttribute('position', new BufferAttribute(position, 3))
    geometry.setAttribute('sectionIndex', new BufferAttribute(sectionIndex, 1))
    geometry.setIndex(new BufferAttribute(new Uint32Array(indexArray), 1))

    for (let i = 0; i < SIZE.y; i++) {
      instanceIndex[i] = i
    }
    geometry.setAttribute('instanceIndex', new InstancedBufferAttribute(instanceIndex, 1))

    console.log(this)
  }
}
