uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;

uniform vec2 resolution;

varying vec4 vColor;

const float PI = 3.141592653589793;
const vec3 sectionDirection = vec3(1., 0., 0.);
const vec3 sectionNormal = vec3(0., 1., 0.);



highp float atan2(in float y, in float x)
{
    return x == 0.0 ? sign(y) * PI / 2.0 : atan(y, x);
}

highp mat2 rotate(float rad){
    return mat2(cos(rad),sin(rad),-sin(rad),cos(rad));
}

vec4 getQuaternion(vec3 axis, float angle) {
	float halfAngle = angle / 2.;
    float s = sin(halfAngle);

    return vec4(axis.x * s, axis.y * s, axis.z * s, cos( halfAngle ));
}


void main() {
    vec2 uv0 = vec2(uv.x - 1. / resolution.x, uv.y);

    vec3 vel = texture2D( textureVelocity, vec2(0, uv.y) ).xyz;
    vec3 pos = texture2D( texturePosition, uv ).xyz;
    vec3 pos0 = texture2D( texturePosition, uv0 ).xyz;

    float lineWidth = 1. * (1. - uv.x) * pow(length(pos - pos0), 0.8);// * pow(length(vel) / 20.0, 2.);
    vec3 offset = position * lineWidth;


    vec3 direction = normalize(vel);
    vec3 axisVector = cross(sectionNormal, direction);
    axisVector = normalize(axisVector);
    float radians = acos(dot(sectionNormal, direction));
    vec4 quaternion = getQuaternion(axisVector, radians);

    float x = offset.x, y = offset.y, z = offset.z;
    float qx = quaternion.x, qy = quaternion.y, qz = quaternion.z, qw = quaternion.w;

    // calculate quat * vector

    float ix = qw * x + qy * z - qz * y;
    float iy = qw * y + qz * x - qx * z;
    float iz = qw * z + qx * y - qy * x;
    float iw = - qx * x - qy * y - qz * z;

    // calculate result * inverse quat

    offset.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
    offset.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
    offset.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

    vec4 mvPosition = modelViewMatrix * vec4( pos + offset, 1.0 );
    gl_Position = projectionMatrix * mvPosition;

    // vColor = vec4(uv.x, uv.x, uv.x, 1.);
    vColor = vec4(1., 1., 1., 1.);
}