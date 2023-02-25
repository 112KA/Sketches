import { BufferAttribute, BufferGeometry, LineSegments, Points, ShaderMaterial } from 'three'
import { LineSegmentsShader } from './glsl'
import { TEXTURE_SIZE } from './Constants'

const SIZE = TEXTURE_SIZE,
  N_POINTS = (SIZE.x - 1) * 2 * SIZE.y

export class LineSegmentsMesh extends LineSegments {
  constructor() {
    const geometry = new BufferGeometry(),
      material = new ShaderMaterial({
        uniforms: {
          texturePosition: { value: null },
          textureVelocity: { value: null },
        },
        vertexShader: LineSegmentsShader.vertex,
        fragmentShader: LineSegmentsShader.fragment,
      })

    super(geometry, material)

    const position = new Float32Array(N_POINTS * 3),
      uv = new Float32Array(N_POINTS * 2)

    let p = 0

    //uv
    for (let j = 0; j < SIZE.y; j++) {
      for (let i = 0; i < SIZE.x; i++) {
        for (let k = 0; k < 2; k++) {
          uv[p++] = (i + k) / (SIZE.x - 1)
          uv[p++] = j / (SIZE.y - 1)
        }
      }
    }

    geometry.setAttribute('position', new BufferAttribute(position, 3))
    geometry.setAttribute('uv', new BufferAttribute(uv, 2))
  }
}
