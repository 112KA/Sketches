import positionFragmentShader from './position.frag'
export const PositionShader = {
  fragment: `${positionFragmentShader}`,
}

import particleVertexShader from './particle.vert?raw'
import particleFragmentShader from './particle.frag?raw'
console.log('test', { particleVertexShader, particleFragmentShader })

export const ParticleShader = {
  vertex: particleVertexShader,
  fragment: particleFragmentShader,
}

import particleDistanceVertexShader from './particle_distance.vert?raw'
import particleDistanceFragmentShader from './particle_distance.frag?raw'

export const ParticleDistanceShader = {
  vertex: particleDistanceVertexShader,
  fragment: particleDistanceFragmentShader,
}

import instancedParticleVertexShader from './instanced_particle.vert?raw'
import instancedParticleFragmentShader from './instanced_particle.frag?raw'

export const InstancedParticleShader = {
  vertex: instancedParticleVertexShader,
  fragment: instancedParticleFragmentShader,
}

import instancedParticleDistanceVertexShader from './instanced_particle_distance.vert?raw'

export const InstancedParticleDistanceShader = {
  vertex: instancedParticleDistanceVertexShader,
  fragment: particleDistanceFragmentShader,
}
