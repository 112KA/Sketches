import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Euler,
  Matrix4,
  Object3D,
  Quaternion,
  Vector3,
} from 'three'
import { wait } from '@112ka/x'
import { InstancedSkeleton } from 'x3/objects/InstancedSkeleton'
import { InstancedSkinnedMesh } from 'x3/objects/InstancedSkinnedMesh'

export class InstanceData {
  #enabled = true
  public matrix = new Matrix4()
  #mixer: AnimationMixer
  #instancedObject: Object3D
  #actions: Record<string, AnimationAction> = {}
  #currentAnimationName = ''
  #rootInvertMatrix: Matrix4
  #position: Vector3 = new Vector3((0.5 - Math.random()) * 40, 0, (0.5 - Math.random()) * 40)
  #scale: Vector3 = new Vector3(1, 1, 1)
  constructor(
    public instanceIndex: number,
    instancedObject: Object3D,
    animations: AnimationClip[],
  ) {
    this.#mixer = new AnimationMixer(instancedObject)
    this.#instancedObject = instancedObject

    this.#rootInvertMatrix = this.#instancedObject.matrix.clone().invert()

    // this.#updateMatrix()

    this.#actions['idle'] = this.#mixer.clipAction(animations[0])
    this.#actions['running'] = this.#mixer.clipAction(animations[1])
    this.#changeAnimation()
  }

  public update(dt: number) {
    if (!this.#enabled) return

    if (this.#currentAnimationName === 'running') {
      this.#position.z += 0.06
      if (this.#position.z > 20) this.#position.z = -20
      this.#updateMatrix()
    }

    this.#mixer.update(dt)

    this.#instancedObject.updateMatrixWorld()

    this.#instancedObject.traverse((node: Object3D) => {
      if (node instanceof InstancedSkinnedMesh) {
        node.updateMatrixWorld()
        node.skeleton.bones.forEach(b => {
          b.updateMatrixWorld()
        })
        ;(node.skeleton as InstancedSkeleton).updateAt(this.instanceIndex)
      }
    })
  }

  async #changeAnimation() {
    // console.log('#changeAnimation', 'this.#currentAnimationName:', this.#currentAnimationName)

    switch (this.#currentAnimationName) {
      case '':
        this.#actions['running'].play() //.fadeIn(1000)
        this.#actions['idle'].play()
        this.#actions['idle'].setEffectiveWeight(0)
        this.#currentAnimationName = 'running'
        break
      case 'idle':
        this.executeCrossFade(this.#actions['idle'], this.#actions['running'], 0.5)
        this.#currentAnimationName = 'running'
        break
      case 'running':
        this.executeCrossFade(this.#actions['running'], this.#actions['idle'], 0.5)
        this.#currentAnimationName = 'idle'
        break
    }

    await wait(5000 + 5000 * Math.random())
    this.#changeAnimation()
  }

  executeCrossFade(startAction: AnimationAction, endAction: AnimationAction, duration: number) {
    // Not only the start action, but also the end action must get a weight of 1 before fading
    // (concerning the start action this is already guaranteed in this place)

    this.setWeight(endAction, 1)
    // endAction.time = 0

    // Crossfade with warping - you can also try without warping by setting the third parameter to false

    startAction.crossFadeTo(endAction, duration, false)
  }

  setWeight(action: AnimationAction, weight: number) {
    action.enabled = true
    action.setEffectiveTimeScale(1)
    action.setEffectiveWeight(weight)
  }

  #updateMatrix() {
    // console.log('#updateMatrix', this.#position)
    this.matrix.identity()
    this.matrix.scale(this.#scale)
    this.matrix.setPosition(this.#position.clone().applyMatrix4(this.#rootInvertMatrix))

    // console.log('#updateMatrix', this.matrix)
    this.#instancedObject.traverse((node: Object3D) => {
      if (node instanceof InstancedSkinnedMesh) {
        node.setMatrixAt(this.instanceIndex, this.matrix)
        node.updateMatrix()
      }
    })
  }

  set enabled(v: boolean) {
    this.#enabled = v
    const scale = this.#enabled ? 1 : 0
    this.#scale.setScalar(scale)
    this.#updateMatrix()
  }
}
