import { Color, IcosahedronGeometry, Mesh, MeshStandardMaterial } from 'three'
import Body from './Body'

const GEOMETRY = new IcosahedronGeometry(1, 1)

export default class Planet extends Body {
	speed = 1

	constructor({
		orbit,
		radius = 0.3 + Math.random() * 0.5,
		name = '',
		system,
	}) {
		const geometry = GEOMETRY
		const material = new MeshStandardMaterial({
			color: new Color(Math.random() * 0xffffff),
			flatShading: true,
		})

		const mesh = new Mesh(geometry, material)
		super(name, system)

		this.radius = radius
		mesh.scale.setScalar(this.radius)
		this.addOrbit(orbit)
		this.addMesh(mesh)

		this.name =
			'P' + (Math.random() * 1000).toString(16).slice(0, 3).toUpperCase()
	}
}
