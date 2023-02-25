uniform sampler2D texturePosition;
// uniform sampler2D textureVelocity;

void main() {
    vec3 pos = texture2D( texturePosition, uv ).xyz;

    // vec4 velTemp = texture2D( textureVelocity, uv );
    // vec3 vel = velTemp.xyz;

    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    gl_Position = projectionMatrix * mvPosition;

    // gl_PointSize = 2.;
}