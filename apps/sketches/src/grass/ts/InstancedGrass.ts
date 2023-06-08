import {
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  DoubleSide,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Matrix4,
  Mesh,
  Object3D,
  Quaternion,
  RepeatWrapping,
  ShaderMaterial,
  TextureLoader,
  Vector3,
  Vector4,
} from 'three'
import { InstancedGrassShader } from './glsl'

import { TWO_PI } from '@112ka/x'

const BLADE_WIDTH = 0.1
const BLADE_HEIGHT = 0.8
const BLADE_HEIGHT_VARIATION = 0.6
const BLADE_VERTEX_COUNT = 5
const BLADE_TIP_OFFSET = 0.1

const Y_AXIS = new Vector3(0, 1, 0)

function interpolate(val: number, oldMin: number, oldMax: number, newMin: number, newMax: number) {
  return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
}

class GrassGeometry extends InstancedBufferGeometry {
  constructor(instanceCount: number) {
    super()

    this.instanceCount = instanceCount

    const positions = []
    const indices = []

    const blade = this.computeBlade()
    positions.push(...blade.positions)
    indices.push(...blade.indices)

    this.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
    this.setIndex(indices)
    // this.computeVertexNormals()
  }

  // Grass blade generation, covered in https://smythdesign.com/blog/stylized-grass-webgl
  // TODO: reduce vertex count, optimize & possibly move to GPU
  computeBlade() {
    const height = BLADE_HEIGHT

    // Calc bottom, middle, and tip vertices
    const bl = [(BLADE_WIDTH / 2) * 1, 0, 0]
    const br = [(BLADE_WIDTH / 2) * -1, 0, 0]
    const tl = [(BLADE_WIDTH / 4) * 1, height / 2, 0]
    const tr = [(BLADE_WIDTH / 4) * -1, height / 2, 0]
    const tc = [0, height, 0]

    return {
      positions: [...bl, ...br, ...tr, ...tl, ...tc],
      indices: [0, 1, 2, 2, 4, 3, 3, 0, 2],
    }
  }
}

import cloudImage from '../cloud.jpg'
const cloudTexture = new TextureLoader().load(cloudImage)
cloudTexture.wrapS = cloudTexture.wrapT = RepeatWrapping

export class InstancedGrass extends Mesh {
  constructor(parent: Object3D, size: number, instanceCount: number) {
    const geometry = new GrassGeometry(instanceCount)
    const material = new ShaderMaterial({
      uniforms: {
        uCloud: { value: cloudTexture },
        uTime: { value: 0 },
      },
      side: DoubleSide,
      vertexShader: InstancedGrassShader.vertex,
      fragmentShader: InstancedGrassShader.fragment,
    })
    super(geometry, material)

    const instanceMatrices = [],
      tmpPosition = new Vector3(),
      tmpQuaternion = new Quaternion(),
      tmpScale = new Vector3(),
      tmpMatrix = new Matrix4()
    const offsetPositions = []
    const uvs = []

    for (let i = 0; i < instanceCount; i++) {
      const surfaceMin = (size / 2) * -1
      const surfaceMax = size / 2
      const radius = (size / 2) * Math.random()
      const theta = Math.random() * 2 * Math.PI

      const x = radius * Math.cos(theta)
      const y = radius * Math.sin(theta)
      tmpPosition.set(x, 0, y)
      tmpQuaternion.setFromAxisAngle(Y_AXIS, TWO_PI * Math.random())
      const height = BLADE_HEIGHT + Math.random() * BLADE_HEIGHT_VARIATION
      tmpScale.set(1, height, 1)

      tmpMatrix.compose(tmpPosition, tmpQuaternion, tmpScale)
      instanceMatrices.push(...tmpMatrix.elements)

      offsetPositions.push(x, 0, y)

      uvs.push(
        interpolate(x, surfaceMin, surfaceMax, 0, 1),
        interpolate(y, surfaceMin, surfaceMax, 0, 1),
      )
    }

    console.log({ instanceMatrices })

    geometry.setAttribute(
      'offsetPosition',
      new InstancedBufferAttribute(new Float32Array(offsetPositions), 3),
    )
    geometry.setAttribute(
      'instanceMatrix',
      new InstancedBufferAttribute(new Float32Array(instanceMatrices), 16),
    )
    geometry.setAttribute('uv', new InstancedBufferAttribute(new Float32Array(uvs), 2))

    parent.add(this)

    const floor = new Mesh(new CircleGeometry(15, 8).rotateX(Math.PI / 2), material)
    floor.position.y = -Number.EPSILON
    this.add(floor)
  }

  update(time: number) {
    ;(this.material as ShaderMaterial).uniforms.uTime.value = time
  }
}
