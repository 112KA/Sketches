#define delta ( 1.0 / 60.0 )

void main() {
    if(gl_FragCoord.x <= 1.0){
        vec2 uv = gl_FragCoord.xy / resolution.xy;

        vec4 tmpPos = texture2D( texturePosition, uv );
        vec3 pos = tmpPos.xyz;

        vec4 tmpVel = texture2D( textureVelocity, uv );
        vec3 vel = tmpVel.xyz;

        // Dynamics
        pos += vel * delta;

        gl_FragColor = vec4( pos, 1.0 );
    }
    else {
        vec2 uv = (gl_FragCoord.xy - vec2(1.0,0.0)) / resolution.xy;
        vec3 pos = texture2D( texturePosition, uv ).xyz;  
        gl_FragColor = vec4( pos, 1.0 );
    }
    
}