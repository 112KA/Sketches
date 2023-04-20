import {
  DoubleSide,
  MeshBasicMaterial,
  MeshBasicMaterialParameters,
  Shader,
  WebGLRenderer,
} from 'three'

import skinning_pars_vertex from 'x3/renderers/shaders/ShaderChunk/skinning_pars_vertex.glsl'

export class InstancedSkinnedMeshBasicMaterial extends MeshBasicMaterial {
  onBeforeCompile(shader: Shader, _renderer: WebGLRenderer): void {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <skinning_pars_vertex>\n',
      skinning_pars_vertex,
    )
  }
}
