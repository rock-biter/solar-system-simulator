#include <color_fragment>

float pct = noise(length(vPosition.xz) * uScale + uOffset);
diffuseColor.rgb *= mod((noise3(vPosition.xyz * 0.1 * uScale + uOffset) *  (0.5 ) + sin(uTime * 30.) * 0.25 + 0.25 ),.2) * 0.6 + 0.4;

// diffuseColor.rgb *= noise3(vPosition.xyz * 30. + uOffset) * (0.2 + sin(uTime * 20.) * 0.1) + 0.7;

diffuseColor.a = step(uHeight,pct) * 0.8;