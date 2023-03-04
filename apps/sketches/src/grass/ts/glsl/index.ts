import GrassFragmentShader from './Grass.frag?raw'
import GrassVertexShader from './Grass.vert?raw'

export const GrassShader = {
  vertex: GrassVertexShader,
  fragment: GrassFragmentShader,
}
import InstancedGrassFragmentShader from './InstancedGrass.frag?raw'
import InstancedGrassVertexShader from './InstancedGrass.vert?raw'

export const InstancedGrassShader = {
  vertex: InstancedGrassVertexShader,
  fragment: InstancedGrassFragmentShader,
}
