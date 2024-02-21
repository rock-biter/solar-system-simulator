import { Color, IcosahedronGeometry, Mesh, MeshStandardMaterial } from 'three'
import System from './System'

const GEOMETRY = new IcosahedronGeometry(1, 1)
const COS = Math.cos
const SIN = Math.sin

export default class Planet extends System {
	constructor({ orbit, radius = 0.3 + Math.random() * 0.5 }) {
		const geometry = GEOMETRY
		const material = new MeshStandardMaterial({
			flatShading: true,
			color: new Color('white').multiplyScalar(Math.random()),
		})

		const planet = new Mesh(geometry, material)
		planet.radius = radius

		super({ head: planet, orbitGap: 0.5 })
		this.entityType = 'moon'

		this.offset = Math.random() * 1000

		this.orbit = orbit
		planet.orbit = orbit
		this.name =
			(Math.random() * 1000).toString(16).slice(0, 3).toUpperCase() +
			'-' +
			Math.ceil(Math.random() * 10)

		this.radius = radius
		this.head.scale.setScalar(radius)

		this.className += ' system--planet'
	}

	update(time) {
		time += this.offset
		const progress = time % this.orbit.period
		let angleU = Math.PI * 2 * progress

		const x = this.orbit.a * COS(angleU)
		const z = this.orbit.b * SIN(angleU)

		const angleE = -Math.atan(z / x) * 2

		// console.log(progress, this.orbit.period)

		this.position.x = this.orbit.a * COS(angleE) + this.orbit.c
		this.position.z = this.orbit.b * SIN(angleE)

		this.entities.forEach((el) => el.update(this.time))
		// this.position.x = this.orbit.a * COS(angleU) + this.orbit.c
		// this.position.z = this.orbit.b * SIN(angleU)
	}
}
