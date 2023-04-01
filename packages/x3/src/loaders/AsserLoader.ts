import {
  EventDispatcher,
  LoadingManager,
  Object3D,
  Texture,
  TextureLoader,
  WebGLRenderer,
} from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import { assertIsDefined } from 'x/utils/assert'
import { Deferred } from 'x/utils/Deferred'

const LOG_PREFIX = '[AssetLoader]'

export type ResourceItem = {
  name: string
  path: string
}

export type AssetLoaderParameters = {
  dracoDecoderPath?: string
  ktx2TranscoderPath?: string
}

export class AssetLoader extends EventDispatcher {
  #manager: LoadingManager
  #resources: ResourceItem[] = []
  #deferredLoaded = new Deferred<void>()

  public models: Record<string, Object3D> = {}
  public textures: Record<string, Texture> = {}

  constructor({ dracoDecoderPath, ktx2TranscoderPath }: AssetLoaderParameters) {
    super()

    this.#manager = new LoadingManager(this.#onLoad, this.#onProgress, this.#onError)

    const gltfLoader = new GLTFLoader(this.#manager)

    if (dracoDecoderPath !== undefined) {
      const dracoLoader = new DRACOLoader().setDecoderPath(dracoDecoderPath)
      gltfLoader.setDRACOLoader(dracoLoader)
    }

    if (ktx2TranscoderPath !== undefined) {
      const ktx2Loader = new KTX2Loader(this.#manager)
        .setTranscoderPath(ktx2TranscoderPath)
        .detectSupport(new WebGLRenderer())
      gltfLoader.setKTX2Loader(ktx2Loader)

      //NOTE: https://discourse.threejs.org/t/basis-textures-with-alpha-appearing-fully-black-and-white-on-some-ipads-and-older-mobile-devices-when-rgb-pvrtc-4bppv1-format-is-used/22575/18
      ;(ktx2Loader as any).workerConfig.etc1Supported = false

      this.#manager.addHandler(/\.(ktx2)$/i, ktx2Loader)
    }

    this.#manager.addHandler(/\.(gltf|glb)$/i, gltfLoader)
    this.#manager.addHandler(/\.(png|jpg)$/i, new TextureLoader(this.#manager))
  }

  #onLoad = () => {
    //何もしない
  }
  #onProgress = (url: string, loaded: number, total: number): void => {
    this.dispatchEvent({ type: 'progress', url, progress: loaded / total })
  }
  #onError = (url: string): void => {}

  /**
   * addResources
   * @param {array} resources [{ name, path }]
   */
  public addResources(resources: ResourceItem[]) {
    this.#resources = this.#resources.concat(resources)
  }

  public async load(): Promise<void> {
    if (this.#resources.length === 0) {
      console.warn(LOG_PREFIX, 'no resorces')
      return
    }

    console.groupCollapsed('Asset load info')

    let loadedObject,
      targetList,
      countLoaded = 0

    for (const { name, path } of this.#resources) {
      console.log(LOG_PREFIX, 'load', name, path)
      const loader = this.#manager.getHandler(path)
      assertIsDefined(loader)

      loadedObject = await loader.loadAsync(`${path}`)
      console.log({ loadedObject })

      if (loadedObject instanceof Texture) {
        targetList = this.textures
      } else {
        targetList = this.models
      }

      targetList[name] = loadedObject

      // if (++countLoaded === this.#resources.length) {
      //   this.#deferredLoaded.resolve()
      //   this.dispatchEvent({ type: 'loaded' })
      // }
    }

    console.groupEnd()

    this.dispatchEvent({ type: 'loaded' })
    // return this.#deferredLoaded.promise()
  }
}
