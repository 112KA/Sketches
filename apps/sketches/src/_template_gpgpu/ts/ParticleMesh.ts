import { BufferAttribute, BufferGeometry, GLSL3, Points, ShaderMaterial } from 'three'
import { ParticleShader } from './glsl/'
import { TEXTURE_SIZE } from './Constants'

const SIZE = TEXTURE_SIZE,
  N_PARTICLES = SIZE * SIZE

export class ParticleMesh extends Points {
  constructor() {
    const geometry = new BufferGeometry(),
      material = new ShaderMaterial({
        uniforms: {
          texturePosition: { value: null },
          textureVelocity: { value: null },
        },
        vertexShader: ParticleShader.vertex,
        fragmentShader: ParticleShader.fragment,
      })

    super(geometry, material)

    const position = new Float32Array(N_PARTICLES * 3),
      uv = new Float32Array(N_PARTICLES * 2)

    let p = 0

    //uv
    for (let j = 0; j < SIZE; j++) {
      for (let i = 0; i < SIZE; i++) {
        uv[p++] = i / (SIZE - 1)
        uv[p++] = j / (SIZE - 1)
      }
    }

    geometry.setAttribute('position', new BufferAttribute(position, 3))
    geometry.setAttribute('uv', new BufferAttribute(uv, 2))
  }
}
