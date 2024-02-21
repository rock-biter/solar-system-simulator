import {
	BufferGeometry,
	EllipseCurve,
	Line,
	LineDashedMaterial,
	MeshBasicMaterial,
	Object3D,
} from 'three'
import Planet from './Planet'
import GUI from 'lil-gui'

export default class Orbit extends Object3D {
	constructor(a, e = 0.5) {
		super()
		this.e = e //+ Math.random() * 0.2
		this.a = a
		this.c = this.e * this.a
		this.b = this.a * Math.sqrt(1 - this.e ** 2)
		this.i = Math.PI * Math.random() * 0.1
		this.r = 0 //Math.PI * Math.random() * 0.1

		this.planet = new Planet(this)

		this.planet.position.x = this.a + this.c
		this.add(this.planet)
		this.rotation.order = 'ZYX'
		this.rotateZ(this.i)
		this.rotateY(this.r)

		this.addEllipse()

		this.period = this.a * Math.sqrt(this.a * 0.1)

		this.iniGUI()
	}

	iniGUI() {
		this.gui = new GUI()
		this.gui.hide()

		this.gui.title(this.planet.name)

		this.gui
			.add(this, 'e', 0, 0.999, 0.01)
			.name('Eccentricity')
			.onChange((val) => this.updateEccentricity(val))

		this.gui
			.add(this, 'a', 0, 100, 0.01)
			.name('Semiaxis')
			.onChange((val) => this.updateSemiaxis(val))

		this.gui
			.add(this, 'i', -Math.PI, Math.PI, 0.01)
			.name('Rotation Z')
			.onChange((val) => this.updateRotationZ(val))

		this.gui
			.add(this, 'r', -Math.PI, Math.PI, 0.01)
			.name('Rotation Y')
			.onChange((val) => this.updateRotationY(val))

		this.gui
			.add(this.planet, 'name')
			.name('Name')
			.onChange((val) => {
				this.updateName(val)
			})

		this.gui
			.add(this.planet, 'r', 0.1, 3, 0.01)
			.name('Radius')
			.onChange((val) => {
				this.planet.scale.setScalar(val)
			})
	}

	updateName(val) {
		if (this.planet) {
			this.planet.uiButton.innerHTML = val
			this.gui.title(val)
		}
	}

	updateRotationZ() {
		this.rotation.z = this.i
	}

	updateRotationY() {
		this.rotation.y = this.r
	}

	updateEccentricity() {
		this.updateOrbit()
	}

	updateSemiaxis() {
		this.period = this.a * Math.sqrt(this.a * 1)
		this.updateOrbit()
	}

	updateOrbit() {
		this.c = this.e * this.a
		this.b = this.a * Math.sqrt(1 - this.e ** 2)

		this.addEllipse()
	}

	addEllipse() {
		let curve
		this.ellipseCurve = curve = new EllipseCurve(
			0,
			0,
			this.a,
			this.b,
			0,
			2 * Math.PI
		)

		const points = curve.getPoints(100)
		const geometry = new BufferGeometry().setFromPoints(points)
		const material = new LineDashedMaterial({
			linewidth: 1,
			scale: 1,
			dashSize: 0.3,
			gapSize: 0.2,
			color: 0xffffff,
			opacity: 0.5,
			transparent: true,
		})

		geometry.translate(this.c, 0, 0)
		geometry.rotateX(-Math.PI * 0.5)

		if (this.ellipse) {
			this.remove(this.ellipse)
			this.ellipse.geometry.dispose()
		}

		this.ellipse = new Line(geometry, material)
		this.ellipse.computeLineDistances()
		this.add(this.ellipse)
	}
}
