import computeShaderPosition from './computeShaderPosition.frag?raw'
import computeShaderVelocity from './computeShaderVelocity.frag?raw'

export const ComputeShader = {
  position: computeShaderPosition,
  velocity: computeShaderVelocity,
}

import particleFragmentShader from './particle.frag?raw'
import particleVertexShader from './particle.vert?raw'

export const ParticleShader = {
  vertex: particleVertexShader,
  fragment: particleFragmentShader,
}
