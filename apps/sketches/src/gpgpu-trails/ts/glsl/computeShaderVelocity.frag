void main()	{
    if(gl_FragCoord.x >= 1.0) return; 
    
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 tmpVel = texture2D( textureVelocity, uv );
    vec3 vel = tmpVel.xyz * 0.95;
    
    gl_FragColor = vec4( vel, 1.0 );
}
