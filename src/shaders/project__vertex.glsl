vec4 mvPosition = vec4( transformed, 1.0 );
vPosition = mvPosition.xyz;

#ifdef USE_BATCHING

	mvPosition = batchingMatrix * mvPosition;

#endif

#ifdef USE_INSTANCING

	mvPosition = instanceMatrix * mvPosition;

#endif

vWPosition = vec4(modelMatrix * mvPosition).xyz;

mvPosition = modelViewMatrix * mvPosition;

gl_Position = projectionMatrix * mvPosition;