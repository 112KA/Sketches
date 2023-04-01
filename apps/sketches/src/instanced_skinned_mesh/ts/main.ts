import {
  AnimationMixer,
  LineBasicMaterial,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  SkeletonHelper,
} from 'three'
import { assertIsDefined } from 'x/utils/assert'
import { wait } from 'x/utils/Deferred'
import { AssetLoader } from 'x3/loaders/AsserLoader'
import { InstancedSkeletonUtils } from 'x3/utils/InstancedSkeletonUtils'
import { Container } from './Container'
import { CylinderSkinnedMesh } from './CylinderSkinnedMesh'
import { CylinderInstancedSkinnedMesh } from './CylinderInstancedSkinnedMesh'
import ChiBakun from './model.glb'

const canvas = document.getElementById('canvas')
assertIsDefined(canvas)
const container = new Container({
    canvas,
  }),
  assetLoader = new AssetLoader({})
// mesh = new CylinderSkinnedMesh(container.scene),
// mesh = new CylinderInstancedSkinnedMesh(container.scene, 10),
// skeletonHelper = new SkeletonHelper(mesh)

// ;(skeletonHelper.material as LineBasicMaterial).linewidth = 2
// container.scene.add(skeletonHelper)

async function setup() {
  assetLoader.addResources([{ name: 'model', path: ChiBakun }])
  await assetLoader.load()

  const { scene, animations } = assetLoader.models['model'] as any,
    object = scene.getObjectByName('Armature')
  // object.updateMatrixWorld(true)
  const instancedObject = InstancedSkeletonUtils.convertToInstancedObject(object, 1)
  // instancedObject = object,
  // skeletonHelper = new SkeletonHelper(instancedObject)
  // skeletonHelper = new SkeletonHelper(object)

  const hipsBone0 = object.getObjectByName('mixamorigHips'),
    hipsBone = instancedObject.getObjectByName('mixamorigHips')

  console.log('model', { hipsBone0: hipsBone0.position.x, hipsBone: hipsBone.position.x })

  container.scene.add(object)
  container.scene.add(instancedObject)
  // instancedObject.position.x = 5
  // ;(skeletonHelper.material as LineBasicMaterial).linewidth = 2
  // container.scene.add(skeletonHelper)

  // instancedObject.traverse((object: Object3D) => {
  //   if ((object as any).isMesh) {
  //     ;(object as Mesh).material = new MeshBasicMaterial({
  //       map: ((object as Mesh).material as any).map,
  //     })
  //   }
  // })

  // await wait(3000)

  // const mixer = new AnimationMixer(instancedObject),
  const mixer = new AnimationMixer(object),
    idleAction = mixer.clipAction(animations[0]),
    runningAction = mixer.clipAction(animations[1])

  runningAction.play()

  // const matrix = new Matrix4()
  // for (let i = 0; i < mesh.count; i++) {
  //   matrix.identity()
  //   matrix.makeRotationY(Math.PI * 2 * Math.random())
  //   matrix.setPosition((0.5 - Math.random()) * 10, 0, (0.5 - Math.random()) * 10)
  //   mesh.setMatrixAt(i, matrix)
  // }

  let previousTime = 0

  container.renderer.setAnimationLoop((time: number) => {
    // mesh.update(time)
    const dt = (time - previousTime) / 10000
    mixer.update(dt)
    container.render()

    previousTime = time
  })
  resize()

  window.addEventListener('resize', resize)
}

function resize() {
  container.resize()
}

setup()
