import GUI from 'lil-gui'
import { Object3D, Vector3 } from 'three'
const COS = Math.cos
const SIN = Math.sin

const _V = new Vector3()

export default class Body extends Object3D {
	offset = Math.random() * 1000
	time = 0
	localTime = 0
	// mesh of celestial body
	mesh = null
	speed = 1
	spin = 5 + Math.random() * 5
	spinScalar = 1
	progress = Math.random()

	guiParams = {
		radius: 'Radius',
		name: 'Name',
		color: 'Color',
		spin: 'Spin',
	}

	constructor(name, system = null) {
		super()
		this.name = name
		this.parentSystem = system
		this.time = this.offset
	}

	initGUI(gui) {
		this.gui = gui || new GUI()
		this.gui.hide()

		if (this.guiParams.name) {
			this.gui
				.add(this, 'name')
				.name(this.guiParams.name)
				.onChange((val) => {
					this.updateName(val)
				})
		}

		if (this.mesh && this.guiParams.color) {
			this.gui.addColor(this.mesh.material, 'color').name(this.guiParams.color)
		}

		if (this.radius && this.guiParams.radius) {
			let min = 0.1
			let max = 3

			if (this.type === 'moon') {
				min = 0.05
				max = 0.5
			}

			this.gui
				.add(this, 'radius', min, max, 0.01)
				.name(this.guiParams.radius)
				.onChange((val) => {
					this.updateRadius(val)
				})
		}

		if (this.radius && this.guiParams.spin) {
			this.gui.add(this, 'spin', -50, 50, 0.01).name(this.guiParams.spin)
		}

		if (this.orbit) {
			this.orbit.iniGUI(this.gui)
		}
	}

	updateRadius(radius) {
		this.mesh.scale.setScalar(radius)
		if (this.system) {
			this.system.orbitStart = radius
		}
	}

	updateName(val) {
		this.uiButton.querySelector('span').innerText = val
		this.gui.title(val)
	}

	addSystem(system) {
		system.head = this
		this.system = system
		this.add(this.system)
	}

	addOrbit(orbit) {
		this.orbit = orbit
		orbit.body = this
		this.orbit.add(this)
	}

	addMesh(mesh) {
		this.add(mesh)
		this.mesh = mesh

		this.mesh.userData.entity = this
	}

	update(dt) {
		// time += this.offset
		// const dt = time - this.time
		this.time += dt * this.speed
		this.mesh.rotation.y += dt * Math.PI * 2 * this.spin * this.spinScalar

		if (this.orbit) {
			const progress = dt % this.orbit.period
			this.progress += progress
			let angleU = Math.PI * 2 * this.progress

			const x = this.orbit.a * COS(angleU)
			const z = this.orbit.b * SIN(angleU)

			const angleE = -Math.atan(z / x) * 2

			// console.log(progress, this.orbit.period)

			this.position.x = this.orbit.a * COS(angleE) + this.orbit.c
			this.position.z = this.orbit.b * SIN(angleE)
		}

		if (this.system) {
			this.system.entities.forEach((el) => el.update(dt))
		}
	}

	getWPosition() {
		this.getWorldPosition(_V)
		return _V
	}

	dispose() {
		// dispose all geometry and material
		console.log('DISPOSE', this.name)
	}
}
