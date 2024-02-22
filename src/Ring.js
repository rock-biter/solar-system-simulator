import {
	DoubleSide,
	Mesh,
	MeshStandardMaterial,
	Object3D,
	RingGeometry,
	Vector3,
} from 'three'
const _V = new Vector3()

export default class Ring extends Object3D {
	constructor(innerRadius, outerRadius) {
		super()

		this.innerRadius = innerRadius
		this.outerRadius = outerRadius
		this.geometry = this.createRingGeometry()
		this.material = new MeshStandardMaterial({
			color: Math.random() * 0xffffff,
			side: DoubleSide,
		})

		this.mesh = new Mesh(this.geometry, this.material)
		this.add(this.mesh)
	}

	createRingGeometry(innerRadius, outerRadius) {
		const geometry = new RingGeometry(innerRadius, outerRadius, 30, 1)
		geometry.rotateX(-Math.PI * 0.5)
		return geometry
	}

	updateGeometry(innerRadius, outerRadius) {
		this.geometry?.dispose()
		this.geometry = this.createRingGeometry(innerRadius, outerRadius)

		this.mesh.geometry = this.geometry
	}

	initGui() {
		console.log('init GUI')
	}

	getWPosition() {
		this.getWorldPosition(_V)
		return _V
	}

	update() {}
}
