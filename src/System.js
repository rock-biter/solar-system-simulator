import { MathUtils } from 'three'
import Orbit from './Orbit'
import Star from './Star'

export default class System {
	speed = 0.05
	time = 0

	constructor(scene, camera) {
		this.initUI()

		this.sun = new Star()
		this.entities = [this.sun]

		this.scene = scene
		this.camera = camera
		scene.add(this.sun)

		this.sun.name = `Sun`
		this.addUIElement(this.sun)

		for (let i = 0; i < 1; i++) {
			this.addPlanet()
		}
	}

	initUI() {
		this.systemUIList = document.getElementById('system')
		this.plusButton = document.getElementById('system__plus')

		this.plusButton.addEventListener('click', () => {
			this.addPlanet()
		})
	}

	addUIElement(element) {
		const item = document.createElement('li')
		item.className =
			'system__item cursor-pointer hover:bg-white/10 rounded-lg border-dashed border-2 aspect-square h-16 text-white border-white/30 flex items-center justify-center'

		item.innerHTML = element.name

		element.uiButton = item

		item.addEventListener('click', (e) => {
			e.stopPropagation()
			console.log(`open edit panel for ${element.name}`)
			this.setSelected(element)
		})

		this.systemUIList.append(item)
	}

	setSelected(element) {
		if (this.selected) {
			if (this.selected.orbit) {
				this.selected.orbit.gui.hide()
				this.selected.orbit.ellipse.material.color.set(0xffffff)
				this.selected.orbit.ellipse.material.opacity = 0.25
			}

			this.selected.uiButton?.classList?.remove(
				'bg-indigo-500',
				'hover:bg-indigo-600'
			)

			this.selected.uiButton?.classList?.add('hover:bg-white/10')
		}

		if (this.selected === element) {
			this.selected = null
			this.speed = MathUtils.lerp(0.05, 0.001, 0.05)
			return
		}
		this.speed = MathUtils.lerp(0.001, 0.05, 0.05)
		this.selected = element

		if (element) {
			element.uiButton.classList.add('bg-indigo-500', 'hover:bg-indigo-600')
			element.uiButton.classList.remove('hover:bg-white/10')

			if (element.orbit) {
				element.orbit.ellipse.material.color.set(0x5c54f7)
				element.orbit.ellipse.material.opacity = 1
				element.orbit?.gui.show()
			}
		}
	}

	addPlanet() {
		console.log('add planet')

		const last = this.entities.at(-1)
		const lastOrbit = last.orbit?.a || 0
		const orbit = new Orbit(7 + lastOrbit)
		orbit.prev = last
		last.next = orbit.planet
		this.entities.push(orbit.planet)
		this.addUIElement(orbit.planet)
		this.scene.add(orbit)

		this.setSelected(orbit.planet)
	}

	update(dt) {
		this.time += dt * this.speed
		this.entities.forEach((el) => el.update(this.time))
	}
}
