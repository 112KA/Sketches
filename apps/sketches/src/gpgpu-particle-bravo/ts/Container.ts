import {
  AmbientLight,
  GridHelper,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { PostProcess } from './PostProcess'
import type { DeviceSize } from '@112ka/x'

export type ContainerProps = {
  canvas: HTMLElement
}
export class Container {
  public renderer: WebGLRenderer
  public scene = new Scene()
  public camera = new PerspectiveCamera(45, 1, 10, 3000)
  private _cameraControls: OrbitControls
  private _stats: Stats

  public pointLight = new PointLight(0xcccccc, 10, 1000)
  public postprocess: PostProcess

  constructor({ canvas }: ContainerProps) {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
    })
    this.renderer.setClearColor(0x000000, 0)
    // this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setPixelRatio(1)
    this.renderer.shadowMap.type = PCFSoftShadowMap
    this.renderer.shadowMap.enabled = true

    this.camera.position.set(0, 5, 1000)

    this._cameraControls = new OrbitControls(this.camera, this.renderer.domElement)

    // var grid = new GridHelper(10, 10)
    // this.scene.add(grid)

    const ambient = new AmbientLight(0xffffff)
    this.scene.add(ambient)

    // this.pointLight = new PointLight(0xffffff, 1, 1200);
    this.pointLight.position.y = 500
    this.pointLight.castShadow = true
    this.pointLight.shadow.camera.near = 10
    this.pointLight.shadow.camera.far = 1000
    // pointLight.shadowCameraFov = 90;
    this.pointLight.shadow.bias = 0.001
    this.pointLight.shadow.radius = 30
    // this.pointLight.shadowDarkness = 0.45;
    this.pointLight.shadow.mapSize.width = 1024
    this.pointLight.shadow.mapSize.height = 1024
    this.pointLight.shadow.normalBias = 1.0
    this.scene.add(this.pointLight)

    this._stats = new (Stats as any)()
    document.querySelector('body')?.appendChild(this._stats.dom)

    this.postprocess = new PostProcess(this)
  }

  render() {
    this._cameraControls.update()
    this.postprocess.render()
    this._stats.update()
    // console.log('this.renderer', this.renderer);
  }

  resize() {
    const width = window.innerWidth,
      height = window.innerHeight

    this.renderer.setSize(width, height)

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.postprocess.resize(width, height)
  }

  setDeviceSize(deviceSize: DeviceSize) {
    console.log({ deviceSize })
    switch (deviceSize) {
      case 'sm':
        this.camera.position.set(0, 5, 2000)
        break
      case 'md':
        this.camera.position.set(0, 5, 700)
        break
      case 'lg':
        this.camera.position.set(0, 5, 500)
        break
    }
  }
}
