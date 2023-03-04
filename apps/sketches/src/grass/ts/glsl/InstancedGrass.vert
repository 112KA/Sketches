attribute vec3 offsetPosition;
attribute mat4 instanceMatrix;

uniform float uTime;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

float wave(float waveSize, float tipDistance, float centerDistance) {
  // Tip is the fifth vertex drawn per blade
  bool isTip = gl_VertexID == 4;

  float waveDistance = isTip ? tipDistance : centerDistance;
  return sin((uTime / 500.0) + waveSize) * waveDistance;
}

void main() {
  // vPosition = position + offsetPosition;
  vPosition = (instanceMatrix * vec4(position, 1.)).xyz;
  vUv = uv;
  vNormal = normalize(normalMatrix * mat3(instanceMatrix) * vec3(0., 0., 1.));

  if (vPosition.y < 0.1) {
    vPosition.y = 0.0;
  } else {
    vPosition.x += wave(uv.x * 10.0, 0.3, 0.1);      
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}