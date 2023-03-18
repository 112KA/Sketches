import {
  Bone,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  MeshPhongMaterial,
  Object3D,
  Skeleton,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
} from 'three'
import { SampleGeometry, sizing } from './SampleGeometry'
import { SampleSkeleton } from './SampleSkeleton'

export class CylinderSkinnedMesh extends SkinnedMesh {
  constructor(parent: Object3D) {
    const geometry = new SampleGeometry()

    const material = new MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: DoubleSide,
      flatShading: true,
    })

    super(geometry, material)

    parent.add(this)

    const skeleton = new SampleSkeleton()

    this.add(skeleton.bones[0])

    this.bind(skeleton)
  }

  update(time: number) {
    const rotationZ = (Math.sin(time / 1000) * 2) / this.skeleton.bones.length
    for (let i = 0; i < this.skeleton.bones.length; i++) {
      this.skeleton.bones[i].rotation.z = rotationZ
    }
  }
}
