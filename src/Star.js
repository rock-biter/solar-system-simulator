import {
	IcosahedronGeometry,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
} from 'three'
import Body from './Body'
import Atmosphere from './Atmosphere'

export default class Star extends Body {
	uniforms = {
		uDensity: { value: 0.2 },
		uBase: { value: 0.5 },
		uPow: { value: 7.8 },
		uTime: { value: 0 },
	}

	constructor(radius = 1, name = '') {
		const geometry = new IcosahedronGeometry(1, 10)
		const material = new MeshBasicMaterial({ color: 'orange' })

		const mesh = new Mesh(geometry, material)
		super(name)

		this.radius = radius
		mesh.scale.setScalar(this.radius)
		this.addMesh(mesh)

		this.addAtmosphere()
	}

	addAtmosphere() {
		const atmo = new Atmosphere(
			this.radius * 1.75,
			this,
			0xfff370,
			this.uniforms
		)
		this.atmo = atmo
		// atmo.mesh.material.color.multiplyScalar(1.3)
		this.add(atmo)
	}

	initGUI() {
		super.initGUI()

		if (this.atmo) {
			const folder = this.gui.addFolder('Atmosphere')
			folder.open()
			this.atmo.initGUI(folder)
		}
	}

	update(dt) {
		// console.log('star update', dt)
		this.uniforms.uTime.value += dt

		super.update(dt)
	}
}
