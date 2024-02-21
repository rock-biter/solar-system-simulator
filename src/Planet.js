import { Color, IcosahedronGeometry, Mesh, MeshStandardMaterial } from 'three'

const GEOMETRY = new IcosahedronGeometry(1, 1)
const COS = Math.cos
const SIN = Math.sin

export default class Planet extends Mesh {
	constructor(orbit, r = 0.3 + Math.random() * 0.5) {
		const geometry = GEOMETRY
		const material = new MeshStandardMaterial({
			flatShading: true,
			color: new Color('white').multiplyScalar(Math.random()),
		})

		super(geometry, material)

		this.offset = Math.random() * 1000

		this.orbit = orbit
		this.name =
			(Math.random() * 1000).toString(16).slice(0, 3).toUpperCase() +
			'-' +
			Math.ceil(Math.random() * 10)

		this.r = r
		this.scale.setScalar(r)
	}

	update(time) {
		time += this.offset
		time *= 0.05
		const progress = time % this.orbit.period
		let angleU = Math.PI * 2 * progress

		const x = this.orbit.a * COS(angleU)
		const z = this.orbit.b * SIN(angleU)

		const angleE = -Math.atan(z / x) * 2

		// console.log(progress, this.orbit.period)

		this.position.x = this.orbit.a * COS(angleE) + this.orbit.c
		this.position.z = this.orbit.b * SIN(angleE)
		// this.position.x = this.orbit.a * COS(angleU) + this.orbit.c
		// this.position.z = this.orbit.b * SIN(angleU)
	}
}
