import { DataTexture, WebGLRenderer } from 'three'
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer'
import { ComputeShader } from './glsl/'
import { GEOMETRY, TEXTURE_SIZE } from './Constants'

const SIZE = TEXTURE_SIZE

function fillTextures(texturePosition: DataTexture, textureVelocity: DataTexture) {
  const posArray = texturePosition.image.data
  const velArray = textureVelocity.image.data

  const { count, array } = GEOMETRY.attributes.position,
    geometryIndex = GEOMETRY.getIndex()

  console.log({ count, array, length: posArray.length, geometryIndex })
  for (let k = 0, kl = posArray.length; k < kl; k += 4) {
    posArray[k + 0] = 0
    posArray[k + 1] = 0
    posArray[k + 2] = 0
    posArray[k + 3] = 1
  }

  let index = 0
  for (let k = 0; k < velArray.length; k += SIZE.x * 4) {
    index = index % (count * 3)

    const diff = 1 //0.8 + 0.4 * Math.random()

    velArray[k + 0] = array[index++] * diff
    velArray[k + 1] = array[index++] * diff
    velArray[k + 2] = array[index++] * diff
    velArray[k + 3] = 0
  }
}

export class GPUCompute {
  public gpuComputationRenderer: GPUComputationRenderer

  public positionVariable: Variable
  public velocityVariable: Variable

  constructor(renderer: WebGLRenderer) {
    this.gpuComputationRenderer = new GPUComputationRenderer(SIZE.x, SIZE.y, renderer)
    const dtPosition = this.gpuComputationRenderer.createTexture()
    const dtVelocity = this.gpuComputationRenderer.createTexture()

    fillTextures(dtPosition, dtVelocity)

    this.velocityVariable = this.gpuComputationRenderer.addVariable(
      'textureVelocity',
      ComputeShader.velocity,
      dtVelocity,
    )
    this.positionVariable = this.gpuComputationRenderer.addVariable(
      'texturePosition',
      ComputeShader.position,
      dtPosition,
    )

    this.gpuComputationRenderer.setVariableDependencies(this.velocityVariable, [
      this.positionVariable,
      this.velocityVariable,
    ])
    this.gpuComputationRenderer.setVariableDependencies(this.positionVariable, [
      this.positionVariable,
      this.velocityVariable,
    ])

    const error = this.gpuComputationRenderer.init()

    if (error !== null) {
      console.error(error)
    }
  }

  public reset() {
    this.gpuComputationRenderer.init()
  }

  public update() {
    this.gpuComputationRenderer.compute()
  }
}
