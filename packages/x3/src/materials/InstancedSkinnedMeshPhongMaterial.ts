import {
  DoubleSide,
  MeshPhongMaterial,
  MeshPhongMaterialParameters,
  Shader,
  WebGLRenderer,
} from 'three'

const skinning_pars_vertex = `
#ifdef USE_SKINNING

	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;

	uniform highp sampler2D boneTexture;
	uniform int boneTextureSize;

	mat4 getBoneMatrix( const in float i ) {

        #ifdef USE_INSTANCING
            
            int j = 4 * int(i);
            vec4 v1 = texelFetch(boneTexture, ivec2( j, gl_InstanceID ), 0);
            vec4 v2 = texelFetch(boneTexture, ivec2( j + 1, gl_InstanceID ), 0);
            vec4 v3 = texelFetch(boneTexture, ivec2( j + 2, gl_InstanceID ), 0);
            vec4 v4 = texelFetch(boneTexture, ivec2( j + 3, gl_InstanceID ), 0);
            
        #else

            float j = i * 4.0;
            float x = mod( j, float( boneTextureSize ) );
            float y = floor( j / float( boneTextureSize ) );

            float dx = 1.0 / float( boneTextureSize );
            float dy = 1.0 / float( boneTextureSize );

            y = dy * ( y + 0.5 );

            vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
            vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
            vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
            vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );

        #endif

        mat4 bone = mat4( v1, v2, v3, v4 );

        return bone;

	}

#endif
`
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