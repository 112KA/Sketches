
uniform sampler2D texturePosition;
#include <common>
#include <shadowmap_pars_vertex>

void main() {
  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>
  // objectNormal.z = 1.;
  
  vec4 positionInfo = texture2D( texturePosition, uv );

  vec4 worldPosition = modelMatrix * vec4( positionInfo.xyz, 1.0 );
  vec4 mvPosition = viewMatrix * worldPosition;
  mvPosition += vec4(position * smoothstep(0.0, 0.2, positionInfo.w), 0.0);
  // mvPosition += vec4(position, 0.0);

  gl_Position = projectionMatrix * mvPosition;

  // gl_PointSize = 3.0;
  gl_PointSize = 1300.0 / length( mvPosition.xyz );
  // gl_PointSize = 1300.0 / length( mvPosition.xyz ) * smoothstep(0.0, 0.2, positionInfo.w)

  #include <shadowmap_vertex>
}