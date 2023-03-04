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

class InstancedPolygonalTrailGeometry extends InstancedBufferGeometry {
  private _nPoints: number
  constructor(private _nSectionShapes: number) {
    super()

    this._nPoints = SIZE.x * this._nSectionShapes
    this.instanceCount = SIZE.y

    const position = new Float32Array(this._nPoints * 3),
      sectionIndex = new Float32Array(this._nPoints * 1),
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

    this.setAttribute('position', new BufferAttribute(position, 3))
    this.setAttribute('sectionIndex', new BufferAttribute(sectionIndex, 1))
    this.setIndex(indexArray)
  }
}

/**
 * □ □ □ □ □ □ □ □ □ □ - 行をinstanceにする
 * □ □ □ □ □ □ □ □ □ □
 */

export class InstancedPolygonalTrailMesh extends Mesh {
  constructor(_nSectionShapes: number) {
    const geometry = new InstancedPolygonalTrailGeometry(_nSectionShapes),
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
  }
}
