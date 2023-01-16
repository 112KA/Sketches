import { DataTexture, WebGLRenderer } from 'three'
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer'
import { ComputeShader } from './glsl/'
import { TEXTURE_SIZE } from './Constants'

const SIZE = TEXTURE_SIZE

function fillTextures(texturePosition: DataTexture, textureVelocity: DataTexture) {
  const posArray = texturePosition.image.data
  const velArray = textureVelocity.image.data

  const gap = 10 / (SIZE - 1)
  for (let k = 0, kl = posArray.length; k < kl; k += 4) {
    let i = k / 4,
      iH = ~~(i / SIZE),
      iV = i % SIZE,
      x = -5 + gap * iH,
      z = -5 + gap * iV

    posArray[k + 0] = x
    posArray[k + 1] = 0
    posArray[k + 2] = z
    posArray[k + 3] = 1

    velArray[k + 0] = 0
    velArray[k + 1] = Math.random() - 0.5
    velArray[k + 2] = 0
    velArray[k + 3] = 0
  }
}

export class GPUCompute {
  public gpuComputationRenderer: GPUComputationRenderer

  public positionVariable: Variable
  public velocityVariable: Variable

  constructor(renderer: WebGLRenderer) {
    this.gpuComputationRenderer = new GPUComputationRenderer(SIZE, SIZE, renderer)
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

  public update() {
    this.gpuComputationRenderer.compute()
  }
}
