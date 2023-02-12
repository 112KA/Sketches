import type { ShaderMaterial } from 'three'

import { Container } from './Container'
import { ParticleMesh } from './ParticleMesh'
import { GPUCompute } from './GPUCompute'
import { Timeout, TimeoutEventType } from 'x/utils/Timeout'

export class Particle {
  private _gpuCompute: GPUCompute
  private _mesh: ParticleMesh = new ParticleMesh()
  private _timeout: Timeout = new Timeout(3, -1)

  constructor({ scene, renderer }: Container) {
    this._gpuCompute = new GPUCompute(renderer)

    scene.add(this._mesh)

    this._timeout.addEventListener(TimeoutEventType.Timeout, this._onTimeout)
  }

  public update(dt: number, elapsedTime: number) {
    this._timeout.tick(elapsedTime)
    this._gpuCompute.update()

    const { uniforms } = this._mesh.material as ShaderMaterial,
      { gpuComputationRenderer, positionVariable, velocityVariable } = this._gpuCompute

    uniforms['texturePosition'].value =
      gpuComputationRenderer.getCurrentRenderTarget(positionVariable).texture
    uniforms['textureVelocity'].value =
      gpuComputationRenderer.getCurrentRenderTarget(velocityVariable).texture
  }

  private _onTimeout = () => {
    console.log('_onTimeout')
    this._gpuCompute.reset()
  }
}
