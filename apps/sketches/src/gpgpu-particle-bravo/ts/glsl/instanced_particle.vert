#include <common>
#include <shadowmap_pars_vertex>

attribute float instanceIndex;
attribute vec3 color;

uniform sampler2D texturePosition;
uniform float size;
uniform float distance;

varying vec3 vColor;
varying float vDistance;

void main() {
  vColor = color;

  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>
  
  vec2 textureUv;
  textureUv.x = mod(instanceIndex, (size - 1.));
  textureUv.y = float(instanceIndex / (size -1.));
  textureUv /= (size - 1.);
  
  vec4 positionInfo = texture2D( texturePosition, textureUv );

  // vec4 worldPosition = modelMatrix * vec4( positionInfo.xyz, 1.0 );
  vec4 worldPosition = modelMatrix * vec4( positionInfo.xyz, 1.0 );
  vec4 mvPosition = viewMatrix * worldPosition;
  vDistance = abs(distance - -mvPosition.z) / distance;
  float scale = 1. + vDistance * 2.0;
  mvPosition += vec4(position * scale * smoothstep(0.0, 1.0, positionInfo.w), 0.0);

  gl_Position = projectionMatrix * mvPosition;

  #include <shadowmap_vertex>
}