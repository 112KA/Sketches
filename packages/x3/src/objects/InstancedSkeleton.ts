import { Bone, DataTexture, FloatType, MathUtils, Matrix4, RGBAFormat, Skeleton } from 'three'
import { Geometry } from 'x/@types/geometry'

const _offsetMatrix = /*@__PURE__*/ new Matrix4()
const _identityMatrix = /*@__PURE__*/ new Matrix4()

export class InstancedSkeleton extends Skeleton {
  constructor(bones: Bone[] = [], boneInverses: Matrix4[] = [], protected _count = 1) {
    super(bones, boneInverses)

    this.boneMatrices = new Float32Array(bones.length * 16 * this._count)

    // console.log('_count', this._count, this.boneMatrices.length)
  }

  public init() {
    const bones = this.bones
    const boneInverses = this.boneInverses

    // calculate inverse bone matrices if necessary

    if (boneInverses.length === 0) {
      this.calculateInverses()
    } else {
      // handle special case

      if (bones.length !== boneInverses.length) {
        console.warn(
          'THREE.Skeleton: Number of inverse bone matrices does not match amount of bones.',
        )

        this.boneInverses = []

        for (let i = 0, il = this.bones.length; i < il; i++) {
          this.boneInverses.push(new Matrix4())
        }
      }
    }
  }

  computeBoneTexture() {
    // layout (1 matrix = 4 pixels)
    //      RGBA RGBA RGBA RGBA (=> column1, column2, column3, column4)

    const size: Geometry.Size2 = {
      width: this.bones.length * 4,
      height: MathUtils.ceilPowerOfTwo(this._count),
    }
    size.height = Math.max(size.height, 4)

    // console.log({ bonesLength: this.bones.length, size }, size.width * size.height)

    const boneMatrices = new Float32Array(size.width * size.height * 4) // 4 floats per RGBA pixel
    boneMatrices.set(this.boneMatrices) // copy current values

    const boneTexture = new DataTexture(
      boneMatrices,
      size.width,
      size.height,
      RGBAFormat,
      FloatType,
    )
    boneTexture.needsUpdate = true

    this.boneMatrices = boneMatrices
    this.boneTexture = boneTexture
    this.boneTextureSize = size.width

    return this
  }

  public updateAt(instanceIndex: number) {
    const bones = this.bones,
      boneInverses = this.boneInverses,
      boneMatrices = this.boneMatrices,
      boneTexture = this.boneTexture

    // flatten bone matrices to array

    // console.log('updateAt', { bones: this.bones })

    for (let boneIndex = 0, il = bones.length; boneIndex < il; boneIndex++) {
      // compute the offset between the current and the original transform

      const matrix = bones[boneIndex].matrixWorld

      _offsetMatrix.multiplyMatrices(matrix, boneInverses[boneIndex])
      _offsetMatrix.toArray(boneMatrices, 16 * (boneIndex + instanceIndex * bones.length))
    }

    if (boneTexture !== null) {
      boneTexture.needsUpdate = true
    }
  }

  public update() {
    // console.warn('no use')
    // for (let i = 0, il = this._count; i < il; i++) {
    //   this.updateAt(i)
    // }
  }
}
