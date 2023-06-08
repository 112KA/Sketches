import type { ShaderMaterial } from 'three'

import { Container } from './Container'
import { PointsMesh } from './PointsMesh'
import { LineSegmentsMesh } from './LineSegmentsMesh'
// import { PolygonalTrailMesh } from './PolygonalTrailMesh'
import { InstancedPolygonalTrailMesh } from './InstancedPolygonalTrailMesh'
import { GPUCompute } from './GPUCompute'
import { Timeout, TimeoutEventType } from '@112ka/x'

export class Particle {
  private _gpuCompute: GPUCompute
  // private _mesh: PointsMesh = new PointsMesh()
  // private _mesh: LineSegmentsMesh = new LineSegmentsMesh()
  // private _mesh: PolygonalTrailMesh = new PolygonalTrailMesh(3)
  private _mesh: InstancedPolygonalTrailMesh = new InstancedPolygonalTrailMesh(3)
  private _frameInterval = 1
  private _frame = 0
  private _timeout: Timeout = new Timeout(3 * this._frameInterval, -1)

  constructor({ scene, renderer }: Container) {
    this._gpuCompute = new GPUCompute(renderer)

    scene.add(this._mesh)

    this._timeout.addEventListener(TimeoutEventType.Timeout, this._onTimeout)
  }

  public update(dt: number, elapsedTime: number) {
    // if (this._frame++ % this._frameInterval === 0) {
    this._timeout.tick(elapsedTime)
    this._gpuCompute.update()

    const { uniforms } = this._mesh.material as ShaderMaterial,
      { gpuComputationRenderer, positionVariable, velocityVariable } = this._gpuCompute

    uniforms['texturePosition'].value =
      gpuComputationRenderer.getCurrentRenderTarget(positionVariable).texture
    uniforms['textureVelocity'].value =
      gpuComputationRenderer.getCurrentRenderTarget(velocityVariable).texture
    // }
  }

  private _onTimeout = () => {
    console.log('_onTimeout')
    this._gpuCompute.reset()
  }
}
