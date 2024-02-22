#include <color_fragment>

float pct = noise(length(vPosition.xz) * uScale + uOffset);
// diffuseColor.rgb *= noise(vec2(vPosition.xz )) + 0.25;

diffuseColor.a = step(uHeight,pct);