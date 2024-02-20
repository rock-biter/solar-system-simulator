import {
	BufferGeometry,
	EllipseCurve,
	Line,
	LineDashedMaterial,
	MeshBasicMaterial,
	Object3D,
} from 'three'
import Planet from './Planet'

export default class Orbit extends Object3D {
	constructor(a, e = 0.5) {
		super()
		this.e = e //+ Math.random() * 0.2
		this.a = a
		this.c = this.e * this.a
		this.b = a * Math.sqrt(1 - this.e ** 2)
		this.i = Math.PI * Math.random() * 0.1
		this.r = 0 //Math.PI * Math.random() * 0.1

		this.planet = new Planet(this, 0.5)

		this.planet.position.x = this.a + this.c
		this.add(this.planet)
		this.rotation.order = 'ZYX'
		this.rotateZ(this.i)
		this.rotateY(this.r)

		this.addEllipse()

		this.period = this.a * Math.sqrt(this.a * 1)
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

		const points = curve.getPoints(50)
		const geometry = new BufferGeometry().setFromPoints(points)
		const material = new LineDashedMaterial({
			linewidth: 2,
			scale: 1,
			dashSize: 0.3,
			gapSize: 0.2,
			color: 0xffffff,
			opacity: 0.5,
			transparent: true,
		})

		geometry.translate(this.c, 0, 0)
		geometry.rotateX(-Math.PI * 0.5)

		this.ellipse = new Line(geometry, material)
		this.ellipse.computeLineDistances()
		this.add(this.ellipse)
	}
}
