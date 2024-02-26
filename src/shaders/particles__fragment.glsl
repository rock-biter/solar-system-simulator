uniform float uTime;
varying vec3 vPosition;
varying vec3 vColor;
varying vec3 vCameraPosition;
varying float vSize;

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main()
{
  float strength = distance(gl_PointCoord, vec2(0.5));
    // strength *= 2.0;
    strength = smoothstep(0.7,0.8,1.0 - strength);
    float n = noise(vec3(uTime * 0.0005 + length(vPosition))) * 0.5 + 0.5;
		gl_FragColor = vec4(mix(mix(vec3(0.8,0.5,0.9),vColor,0.5),vec3(1.),0.3) * n,strength) * (n) * (1.1 - pow(vSize,2.) );
}