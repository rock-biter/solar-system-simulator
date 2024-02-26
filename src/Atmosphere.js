import {
	AdditiveBlending,
	BackSide,
	Color,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	SphereGeometry,
} from 'three'
import Body from './Body'
import common from './shaders/common__atmo.glsl'
import projectVertex from './shaders/project__vertex__atmo.glsl'
import color_fragment from './shaders/color__fragment__atmo.glsl'

export default class Atmosphere extends Body {
	uniforms = {
		uDensity: { value: 0.25 * Math.random() },
		uBase: { value: 0.3 + Math.random() * 0.3 },
		uPow: { value: 4 + Math.random() * 4 },
		uTime: { value: 0 },
	}

	guiParams = {
		radius: 'Radius',
		name: false,
		color: 'Color',
		spin: false,
	}

	constructor(radius, body, color, uniforms = {}) {
		super()

		this.planet = body
		this.uniforms = {
			...this.uniforms,
			...uniforms,
		}

		this.geometry = new SphereGeometry(1, 30, 30)
		this.material = new MeshBasicMaterial({
			color: color ? new Color(color) : new Color(Math.random() * 0xffffff),
			transparent: true,
			opacity: 1,
			blending: AdditiveBlending,
			side: BackSide,
		})
		const mesh = new Mesh(this.geometry, this.material)
		mesh.renderOrder = 1000

		this.guiParams = {
			...this.guiParams,
			name: false,
		}

		this.addMesh(mesh)
		this.updateRadius(radius)

		this.material.onBeforeCompile = (shader) => {
			console.log(shader.fragmentShader)

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
				color_fragment
			)
		}
	}

	update(dt) {
		console.log('update atmosphere')
	}

	initGUI(gui) {
		super.initGUI(gui)

		this.gui.add(this.uniforms.uBase, 'value', 0, 2, 0.01).name('Base size')
		this.gui.add(this.uniforms.uDensity, 'value', 0, 1, 0.01).name('Density')
		this.gui.add(this.uniforms.uPow, 'value', 0.01, 50, 0.01).name('Gradient')
	}
}
