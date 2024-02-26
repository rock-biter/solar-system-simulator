#include <color_fragment>

// diffuseColor.rgb
// vec3 vNormal = normalize( normalMatrix * normal );
// vec3 tNormal = vec4(vModelMatrix * vec4(-normal,1.)).xyz;
float intensity = pow((uBase + noise(uTime * 400.) * 0.05) - dot(vaNormal,vec3(0,0,1.)), uPow );
// intensity *= max(0.,pow(uBase - dot(vaNormal,vec3(0,0,-1.)), uPow));


diffuseColor.a *= intensity;
diffuseColor.a *= uDensity;