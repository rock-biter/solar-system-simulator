import Orbit from './Orbit'
import Star from './Star'

export default class System {
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

		item.addEventListener('click', () => {
			console.log(`open edit panel for ${element.name}`)
			this.setSelected(element)
		})

		this.systemUIList.append(item)
	}

	setSelected(element) {
		if (this.selected) {
			this.selected.orbit?.gui.hide()
			this.selected.orbit.ellipse.material.color.set(0xffffff)
			this.selected.orbit.ellipse.material.opacity = 0.5
			this.selected.uiButton?.classList?.remove(
				'bg-indigo-500',
				'hover:bg-indigo-600'
			)
		}

		this.selected = element

		element.uiButton.classList.add('bg-indigo-500', 'hover:bg-indigo-600')

		if (element.orbit) {
			element.orbit.ellipse.material.color.set(0x5c54f7)
			element.orbit.ellipse.material.opacity = 1
			element.orbit?.gui.show()
		}
	}

	addPlanet() {
		console.log('add planet')

		const last = this.entities.at(-1)
		const orbit = new Orbit(this.entities.length * 5 + 6)
		orbit.prev = last
		last.next = orbit.planet
		this.entities.push(orbit.planet)
		this.addUIElement(orbit.planet)
		this.scene.add(orbit)

		this.setSelected(orbit.planet)
	}

	update(time) {
		this.entities.forEach((el) => el.update(time))
	}
}
