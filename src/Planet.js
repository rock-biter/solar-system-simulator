import { Color, IcosahedronGeometry, Mesh, MeshStandardMaterial } from 'three'

const GEOMETRY = new IcosahedronGeometry(1, 1)
const COS = Math.cos
const SIN = Math.sin

export default class Planet extends Mesh {
	constructor(orbit, r = 1) {
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

		this.scale.setScalar(r)
	}

	update(time) {
		time += this.offset
		time *= 0.1
		const progress = time % this.orbit.period
		// this is not mathematically correct
		let speed = (1 - COS(progress * Math.PI * 2) * 0.5 + 0.5) * 0.1
		this.position.x =
			this.orbit.a * COS(Math.PI * 2 * (progress + speed)) + this.orbit.c
		this.position.z = this.orbit.b * SIN(Math.PI * 2 * (progress + speed))
	}
}
