import {
  BufferGeometry,
  Color,
  InstancedBufferAttribute,
  Material,
  Matrix4,
  Skeleton,
  SkinnedMesh,
} from 'three'
import { assertIsDefined } from 'x/index'
import { InstancedSkeleton } from 'x3/objects/InstancedSkeleton'

const _offsetMatrix = /*@__PURE__*/ new Matrix4()
const _identityMatrix = /*@__PURE__*/ new Matrix4()

export class InstancedSkinnedMesh<
  TGeometry extends BufferGeometry = BufferGeometry,
  TMaterial extends Material | Material[] = Material | Material[],
> extends SkinnedMesh {
  public instanceMatrix: InstancedBufferAttribute
  public instanceColor: InstancedBufferAttribute | null = null

  public isInstancedMesh = true
  public frustumCulled = false

  constructor(geometry: TGeometry, material: TMaterial, public count = 1) {
    super(geometry, material)

    this.instanceMatrix = new InstancedBufferAttribute(new Float32Array(count * 16), 16)

    for (let i = 0; i < count; i++) {
      this.setMatrixAt(i, _identityMatrix)
    }
  }

  copy(source: SkinnedMesh) {
    super.copy(source as any)

    if ((source as InstancedSkinnedMesh).isInstancedMesh) {
      const sourceMesh = source as InstancedSkinnedMesh
      this.instanceMatrix.copy(sourceMesh.instanceMatrix)

      if (sourceMesh.instanceColor !== null) this.instanceColor = sourceMesh.instanceColor.clone()

      this.count = sourceMesh.count
    }

    return this
  }

  bind(skeleton: Skeleton, bindMatrix?: Matrix4) {
    if (!(skeleton instanceof InstancedSkeleton)) {
      console.warn('must extend InstancedSkeleton')
      return
    }

    super.bind(skeleton, bindMatrix)
  }

  getMatrixAt(index: number, matrix: Matrix4) {
    matrix.fromArray(this.instanceMatrix.array, index * 16)
  }

  setMatrixAt(index: number, matrix: Matrix4) {
    matrix.toArray(this.instanceMatrix.array, index * 16)
    this.instanceMatrix.needsUpdate = true
  }

  // setBonesAt(index: number, skeleton: InstancedSkeleton) {
  //   skeleton = skeleton || this.skeleton

  //   skeleton.updateAt(index)
  // }

  getColorAt(index: number, color: Color) {
    assertIsDefined(this.instanceColor)

    color.fromArray(this.instanceColor.array, index * 3)
  }

  setColorAt(index: number, color: Color) {
    if (this.instanceColor === null) {
      this.instanceColor = new InstancedBufferAttribute(
        new Float32Array(this.instanceMatrix.count * 3),
        3,
      )
    }

    color.toArray(this.instanceColor.array, index * 3)
  }
}
