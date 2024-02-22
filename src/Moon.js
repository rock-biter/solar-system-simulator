import { IcosahedronGeometry, Mesh, MeshStandardMaterial } from 'three'
import Body from './Body'

const GEOMETRY = new IcosahedronGeometry(1, 1)

export default class Moon extends Body {
	speed = 1

	constructor({ orbit, radius = 0.1, name = '', system }) {
		const geometry = GEOMETRY
		const material = new MeshStandardMaterial({
			color: Math.random() * 0xffffff,
		})

		const mesh = new Mesh(geometry, material)
		super(name, system)

		this.radius = radius
		mesh.scale.setScalar(this.radius)
		this.addOrbit(orbit)
		this.addMesh(mesh)

		this.name =
			'M-' + (Math.random() * 1000).toString(16).slice(0, 3).toUpperCase()
	}
}
