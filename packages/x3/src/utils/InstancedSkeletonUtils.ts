import { Bone, Object3D, Shader, SkinnedMesh } from 'three'
import { InstancedSkinnedMeshBasicMaterial } from 'x3/materials/InstancedSkinnedMeshBasicMaterial'
import { InstancedSkeleton } from 'x3/objects/InstancedSkeleton'
import { InstancedSkinnedMesh } from 'x3/objects/InstancedSkinnedMesh'

export class InstancedSkeletonUtils {
  static convertToInstancedObject(source: Object3D, count: number): Object3D {
    // console.log('convertToInstancedObject', { source: source.children, clone: clone.children })

    const clone = InstancedSkeletonUtils.replaceInstancedObject(source, count)

    const sourceLookup = new Map<Object3D, Object3D>()
    const cloneLookup = new Map<Object3D, Object3D>()

    InstancedSkeletonUtils.parallelTraverse(
      source,
      clone,
      function (sourceNode: Object3D, clonedNode: Object3D) {
        sourceLookup.set(clonedNode, sourceNode)
        cloneLookup.set(sourceNode, clonedNode)
      },
    )

    clone.traverse((node: Object3D) => {
      // console.log('traverse', { node })
      if (node instanceof InstancedSkinnedMesh) {
        const clonedMesh = node
        const sourceMesh = sourceLookup.get(node)
        const sourceBones = (sourceMesh as SkinnedMesh).skeleton.bones

        clonedMesh.skeleton.bones = sourceBones.map((bone: Bone) => {
          const clonedBone = cloneLookup.get(bone)
          clonedBone?.matrixWorld.copy(bone.matrixWorld)
          return clonedBone as Bone
        })
      }
    })

    return clone
  }

  static replaceInstancedObject(source: Object3D, count: number): Object3D {
    // console.log('convertToInstancedObject', { source, count })
    let clone
    if (source instanceof SkinnedMesh) {
      const { geometry, material } = source
      clone = new InstancedSkinnedMesh(geometry, material, count).copy(source)
      clone.material = new InstancedSkinnedMeshBasicMaterial({ map: material.map })

      const { bones, boneInverses } = source.skeleton,
        skeleton = new InstancedSkeleton(bones, boneInverses, count)
      clone.bind(skeleton, source.bindMatrix)
    } else {
      clone = source.clone(false)
    }

    for (let i = 0; i < source.children.length; i++) {
      const child = InstancedSkeletonUtils.replaceInstancedObject(source.children[i], count)
      clone.add(child)
    }
    return clone
  }

  static parallelTraverse(a: Object3D, b: Object3D, callback: Function) {
    callback(a, b)

    for (let i = 0; i < a.children.length; i++) {
      InstancedSkeletonUtils.parallelTraverse(a.children[i], b.children[i], callback)
    }
  }
}
