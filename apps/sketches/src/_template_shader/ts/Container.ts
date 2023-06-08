import { Camera, GridHelper, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'

import type { DeviceSize } from '@112ka/x'

export type ContainerProps = {
  canvas: HTMLElement
}
export class Container {
  public renderer: WebGLRenderer
  public scene = new Scene()
  // public camera = new PerspectiveCamera(45, 1, 0.1, 10000)
  public camera = new Camera()
  private _stats: Stats

  constructor({ canvas }: ContainerProps) {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
    })
    this.renderer.setClearColor(0x000000, 0)
    // this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setPixelRatio(1)
    // this.renderer.shadowMap.type = PCFSoftShadowMap;
    // this.renderer.shadowMap.enabled = true;

    this._stats = new (Stats as any)()
    document.querySelector('body')?.appendChild(this._stats.dom)
  }

  render() {
    this.renderer.render(this.scene, this.camera)
    this._stats.update()
    // console.log('this.renderer', this.renderer);
  }

  resize() {
    const width = window.innerWidth,
      height = window.innerHeight

    this.renderer.setSize(width, height)
  }

  setDeviceSize(deviceSize: DeviceSize) {
    console.log({ deviceSize })
  }
}
