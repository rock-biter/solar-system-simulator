import {
	IcosahedronGeometry,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
} from 'three'
import Body from './Body'

export default class Star extends Body {
	constructor(radius = 1, name = '') {
		const geometry = new IcosahedronGeometry(1, 1)
		const material = new MeshBasicMaterial({ color: 'yellow' })

		const mesh = new Mesh(geometry, material)
		super(name)

		this.radius = radius
		mesh.scale.setScalar(this.radius)
		this.addMesh(mesh)
	}
}
