import GUI from 'lil-gui'
import { Object3D, Vector3 } from 'three'
const COS = Math.cos
const SIN = Math.sin

const _V = new Vector3()

export default class Body extends Object3D {
	offset = Math.random() * 1000
	time = 0
	// mesh of celestial body
	mesh = null
	speed = 1
	spin = 5 + Math.random() * 5

	constructor(name, system = null) {
		super()
		this.name = name
		this.parentSystem = system
	}

	initGUI() {
		this.gui = new GUI()
		this.gui.hide()

		this.gui
			.add(this, 'name')
			.name('Name')
			.onChange((val) => {
				this.updateName(val)
			})

		if (this.mesh) {
			this.gui.addColor(this.mesh.material, 'color').name('Color')
		}

		if (this.radius) {
			this.gui
				.add(this, 'radius', 0.1, 3, 0.01)
				.name('Radius')
				.onChange((val) => {
					this.updateRadius(val)
				})
		}

		if (this.radius) {
			this.gui.add(this, 'spin', -50, 50, 0.01).name('Spin')
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
	}

	update(time) {
		time += this.offset
		const dt = time - this.time
		this.time = time * this.speed
		this.mesh.rotation.y += dt * Math.PI * 2 * this.spin
		if (this.orbit) {
			const progress = this.time % this.orbit.period
			let angleU = Math.PI * 2 * progress

			const x = this.orbit.a * COS(angleU)
			const z = this.orbit.b * SIN(angleU)

			const angleE = -Math.atan(z / x) * 2

			// console.log(progress, this.orbit.period)

			this.position.x = this.orbit.a * COS(angleE) + this.orbit.c
			this.position.z = this.orbit.b * SIN(angleE)
		}

		if (this.system) {
			this.system.entities.forEach((el) => el.update(time))
		}
	}

	getWPosition() {
		this.getWorldPosition(_V)
		return _V
	}
}
