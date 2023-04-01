import { Bone } from 'three'
import { InstancedSkeleton } from 'x3/objects/InstancedSkeleton'
import { sizing } from './SampleGeometry'

export class SampleInstancedSkeleton extends InstancedSkeleton {
  constructor(count: number) {
    const bones: Bone[] = []

    let prevBone = new Bone()
    bones.push(prevBone)
    prevBone.position.y = -sizing.halfHeight

    for (let i = 0; i < sizing.segmentCount; i++) {
      const bone = new Bone()
      bone.position.y = sizing.segmentHeight
      bones.push(bone)
      prevBone.add(bone)
      prevBone = bone

      console.log({ bone })
    }
    bones[0].updateMatrixWorld(true)

    super(bones, [], count)
  }
}
