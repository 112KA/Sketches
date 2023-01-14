//NOTE: glslifyのTypescript対応は時期バージョンから?
//@see https://github.com/glslify/glslify/pull/145

//TODO: vite-plugin-glslifyのimportでglslify適応するやつのやり方が不明
// ```
// @see https://github.com/KusStar/vite-plugin-glslify#example
// Or you can import files with extensions like *.glsl, *.vert, *.frag, see example.
// ```

export default glsl`
// uniform vec2 resolution;
// uniform sampler2D texturePosition;
uniform sampler2D textureDefaultPosition;
uniform float time;
uniform float speed;
uniform float dieSpeed;
uniform float radius;
uniform float curlSize;
uniform float attraction;
// uniform float rotation;
// uniform float initAnimation;
// uniform vec3 mouse3d;

#pragma glslify: curl = require(./curl4)
// #pragma glslify: rotate = require(./rotate)


// const vec3 yAxis = vec3(0.0, 1.0, 0.0);
// const float PI = 3.14159;

void main() {

  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 positionInfo = texture2D( texturePosition, uv );
  // vec3 position = mix(vec3(0.0, -200.0, 0.0), positionInfo.xyz, smoothstep(0.0, 0.3, initAnimation));
  vec3 position = positionInfo.xyz;
  float life = positionInfo.a - dieSpeed;

  vec3 followPosition = vec3(0., 0., 0.);//mix(vec3(0.0, -(1.0 - initAnimation) * 200.0, 0.0), mouse3d, smoothstep(0.2, 0.7, initAnimation));

  if(life < 0.0) {
      positionInfo = texture2D( textureDefaultPosition, uv );
      position = positionInfo.xyz;
      // position = positionInfo.xyz * (1.0 + sin(time * 15.0) * 0.2 + (1.0 - initAnimation)) * 0.4 * radius;
      // position += followPosition;
      life = 0.5 + fract(positionInfo.w * 21.4131 + time);
  } else {
      vec3 delta = followPosition - position;
      position += delta * (0.005 + life * 0.01) * attraction * (1.0 - smoothstep(50.0, 350.0, length(delta))) *speed;
      position += curl(position * curlSize, time, 0.1 + (1.0 - life) * 0.1) *speed;
      // float mid = 0.5;
      // // float rotation = mod(time / 1000. * 100., PI * 2. * 100.) / 100.;
      // // position = rotate(time/1000., yAxis, position - mid) + mid;
      // position = rotate(rotation, yAxis, position);
  }

  gl_FragColor = vec4(position, life);

}
`
