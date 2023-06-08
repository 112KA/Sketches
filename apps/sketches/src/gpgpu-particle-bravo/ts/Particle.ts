import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  FrontSide,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh,
  Mesh,
  NoBlending,
  NormalBlending,
  Points,
  ShaderMaterial,
  Shape,
  ShapeGeometry,
  Texture,
  UniformsLib,
  UniformsUtils,
  Vector2,
  Vector3,
  WebGLRenderTarget,
} from 'three'
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'

import {
  PositionShader,
  ParticleShader,
  ParticleDistanceShader,
  InstancedParticleShader,
  InstancedParticleDistanceShader,
} from './glsl'

import { ParticleDistanceMaterial } from './ParticleDistanceMaterial'
// import { ShapeSampler } from './ShapeSampler'
import { TextObject } from './TextObject'
import { Container } from './Container'
import { TEXTURE_SIZE } from './Constants'
import { DeviceSize } from '@112ka/x'

const SIZE = TEXTURE_SIZE,
  N_PARTICLES = SIZE * SIZE

export class Particle {
  public mesh: Mesh
  public computeRenderer: GPUComputationRenderer
  private _textList: Record<string, TextObject>
  private _currentText: TextObject

  public positionVariable: Variable

  constructor({ scene, renderer, camera }: Container) {
    // this.mesh = this._createPointMesh();
    // this.mesh = this._createTriangleMesh();
    this.mesh = this._createInstanceMesh()

    scene.add(this.mesh)

    this.computeRenderer = new GPUComputationRenderer(SIZE, SIZE, renderer)

    this._textList = {
      text1: new TextObject('bravo!', scene, this.computeRenderer),
      text2: new TextObject('Japan', scene, this.computeRenderer),
    }

    this._currentText = this._textList.text1
    this._currentText.visible = true

    this.positionVariable = this.computeRenderer.addVariable(
      'texturePosition',
      PositionShader.fragment,
      this._currentText.positionTexture,
    )

    const positionUniform = this.positionVariable.material.uniforms

    positionUniform.textureDefaultPosition = {
      value: this._currentText.positionTexture,
    }
    positionUniform.mouse3d = { value: new Vector3() }
    positionUniform.speed = { value: 1 }
    positionUniform.dieSpeed = { value: 0.02 }
    positionUniform.radius = { value: 0.1 }
    positionUniform.curlSize = { value: 0.01 }
    positionUniform.attraction = { value: -1 }
    // positionUniform.rotation = { value: 0 };
    positionUniform.time = { value: 0 }
    // positionUniform.initAnimation = { value: 0 };

    console.log('positionUniform', positionUniform)

    this.computeRenderer.setVariableDependencies(this.positionVariable, [this.positionVariable])

    let error = this.computeRenderer.init()
    if (error !== null) {
      console.error(error)
    }
  }

  private _createPointMesh(): Points {
    const geometry = new BufferGeometry(),
      material = new ShaderMaterial({
        uniforms: UniformsUtils.merge([
          {
            texturePosition: { type: 't', value: undefined },
          },
          UniformsLib.lights,
        ]),
        vertexShader: ParticleShader.vertex,
        fragmentShader: ParticleShader.fragment,
        lights: true,
        blending: NoBlending,
      }),
      position = new Float32Array(N_PARTICLES * 3),
      uv = new Float32Array(N_PARTICLES * 2),
      normal = new Float32Array(N_PARTICLES * 3)

    // console.log('particleVertexShader', particleVertexShader);

    let u, v
    for (let i = 0; i < N_PARTICLES; i++) {
      u = (i % SIZE) / SIZE
      v = ~~(i / SIZE) / SIZE
      uv.set([u, v], i * 2)
      normal.set([0, 0, -1], i * 3)
    }

    geometry.setAttribute('position', new BufferAttribute(position, 3))
    geometry.setAttribute('uv', new BufferAttribute(uv, 2))
    geometry.setAttribute('normal', new BufferAttribute(normal, 3))

    const mesh = new Points(geometry, material)
    mesh.customDistanceMaterial = new ParticleDistanceMaterial({
      vertexShader: ParticleDistanceShader.vertex,
      fragmentShader: ParticleDistanceShader.fragment,
    })

    // console.log(mesh.customDistanceMaterial);

    mesh.castShadow = true
    mesh.receiveShadow = true

    return mesh
  }

  private _createTriangleMesh(): Mesh {
    const geometry = new BufferGeometry(),
      material = new ShaderMaterial({
        uniforms: UniformsUtils.merge([
          UniformsLib.lights,
          {
            texturePosition: { type: 't', value: undefined },
          },
        ]),
        vertexShader: ParticleShader.vertex,
        fragmentShader: ParticleShader.fragment,
        lights: true,
        blending: NoBlending,
        shadowSide: FrontSide,
      }),
      position = new Float32Array(N_PARTICLES * 3 * 3),
      uv = new Float32Array(N_PARTICLES * 2 * 3),
      normal = new Float32Array(N_PARTICLES * 3 * 3)

    // console.log('UniformsLib', UniformsLib);
    // console.log('particleFragmentShader', particleFragmentShader);

    const { PI, sin, cos } = Math,
      r = (PI * 2) / 3,
      trianglePositions = [
        sin(r * 2 + PI),
        cos(r * 2 + PI),
        0,
        sin(r + PI),
        cos(r + PI),
        0,
        sin(r * 3 + PI),
        cos(r * 3 + PI),
        0,
      ]
    let u, v
    for (let i = 0; i < N_PARTICLES; i++) {
      position.set(trianglePositions, i * 9)

      u = (i % SIZE) / SIZE
      v = ~~(i / SIZE) / SIZE
      uv.set([u, v, u, v, u, v], i * 6)

      normal.set([0, 0, 1, 0, 0, 1, 0, 0, 1], i * 9)
    }

    geometry.setAttribute('position', new BufferAttribute(position, 3))
    geometry.setAttribute('uv', new BufferAttribute(uv, 2))
    geometry.setAttribute('normal', new BufferAttribute(normal, 3))

    const mesh = new Mesh(geometry, material)
    mesh.customDistanceMaterial = new ParticleDistanceMaterial({
      vertexShader: ParticleDistanceShader.vertex,
      fragmentShader: ParticleDistanceShader.fragment,
    })

    mesh.castShadow = true
    mesh.receiveShadow = true

    return mesh
  }

  private _createInstanceMesh(): Mesh {
    const geometry = new InstancedBufferGeometry(),
      material = new ShaderMaterial({
        uniforms: UniformsUtils.merge([
          UniformsLib.lights,
          {
            size: { value: SIZE },
            texturePosition: { value: undefined },
            distance: { value: 1000 },
          },
        ]),
        vertexShader: InstancedParticleShader.vertex,
        fragmentShader: InstancedParticleShader.fragment,
        lights: true,
        transparent: true,
        blending: NormalBlending,
        // blending: AdditiveBlending,
        shadowSide: FrontSide,
      }),
      instanceIndex = new Float32Array(N_PARTICLES * 1),
      color = new Float32Array(N_PARTICLES * 3)

    for (let i = 0; i < N_PARTICLES; i++) {
      instanceIndex[i] = i
      color.set([Math.random(), Math.random(), Math.random()], i * 3)
    }
    const shapePoints = [],
      nShapePoints = 5

    for (let i = 0; i < nShapePoints * 2; i++) {
      const l = i % 2 == 1 ? 1 : 2,
        a = (i / nShapePoints) * Math.PI
      shapePoints.push(new Vector2(Math.cos(a) * l, Math.sin(a) * l))
    }

    const shape = new Shape(shapePoints)

    geometry.copy(new ShapeGeometry(shape))

    geometry.setAttribute('instanceIndex', new InstancedBufferAttribute(instanceIndex, 1, false, 1))
    geometry.setAttribute('color', new InstancedBufferAttribute(color, 3, false, 1))
    geometry.instanceCount = N_PARTICLES

    const mesh = new Mesh(geometry, material)
    mesh.customDistanceMaterial = new ParticleDistanceMaterial({
      vertexShader: InstancedParticleDistanceShader.vertex,
      fragmentShader: InstancedParticleDistanceShader.fragment,
    })

    mesh.castShadow = true
    mesh.receiveShadow = true

    return mesh
  }

  set textObjectKey(key: string) {
    const { uniforms } = this.positionVariable.material
    this._currentText.visible = false

    this._currentText = this._textList[key]
    uniforms.textureDefaultPosition.value = this._currentText.positionTexture
    this._currentText.visible = true
  }

  update(dt: number, time: number) {
    this.positionVariable.material.uniforms.time.value += dt * 0.001
    // this.positionVariable.material.uniforms.rotation.value = 0; //dt * 0.001;
    this.computeRenderer.compute()
    const texture: Texture = this.computeRenderer.getCurrentRenderTarget(
      this.positionVariable,
    ).texture
    ;(this.mesh.material as ShaderMaterial).uniforms.texturePosition.value = texture
    ;(this.mesh.customDistanceMaterial as ShaderMaterial).uniforms.texturePosition.value = texture
  }

  setDeviceSize(deviceSize: DeviceSize) {
    console.log({ deviceSize })
    if (deviceSize === 'sm') {
      ;(this.mesh.material as ShaderMaterial).uniforms.distance.value = 2000
    } else {
      ;(this.mesh.material as ShaderMaterial).uniforms.distance.value = 1000
    }
  }
}
