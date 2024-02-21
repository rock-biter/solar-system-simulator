import { MathUtils } from 'three'
import Orbit from './Orbit'
import Star from './Star'
import System from './System'

export default class SolarSystem extends System {
	constructor({ scene, camera }) {
		const sun = new Star(2)
		sun.name = `Sun`

		super({
			scene,
			camera,
			head: sun,
			orbitGap: 5,
			orbitStart: 8,
		})

		this.entityType = 'planet'
		this.setSelected()
		this.className += ' system--solar'

		this.initUI('#ui-root', true)
		this.addEntity('planet')
	}
}
