import GUI from 'lil-gui'
import {
	DoubleSide,
	Mesh,
	MeshStandardMaterial,
	Object3D,
	RingGeometry,
	Vector3,
} from 'three'
import colorFragmentRing from './shaders/color__fragment__ring.glsl'
import projectVertex from './shaders/project__vertex.glsl'
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
			transparent: true,
		})

		this.mesh = new Mesh(this.geometry, this.material)
		this.add(this.mesh)

		this.material.onBeforeCompile = (shader) => {
			console.log(shader.vertexShader)

			shader.vertexShader = shader.vertexShader.replace(
				'#include <common>',
				`#include <common>
				varying vec3 vWPosition;
				varying vec3 vPosition;
				`
			)

			shader.vertexShader = shader.vertexShader.replace(
				'#include <project_vertex>',
				projectVertex
			)

			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <common>',
				`#include <common>
				varying vec3 vWPosition;
				varying vec3 vPosition;
				float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}
				`
			)

			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <color_fragment>',
				colorFragmentRing
			)
		}
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
