attribute float instanceIndex;

uniform sampler2D texturePosition;
uniform float size;

varying vec3 vWorldPosition;

void main() {
  
  vec2 textureUv;
  textureUv.x = mod(instanceIndex, (size - 1.));
  textureUv.y = float(instanceIndex / (size -1.));
  textureUv /= (size - 1.);
  
  vec4 positionInfo = texture2D( texturePosition, textureUv );

  vec4 worldPosition = modelMatrix * vec4( positionInfo.xyz, 1.0 );
  vec4 mvPosition = viewMatrix * worldPosition;
  // mvPosition += vec4(position.xyz * smoothstep(0.0, 0.2, positionInfo.w), 0.0);
  mvPosition += vec4(position.xyz * smoothstep(0.0, 1.0, positionInfo.w), 0.0);
  // mvPosition += vec4(position, 0.0);

  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}