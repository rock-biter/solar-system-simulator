import {
	IcosahedronGeometry,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
} from 'three'

export default class Star extends Mesh {
	constructor(radius = 1) {
		const geometry = new IcosahedronGeometry(1, 1)
		const material = new MeshStandardMaterial({ color: 'yellow' })

		super(geometry, material)
		this.radius = radius
		this.scale.setScalar(radius)
	}

	update(time) {}
}
