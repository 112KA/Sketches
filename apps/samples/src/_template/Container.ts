import { GridHelper, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type ContainerProps = {
  canvas: HTMLCanvasElement
}
export class Container {
  private _renderer: WebGLRenderer
  private _scene = new Scene()
  private _camera = new PerspectiveCamera(45, 1, 0.1, 10000)
  private _cameraControls: OrbitControls
  private _stats: Stats

  constructor({ canvas }: ContainerProps) {
    console.log('canvas', canvas)

    this._renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
    })
    this._renderer.setClearColor(0x000000, 0)
    this._renderer.setPixelRatio(window.devicePixelRatio)
    // this._renderer.shadowMap.type = PCFSoftShadowMap;
    // this._renderer.shadowMap.enabled = true;

    this._camera.position.set(0, 5, 10)

    this._cameraControls = new OrbitControls(this._camera, this._renderer.domElement)

    var grid = new GridHelper(10, 10)
    this._scene.add(grid)

    this._stats = new Stats()
    document.querySelector('body')?.appendChild(this._stats.dom)
  }
  render() {
    this._cameraControls.update()
    this._renderer.render(this._scene, this._camera)
    this._stats.update()
    // console.log('this._renderer', this._renderer);
  }
  resize() {
    const width = window.innerWidth,
      height = window.innerHeight

    this._renderer.setSize(width, height)

    this._camera.aspect = width / height
    this._camera.updateProjectionMatrix()
  }
}
