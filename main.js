import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import Star from './src/Star'
import System from './src/System'
import vertexShader from './src/shaders/particles__vertex.glsl'
import fragmentShader from './src/shaders/particles__fragment.glsl'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import audioSrc from './src/audio/cinematic-universe.mp3'
import gsap from 'gsap'
import Body from './src/Body'

const reycaster = new THREE.Raycaster()

const _V = new THREE.Vector3()

let volume = true
const assets = {
	planeModel: null,
	normalMap: null,
	boatModel: null,
	soundtrack: null,
}
const toggleEl = document.getElementById('sound-toggle')
const playEl = document.getElementById('play')

const loaderManager = new THREE.LoadingManager()

loaderManager.onLoad = () => {
	gsap.to([toggleEl, playEl], { autoAlpha: 1, duration: 1 })

	toggleEl.addEventListener('click', () => {
		volume = !volume

		assets.soundtrack.setVolume(volume ? 0.1 : 0)
		gsap.to(toggleEl, {
			opacity: volume ? 1 : 0.4,
			duration: 0.5,
		})
		// gsap.to(assets.soundtrack, { volume: volume ? 0.1 : 0, duration: 1 })
	})

	playEl.addEventListener('click', () => {
		assets.soundtrack.play()

		gsap.to(playEl, {
			autoAlpha: 0,
			duration: 1,
			onComplete() {
				createSystem()
			},
		})
	})
}

const audioLoader = new THREE.AudioLoader(loaderManager)

audioLoader.load(audioSrc, (buffer) => {
	const listener = new THREE.AudioListener()
	const sound = new THREE.Audio(listener)
	sound.setBuffer(buffer)
	sound.setLoop(true)
	sound.setVolume(0.1)
	assets.soundtrack = sound

	camera.add(listener)
})

/**
 * Debug
 */
// const gui = new dat.GUI()

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * BOX
 */
// const material = new THREE.MeshNormalMaterial()
// const geometry = new THREE.BoxGeometry(1, 1, 1)

// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}
/**
 * Camera
 */
const fov = 60
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)
camera.position.set(0, 25, 25)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))

/**
 * Show the axes of coordinates system
 */
const axesHelper = new THREE.AxesHelper(3)
// scene.add(axesHelper)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
	logarithmicDepthBuffer: true,
})
document.body.appendChild(renderer.domElement)
handleResize()

/**
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
camera.userData.controls = controls
controls.autoRotate = true
controls.autoRotateSpeed = 0.3
controls.maxDistance = 200
controls.minDistance = 10
controls.enablePan = false

// const light = new THREE.AmbientLight(0xffffff, 0.25)
const light = new THREE.AmbientLight(0x451081, 0.5)
const pointLight = new THREE.PointLight(0xffffff, 10, 300, 0.15)

pointLight.position.y = 0

scene.add(light, pointLight)

const background = 0x161616
scene.background = new THREE.Color(background)
scene.fog = new THREE.Fog(background, 100, 300)

let solarSystem

function createSystem() {
	const sun = new Star(2, 'Sole')
	scene.add(sun)

	solarSystem = new System({
		camera,
		orbitGap: 5,
		orbitStart: 8,
	})
	sun.addSystem(solarSystem)
	camera.intersectables.push(sun)

	solarSystem.initUI('#ui-root', true)
	solarSystem.addEntity('planet', false)
	solarSystem.head.initGUI()
}

// createSystem()

camera.worldSpeed = 0.025
camera.intersectables = []

// Ambient
const geometry = new THREE.IcosahedronGeometry(10, 1)
const material = new THREE.MeshStandardMaterial({
	color: 0x201081,
	flatShading: true,
})
const count = 100
const backgroundInstanced = new THREE.InstancedMesh(geometry, material, count)

// TODO  persin noise movements
const size = 60
const _Q = new THREE.Quaternion()
const _S = new THREE.Vector3()
const _M = new THREE.Matrix4()
for (let i = 0; i < count; i++) {
	_V.set(
		Math.random() * size * Math.sign(Math.random() - 0.5),
		Math.random() * size * Math.sign(Math.random() - 0.5),
		Math.random() * size * Math.sign(Math.random() - 0.5)
	)

	_S.setScalar(Math.random() * 0.5)

	const l = _V.length()
	_V.normalize().multiplyScalar(l + 150)

	_M.compose(_V, _Q, _S)

	// m.scale.setScalar(Math.random() * 4)
	backgroundInstanced.setMatrixAt(i, _M)
}

scene.add(backgroundInstanced)

// universe particles
const particlesCount = 15000
const position = new THREE.BufferAttribute(
	new Float32Array(particlesCount * 3),
	3
)
const color = new THREE.BufferAttribute(new Float32Array(particlesCount * 3), 3)
const colors = [
	[1, 1, 0.3],
	[1, 0.2, 0.3],
	[0.3, 0.2, 0.9],
]

const particleGeometry = new THREE.BufferGeometry()
for (let i = 0; i < particlesCount; i++) {
	const x = Math.random() * 1000 - 500
	let y = Math.random() * 1000 - 500
	const z = Math.random() * 1000 - 500

	if (i < particlesCount * 0.6) {
		y *= 0.05
		y += Math.sin(x * 0.01) * 25 + Math.cos(z * 0.01) * 25
	}

	const col = colors[Math.floor(Math.random() * colors.length)]

	color.setXYZ(i, ...col)
	position.setXYZ(i, x, y, z)
}
position.needsUpdate = true
color.needsUpdate = true
particleGeometry.setAttribute('position', position)
particleGeometry.setAttribute('color', color)

const particlesMaterial = new THREE.ShaderMaterial({
	vertexColors: true,
	blending: THREE.AdditiveBlending,
	transparent: true,
	depthWrite: false,
	uniforms: {
		uTime: {
			value: 0,
		},
	},
	vertexShader,
	fragmentShader,
})

const points = new THREE.Points(particleGeometry, particlesMaterial)
points.rotation.z = Math.PI * 0.05
scene.add(points)

/**
 * Post processing
 */
const effectComposer = new EffectComposer(renderer)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

/**
 * Three js Clock
 */
const clock = new THREE.Clock()

/**
 * frame loop
 */
function tic() {
	/**
	 * tempo trascorso dal frame precedente
	 */
	const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	const time = clock.getElapsedTime()

	particlesMaterial.uniforms.uTime.value = time

	if (camera.focusBody) {
		_V.copy(camera.focusBody.getWPosition())

		// camera.position.lerp(_V.clone().add(new THREE.Vector3(5, 5, 5)), 0.08)
		controls.target.lerp(_V, 0.08)
		controls.object.zoom = THREE.MathUtils.lerp(controls.object.zoom, 2, 0.05)
	} else {
		controls.target.lerp(new THREE.Vector3(), 0.02)
		controls.object.zoom = THREE.MathUtils.lerp(controls.object.zoom, 1, 0.02)
		// camera.position.lerp(new THREE.Vector3(20, 20, 20), 0.02)
	}
	controls.object.updateProjectionMatrix()
	controls.update()

	solarSystem?.update(deltaTime * camera.worldSpeed)

	// renderer.render(scene, camera)
	effectComposer.render()

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', handleResize)

function handleResize() {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}

let mouse = new THREE.Vector2()

renderer.domElement.addEventListener('mousedown', (e) => {
	mouse.x = 2 * (e.clientX / window.innerWidth) - 1
	mouse.y = -2 * (e.clientY / window.innerHeight) + 1
})

renderer.domElement.addEventListener('mouseup', (e) => {
	const x = 2 * (e.clientX / window.innerWidth) - 1
	const y = -2 * (e.clientY / window.innerHeight) + 1
	let m = new THREE.Vector2(x, y)
	const l = m.sub(mouse).length()

	reycaster.setFromCamera(mouse, camera)

	console.log(camera.intersectables)
	let intersect
	if (camera.intersectables.length) {
		const intersects = reycaster.intersectObjects(camera.intersectables)
		console.log(intersects)

		intersect = intersects.find((el) => el.object?.userData?.entity)
		console.log(intersect)
	}

	if (intersect) {
		solarSystem.setSelected(intersect.object.userData?.entity)
	} else if (l < 0.002) {
		if (camera.focusBody) {
			solarSystem.setSelected(camera.focusBody)
		}
	}
})
