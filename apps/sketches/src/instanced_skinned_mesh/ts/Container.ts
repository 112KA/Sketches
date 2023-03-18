import { GridHelper, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import type { DeviceSize } from 'x/misc'

export type ContainerProps = {
  canvas: HTMLElement
}
export class Container {
  public renderer: WebGLRenderer
  public scene = new Scene()
  public camera = new PerspectiveCamera(45, 1, 0.1, 10000)
  private _cameraControls: OrbitControls
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

    this.camera.position.set(0, 5, 10)

    this._cameraControls = new OrbitControls(this.camera, this.renderer.domElement)

    const lights = []
    lights[0] = new PointLight(0xffffff, 1, 0)
    lights[1] = new PointLight(0xffffff, 1, 0)
    lights[2] = new PointLight(0xffffff, 1, 0)

    lights[0].position.set(0, 200, 0)
    lights[1].position.set(100, 200, 100)
    lights[2].position.set(-100, -200, -100)

    this.scene.add(...lights)

    var grid = new GridHelper(10, 10)
    this.scene.add(grid)

    this._stats = new (Stats as any)()
    document.querySelector('body')?.appendChild(this._stats.dom)
  }
  render() {
    this._cameraControls.update()
    this.renderer.render(this.scene, this.camera)
    this._stats.update()
    // console.log('this.renderer', this.renderer);
  }
  resize() {
    const width = window.innerWidth,
      height = window.innerHeight

    this.renderer.setSize(width, height)

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  setDeviceSize(deviceSize: DeviceSize) {
    console.log({ deviceSize })
  }
}
