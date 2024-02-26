import GUI from 'lil-gui'
import {
	AdditiveBlending,
	DoubleSide,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	Object3D,
	RingGeometry,
	Vector3,
} from 'three'
import colorFragmentRing from './shaders/color__fragment__ring.glsl'
import projectVertex from './shaders/project__vertex.glsl'
import common from './shaders/common__ring.glsl'
const _V = new Vector3()

export default class Ring extends Object3D {
	speed = 1
	time = 0

	uniforms = {
		uScale: {
			value: 5,
		},
		uOffset: {
			value: Math.random() * 10,
		},
		uHeight: {
			value: 0.5,
		},
		uTime: {
			value: 0,
		},
	}

	type = 'ring'

	constructor(innerRadius, outerRadius, i = Math.random() * Math.PI, r = 0) {
		super()

		this.innerRadius = innerRadius
		this.outerRadius = outerRadius + innerRadius
		this.i = i
		this.r = r
		this.geometry = this.createRingGeometry(this.innerRadius, this.outerRadius)
		this.material = new MeshBasicMaterial({
			color: Math.random() * 0xffffff,
			side: DoubleSide,
			transparent: true,
			opacity: 0.6,
			// blending: AdditiveBlending,
		})

		this.mesh = new Mesh(this.geometry, this.material)
		this.mesh.userData.entity = this
		this.add(this.mesh)

		this.mesh.rotation.x = this.i

		this.material.onBeforeCompile = (shader) => {
			// console.log(shader.vertexShader)
			shader.uniforms = {
				...shader.uniforms,
				...this.uniforms,
			}

			shader.vertexShader = shader.vertexShader.replace(
				'#include <common>',
				common
			)

			shader.vertexShader = shader.vertexShader.replace(
				'#include <project_vertex>',
				projectVertex
			)

			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <common>',
				common
			)

			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <color_fragment>',
				colorFragmentRing
			)
		}
	}

	createRingGeometry(innerRadius, outerRadius) {
		const geometry = new RingGeometry(innerRadius, outerRadius, 60, 1)
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

		this.gui.add(this.uniforms.uScale, 'value', 0, 20, 0.01).name('Noise size')

		this.gui
			.add(this.uniforms.uOffset, 'value', 0, 20, 0.01)
			.name('Noise Offset')

		this.gui
			.add(this.uniforms.uHeight, 'value', 0, 1, 0.01)
			.name('Noise Height')

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

	update(dt) {
		this.time += dt * this.speed
		// console.log('ring update')
		this.uniforms.uTime.value = this.time
	}

	dispose() {
		console.log('dispose ring')
	}
}
