import {
	IcosahedronGeometry,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
} from 'three'

export default class Star extends Mesh {
	constructor(r = 1) {
		const geometry = new IcosahedronGeometry(1, 1)
		const material = new MeshStandardMaterial({ color: 'yellow' })

		super(geometry, material)

		this.scale.setScalar(r)
	}

	update(time) {}
}
