import { Object3D } from 'three'
const COS = Math.cos
const SIN = Math.sin

export default class Body extends Object3D {
	time = 0
	// mesh of celestial body
	mesh = null

	constructor(radius, system = null) {
		super()
		this.parentSystem = system
		this.radius = radius
	}

	addSystem(system) {
		this.system = system
	}

	addOrbit(orbit) {
		this.orbit = orbit
	}

	addMesh(mesh) {
		mesh.scale.setScalar(this.radius)
		this.add(mesh)
		this.mesh = mesh
	}

	update(time) {
		this.time = time
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
			this.system.entities.forEach((el) => el.update(this.time))
		}
	}
}
