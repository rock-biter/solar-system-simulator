import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import Star from './src/Star'
import System from './src/System'

const _V = new THREE.Vector3()

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
camera.position.set(25, 25, 25)
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

const light = new THREE.AmbientLight(0xffffff, 1)
const pointLight = new THREE.PointLight(0xffff55, 10, 100, 0.1)

pointLight.position.y = 0

scene.add(light, pointLight)

scene.background = new THREE.Color(0x111111)

const sun = new Star(2, 'Sole')
scene.add(sun)

const solarSystem = new System({
	camera,
	orbitGap: 5,
	orbitStart: 8,
})
sun.addSystem(solarSystem)

solarSystem.initUI('#ui-root', true)
solarSystem.addEntity('planet', false)
solarSystem.head.initGUI()
camera.worldSpeed = 0.025

// Ambient
const geometry = new THREE.IcosahedronGeometry(10, 3)
const material = new THREE.MeshStandardMaterial({
	color: 0x111111,
	flatShading: true,
})
const count = 100
const backgroundInstanced = new THREE.InstancedMesh(geometry, material, count)

// TODO  persin noise movements
const size = 80
const _Q = new THREE.Quaternion()
const _S = new THREE.Vector3()
const _M = new THREE.Matrix4()
for (let i = 0; i < count; i++) {
	_V.set(
		Math.random() * size * Math.sign(Math.random() - 0.5),
		Math.random() * size * Math.sign(Math.random() - 0.5),
		Math.random() * size * Math.sign(Math.random() - 0.5)
	)

	_S.setScalar(Math.random() * 4)

	const l = _V.length()
	_V.normalize().multiplyScalar(l + 175)

	_M.compose(_V, _Q, _S)

	// m.scale.setScalar(Math.random() * 4)
	backgroundInstanced.setMatrixAt(i, _M)
}

scene.add(backgroundInstanced)

scene.fog = new THREE.Fog(scene.background, 100, 300)

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

	solarSystem.update(deltaTime * camera.worldSpeed)

	renderer.render(scene, camera)

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

// renderer.domElement.addEventListener('click', () => {
// 	system.setSelected()
// })
