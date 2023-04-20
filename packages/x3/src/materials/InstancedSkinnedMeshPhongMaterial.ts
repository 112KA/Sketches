import {
  DoubleSide,
  MeshPhongMaterial,
  MeshPhongMaterialParameters,
  Shader,
  WebGLRenderer,
} from 'three'

import skinning_pars_vertex from 'x3/renderers/shaders/ShaderChunk/skinning_pars_vertex.glsl'

export class InstancedSkinnedMeshPhongMaterial extends MeshPhongMaterial {
  onBeforeCompile(shader: Shader, renderer: WebGLRenderer): void {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <skinning_pars_vertex>\n',
      skinning_pars_vertex,
    )
    console.log('[InstancedSkinnedMeshPhongMaterial]', 'onBeforeCompile', {
      vertexShader: shader.vertexShader,
    })
  }
}
