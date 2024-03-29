import {
	BufferGeometry,
	EllipseCurve,
	Line,
	LineDashedMaterial,
	Object3D,
	Vector3,
} from 'three'
import Planet from './Planet'
import GUI from 'lil-gui'
import Moon from './Moon'
import gsap from 'gsap'
import Star from './Star'

export default class Orbit extends Object3D {
	constructor(system, a, e = 0.15 + Math.random() * 0.2) {
		console.log('A:', a)
		super()
		this.system = system
		this.e = e //+ Math.random() * 0.2
		this.a = a
		this.c = this.e * this.a
		this.b = this.a * Math.sqrt(1 - this.e ** 2)
		this.i = Math.PI * Math.random() * 0.1
		this.r = 0 //Math.PI * Math.random() * 0.1

		this.period = this.a * Math.sqrt(this.a * 0.1)

		this.rotation.order = 'ZYX'
		this.rotateZ(this.i)
		this.rotateY(this.r)

		this.addEllipse()

		// this.iniGUI()
	}

	iniGUI(gui) {
		this.gui = gui || new GUI()
		// this.gui.hide()

		// this.gui.title(this.body.name)
		let maxSemiaxis = this.system.head instanceof Planet ? 6 : 100

		this.gui
			.add(this, 'e', 0, 0.999, 0.01)
			.name('Eccentricity')
			.onChange((val) => this.updateEccentricity(val))

		this.gui
			.add(this, 'a', 0.1, maxSemiaxis, 0.01)
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
		this.updatePOV()
	}

	updatePOV() {
		const camera = this.system.camera

		const pos = this.system.head.getWPosition()
		if (this.system.head instanceof Star) {
			pos.x += 0
			pos.y += 15
			pos.z += 40
		} else {
			pos.x += 0
			pos.y += 5
			pos.z += 12
		}

		gsap.killTweensOf(this.camera)
		gsap.to(camera.position, {
			x: pos.x,
			y: pos.y,
			z: pos.z,
			duration: 2,
		})
		// gsap.to(this.system.camera.position, { x: 0, y: 15, z: 40, duration: 2 })
		// console.log(this.system.camera.userData.controls)
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
