
// uniform vec3 lightPos;
// #define DISTANCE

uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;

#include <common>
#include <packing>

void main () {
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist ); // clamp to [ 0, 1 ]

	gl_FragColor = packDepthToRGBA( dist );
	// gl_FragColor = vec4(0.,0.,0.,1.);
	// gl_FragColor = packDepthToRGBA( 0. );
	// gl_FragColor = packDepthToRGBA( 100./1000. );
}