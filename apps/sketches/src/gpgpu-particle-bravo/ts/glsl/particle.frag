
#include <common>
#include <bsdfs>
#include <packing>
// #include <fog_pars_vertex>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

void main() {

  // vec3 outgoingLight = mix(color2, color1, smoothstep(0.0, 0.7, vLife));
  vec3 outgoingLight = vec3(1.,1.,1.);
  float shadowMask = getShadowMask();
    outgoingLight *= shadowMask;//pow(shadowMask, vec3(0.75));
// #include <fog_fragment>
// #include <linear_to_gamma_fragment>
  gl_FragColor = vec4( outgoingLight, 1.0 );
}