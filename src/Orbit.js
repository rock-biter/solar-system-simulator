import {
	BufferGeometry,
	EllipseCurve,
	Line,
	LineDashedMaterial,
	Object3D,
} from 'three'
import Planet from './Planet'
import GUI from 'lil-gui'
import Moon from './Moon'

export default class Orbit extends Object3D {
	constructor(system, type, a, e = 0.5) {
		super()
		this.system = system
		this.e = e //+ Math.random() * 0.2
		this.a = a
		this.c = this.e * this.a
		this.b = this.a * Math.sqrt(1 - this.e ** 2)
		this.i = Math.PI * Math.random() * 0.1
		this.r = 0 //Math.PI * Math.random() * 0.1
		this.type = type

		this.period = this.a * Math.sqrt(this.a * 0.1)

		switch (type) {
			case 'planet':
				this.createPlanet()
				break
			case 'star':
				// this.createStar()
				break
			case 'moon':
				this.createMoon()
				break
			case 'satellite':
				// this.createSatellite()
				break
		}

		this.rotation.order = 'ZYX'
		this.rotateZ(this.i)
		this.rotateY(this.r)

		this.addEllipse()

		this.iniGUI()
	}

	createPlanet() {
		this.body = new Planet({ orbit: this })
		console.log('planet', this.body)
		this.body.position.x = this.a + this.c
		this.add(this.body)
	}

	createMoon() {
		this.body = new Moon({ orbit: this })
		// console.log(this.body)
		this.body.position.x = this.a + this.c
		this.add(this.body)
	}

	iniGUI() {
		this.gui = new GUI()
		this.gui.hide()

		this.gui.title(this.body.name)

		this.gui
			.add(this, 'e', 0, 0.999, 0.01)
			.name('Eccentricity')
			.onChange((val) => this.updateEccentricity(val))

		this.gui
			.add(this, 'a', 0, 100, 0.01)
			.name('Semiaxis')
			.onChange((val) => this.updateSemiaxis(val))

		this.gui
			.add(this, 'i', -Math.PI, Math.PI, 0.001)
			.name('Rotation Z')
			.onChange((val) => this.updateRotationZ(val))

		this.gui
			.add(this, 'r', -Math.PI, Math.PI, 0.001)
			.name('Rotation Y')
			.onChange((val) => this.updateRotationY(val))

		this.gui
			.add(this.body, 'name')
			.name('Name')
			.onChange((val) => {
				this.updateName(val)
			})

		this.gui
			.add(this.body, 'radius', 0.1, 3, 0.01)
			.name('Radius')
			.onChange((val) => {
				this.body.scale.setScalar(val)
			})
	}

	updateName(val) {
		if (this.body) {
			this.body.uiButton.querySelector('span').innerText = val
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
			opacity: 0.3,
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
