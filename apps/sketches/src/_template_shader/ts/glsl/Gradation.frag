uniform vec2 resolution;//画面サイズ
uniform float time;//時間

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    float r = abs(sin(time * 0.1));
    gl_FragColor = vec4(st.x, st.y, r, 1.0);
    // gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}