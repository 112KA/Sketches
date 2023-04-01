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
    // console.log({ sourceLookup, cloneLookup })

    // let isCalculate = false
    // source.updateMatrixWorld(true)
    // clone.updateMatrixWorld(true)

    // clone.traverse((node: Object3D) => {
    //   // console.log('traverse', { node })
    //   if (node instanceof InstancedSkinnedMesh) {
    //     const clonedMesh = node
    //     const sourceMesh = sourceLookup.get(node)
    //     const sourceBones = (sourceMesh as SkinnedMesh).skeleton.bones

    //     clonedMesh.skeleton.bones = sourceBones.map((bone: Bone) => {
    //       const clonedBone = cloneLookup.get(bone)
    //       // clonedBone?.matrixWorld.copy(bone.matrixWorld)
    //       // console.log(bone.name, {
    //       //   source: bone.matrixWorld.elements,
    //       //   clone: clonedBone?.matrixWorld.elements,
    //       // })
    //       return clonedBone as Bone
    //     })

    //     // if (!isCalculate) {
    //     clonedMesh.skeleton.calculateInverses()
    //     //   isCalculate = true
    //     // }
    //   }
    //   // else if (node instanceof Bone) {
    //   //   node.updateMatrixWorld(true)
    //   // }
    // })

    // clone.traverse((node: Object3D) => {
    //   if (node instanceof InstancedSkinnedMesh) {
    //     node.skeleton.calculateInverses()
    //   }
    // })

    // console.log({ source, clone })
    // console.log({ source: source.matrixWorld.elements, clone: clone.matrixWorld.elements })
    // let sourceArm = source.getObjectByName('mixamorigHips')
    // let cloneArm = clone.getObjectByName('mixamorigHips')

    // console.log({
    //   source_mixamorigHips: sourceArm,
    //   clone_mixamorigHips: cloneArm,
    // })
    // console.log({
    //   source_mixamorigHips: sourceArm?.matrix.elements,
    //   clone_mixamorigHips: cloneArm?.matrix.elements,
    // })
    // console.log({
    //   source_mixamorigHips_position: sourceArm?.position,
    //   clone_mixamorigHips_position: cloneArm?.position,
    // })

    // sourceArm = source.getObjectByName('mixamorigSpine')
    // cloneArm = clone.getObjectByName('mixamorigSpine')

    // console.log({
    //   source_mixamorigSpine: sourceArm?.matrix.elements,
    //   clone_mixamorigSpine: cloneArm?.matrix.elements,
    // })

    // sourceArm = source.getObjectByName('mixamorigSpine2')
    // cloneArm = clone.getObjectByName('mixamorigSpine2')

    // console.log({
    //   source_mixamorigSpine2: sourceArm?.matrixWorld.elements,
    //   clone_mixamorigSpine2: cloneArm?.matrixWorld.elements,
    // })

    // sourceArm = source.getObjectByName('mixamorigLeftShoulder')
    // cloneArm = clone.getObjectByName('mixamorigLeftShoulder')

    // console.log({
    //   sourceArm: sourceArm?.matrixWorld.elements,
    //   cloneArm: cloneArm?.matrixWorld.elements,
    // })

    // sourceArm = source.getObjectByName('mixamorigLeftArm')
    // cloneArm = clone.getObjectByName('mixamorigLeftArm')

    // console.log({
    //   sourceArm: sourceArm?.matrixWorld.elements,
    //   cloneArm: cloneArm?.matrixWorld.elements,
    // })
    // console.log({
    //   source: source.children[0].skeleton.bones,
    //   clone: clone.children[0].skeleton.bones,
    // })

    return clone
  }

  static replaceInstancedObject(source: Object3D, count: number): Object3D {
    // console.log('convertToInstancedObject', { source, count })
    let clone
    if (source instanceof SkinnedMesh) {
      const { geometry, material } = source
      clone = new InstancedSkinnedMesh(geometry, material, count).copy(source)
      clone.material = new InstancedSkinnedMeshBasicMaterial({ map: material.map })

      const skeleton = new InstancedSkeleton(source.skeleton.bones, [], count)
      clone.bind(skeleton)
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
