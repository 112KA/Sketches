import {
  NoBlending,
  ShaderMaterial,
  ShaderMaterialParameters,
  UniformsLib,
  UniformsUtils,
  Vector3,
} from 'three'

export class ParticleDistanceMaterial extends ShaderMaterial {
  public referencePosition: Vector3 = new Vector3()
  public isMeshDistanceMaterial = true

  constructor(params: ShaderMaterialParameters = {}) {
    params.uniforms = UniformsUtils.merge([
      {
        texturePosition: { type: 't', value: undefined },
        referencePosition: { type: 'v3', value: new Vector3() },
        nearDistance: { type: 'f', value: 10 },
        farDistance: { type: 'f', value: 1000 },
        size: { type: 'f', value: 0 },
      },
      UniformsLib.common,
    ])
    params.blending = NoBlending
    super(params)
  }
}
