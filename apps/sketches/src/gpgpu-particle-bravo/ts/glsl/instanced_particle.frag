
#include <common>
#include <bsdfs>
#include <packing>
// #include <fog_pars_vertex>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

varying vec3 vColor;
varying float vDistance;

void main() {

  vec3 outgoingLight = vColor;
  float shadowMask = getShadowMask();
    outgoingLight *= shadowMask;//pow(shadowMask, vec3(0.75));
  gl_FragColor = vec4( outgoingLight, (1.04 - clamp(vDistance * 1.5, 0.0, 1.0)) );
  // gl_FragColor = vec4( outgoingLight, 0.1 );
}