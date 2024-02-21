import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import SolarSystem from './src/SolarSystem'

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
scene.add(axesHelper)

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

const light = new THREE.AmbientLight(0xffffff, 1.5)
const pointLight = new THREE.PointLight(0xffff55, 4.5)

pointLight.position.y = 3

scene.add(light, pointLight)

scene.background = new THREE.Color(0x111111)

// system
const system = new SolarSystem({ scene, camera })
// system.initUI('#ui-root', true)
scene.add(system)

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

	if (system.selected) {
		system.selected.getWorldPosition(_V)

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

	system.update(deltaTime)

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
