import {
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three'
import { Container } from './Container'
import { GradationShader } from './glsl'

export class Background extends Mesh {
  private _renderer: WebGLRenderer

  constructor({ scene, renderer }: Container) {
    const geometry = new PlaneGeometry(2, 2),
      //   material = new MeshBasicMaterial({ color: 0xff0000 }),
      { vertexShader, fragmentShader } = GradationShader,
      material = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          time: { value: 0 },
          resolution: { value: new Vector2() },
        },
      })
    super(geometry, material)

    this._renderer = renderer

    scene.add(this)
  }

  update(dt: number, elapsedTime: number) {
    ;(this.material as ShaderMaterial).uniforms.time.value = elapsedTime
  }

  resize() {
    const { width, height } = this._renderer.domElement
    ;(this.material as ShaderMaterial).uniforms.resolution.value.set(width, height)
  }
}
