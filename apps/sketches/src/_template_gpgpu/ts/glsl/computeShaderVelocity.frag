void main()	{
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 tmpVel = texture2D( textureVelocity, uv );
    vec3 vel = tmpVel.xyz;
    
    gl_FragColor = vec4( vel, 1.0 );
}
