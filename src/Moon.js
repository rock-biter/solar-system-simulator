import { IcosahedronGeometry, Mesh, MeshStandardMaterial } from 'three'
import Body from './Body'

const COS = Math.cos
const SIN = Math.sin

const GEOMETRY = new IcosahedronGeometry(1, 1)

export default class Moon extends Body {
	constructor({ orbit, radius = 0.1 }) {
		const geometry = GEOMETRY
		const material = new MeshStandardMaterial({ color: 'white' })

		const mesh = new Mesh(geometry, material)
		super(radius)

		this.addOrbit(orbit)
		this.addMesh(mesh)

		this.name =
			'M-' + (Math.random() * 1000).toString(16).slice(0, 3).toUpperCase()
	}
}
