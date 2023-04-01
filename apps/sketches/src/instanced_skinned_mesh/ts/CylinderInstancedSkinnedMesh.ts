import { DoubleSide, MeshPhongMaterial, Object3D } from 'three'
import { InstancedSkinnedMesh } from 'x3/objects/InstancedSkinnedMesh'
import { InstancedSkinnedMeshPhongMaterial } from 'x3/materials/InstancedSkinnedMeshPhongMaterial'
import { SampleGeometry } from './SampleGeometry'
import { SampleInstancedSkeleton } from './SampleInstancedSkeleton'

export class CylinderInstancedSkinnedMesh extends InstancedSkinnedMesh {
  constructor(parent: Object3D, count: number) {
    const geometry = new SampleGeometry()

    const material = new InstancedSkinnedMeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: DoubleSide,
      flatShading: true,
    })

    super(geometry, material, count)

    parent.add(this)

    const skeleton = new SampleInstancedSkeleton(this.count)

    this.add(skeleton.bones[0])

    this.bind(skeleton)
  }

  update(time: number) {
    const rotationZ = (Math.sin(time / 1000) * 2) / this.skeleton.bones.length
    for (let i = 0; i < this.skeleton.bones.length; i++) {
      this.skeleton.bones[i].rotation.z = rotationZ
    }

    // ;(this.skeleton as InstancedSkeleton).updateAt(0)
  }
}
