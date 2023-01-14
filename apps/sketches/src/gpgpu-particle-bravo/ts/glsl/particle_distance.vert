uniform sampler2D texturePosition;

varying vec3 vWorldPosition;

void main() {
  
  vec4 positionInfo = texture2D( texturePosition, uv );

  vec4 worldPosition = modelMatrix * vec4( positionInfo.xyz, 1.0 );
  vec4 mvPosition = viewMatrix * worldPosition;
  mvPosition += vec4(position * smoothstep(0.0, 0.2, positionInfo.w), 0.0);
  // mvPosition += vec4(position, 0.0);

  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;

  // gl_PointSize = 1300.0 / length(mvPosition.xyz);
  // gl_PointSize = 1300.0 / length( mvPosition.xyz ) * smoothstep(0.0, 0.2, positionInfo.w);
  gl_PointSize = 1.;

}