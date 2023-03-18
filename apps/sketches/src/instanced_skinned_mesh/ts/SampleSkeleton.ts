import { Bone, Skeleton } from 'three'
import { sizing } from './SampleGeometry'

export class SampleSkeleton extends Skeleton {
  constructor() {
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
    }
    super(bones)
  }
}
