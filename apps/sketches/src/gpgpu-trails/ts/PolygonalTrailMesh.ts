import { BufferAttribute, BufferGeometry, Mesh, ShaderMaterial } from 'three'
import { PolygonalTrailShader } from './glsl'
import { TEXTURE_SIZE } from './Constants'

const SIZE = TEXTURE_SIZE

export class PolygonalTrailMesh extends Mesh {
  private _nPoints: number
  constructor(private _nSectionShapes: number) {
    const geometry = new BufferGeometry(),
      material = new ShaderMaterial({
        uniforms: {
          texturePosition: { value: null },
          textureVelocity: { value: null },
          resolution: { value: SIZE },
        },
        vertexShader: PolygonalTrailShader.vertex,
        fragmentShader: PolygonalTrailShader.fragment,
      })

    super(geometry, material)

    this._nPoints = SIZE.x * this._nSectionShapes * SIZE.y

    const position = new Float32Array(this._nPoints * 3),
      uv = new Float32Array(this._nPoints * 2),
      indexArray = []

    let iUv = 0,
      iPosition = 0
    const radius = 1

    //uv
    for (let j = 0; j < SIZE.y; j++) {
      for (let i = 0; i < SIZE.x; i++) {
        let cNum = j * SIZE.x + i
        for (let k = 0; k < this._nSectionShapes; k++) {
          let radians = ((Math.PI * 2) / this._nSectionShapes) * k
          position[iPosition++] = Math.cos(radians) * radius
          position[iPosition++] = 0
          position[iPosition++] = Math.sin(radians) * radius

          uv[iUv++] = (i + k) / (SIZE.x - 1)
          uv[iUv++] = j / (SIZE.y - 1)

          if (i > 0) {
            let currentBase = cNum * this._nSectionShapes
            let underBase = (cNum - 1) * this._nSectionShapes
            let kNext = (k + 1) % this._nSectionShapes

            indexArray.push(currentBase + k, underBase + kNext, currentBase + kNext)
            indexArray.push(currentBase + k, underBase + k, underBase + kNext)
          }
        }
      }
    }

    geometry.setAttribute('position', new BufferAttribute(position, 3))
    geometry.setAttribute('uv', new BufferAttribute(uv, 2))
    geometry.setIndex(new BufferAttribute(new Uint32Array(indexArray), 1))
  }
}
