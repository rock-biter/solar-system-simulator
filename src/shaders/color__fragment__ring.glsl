#include <color_fragment>

float pct = noise(vec2(length(vPosition.xz) * 10.));
// diffuseColor.rgb *= noise(vec2(vPosition.xz )) + 0.25;

diffuseColor.a = step(0.2,pct);