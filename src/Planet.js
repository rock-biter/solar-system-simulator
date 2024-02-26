import {
	Color,
	IcosahedronGeometry,
	Mesh,
	MeshStandardMaterial,
	SphereGeometry,
} from 'three'
import Body from './Body'
import Atmosphere from './Atmosphere'

const GEOMETRY = new IcosahedronGeometry(1, 1)

export default class Planet extends Body {
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
			opacity: 0.5,
		})

		const mesh = new Mesh(geometry, material)
		super(name, system)

		this.radius = radius
		mesh.scale.setScalar(this.radius)
		this.addOrbit(orbit)
		this.addMesh(mesh)

		this.name =
			'P' + (Math.random() * 1000).toString(16).slice(0, 3).toUpperCase()

		this.addAtmosphere()
	}

	addAtmosphere() {
		const atmo = new Atmosphere(this.radius * 1.3, this)
		this.atmo = atmo
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
}
