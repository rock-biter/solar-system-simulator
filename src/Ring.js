import GUI from 'lil-gui'
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
	constructor(innerRadius, outerRadius, i = 0, r = 0) {
		super()

		this.innerRadius = innerRadius
		this.outerRadius = outerRadius + innerRadius
		this.i = i
		this.r = r
		this.geometry = this.createRingGeometry(this.innerRadius, this.outerRadius)
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

	initGUI() {
		console.log('init GUI')

		this.gui = new GUI()
		this.gui.hide()

		if (this.mesh) {
			this.gui.addColor(this.mesh.material, 'color').name('Color')
		}

		this.gui
			.add(this, 'innerRadius', 0, 5, 0.01)
			.name('Inner')
			.onChange((val) => {
				this.updateGeometry(val, this.outerRadius)
			})

		this.gui
			.add(this, 'outerRadius', 0, 5, 0.01)
			.name('Outer')
			.onChange((val) => {
				this.updateGeometry(this.innerRadius, val)
			})

		this.gui
			.add(this.mesh.rotation, 'x', -Math.PI, Math.PI, 0.01)
			.name('Inclination')
		this.gui
			.add(this.mesh.rotation, 'z', -Math.PI, Math.PI, 0.01)
			.name('Rotation')
	}

	getWPosition() {
		this.getWorldPosition(_V)
		return _V
	}

	update() {}
}
