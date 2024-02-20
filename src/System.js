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

		item.addEventListener('click', () => {
			console.log(`open edit panel for ${element.name}`)
		})

		this.systemUIList.append(item)
	}

	addPlanet() {
		console.log('add planet')

		const orbit = new Orbit(this.entities.length * 3 + 4)
		this.entities.push(orbit.planet)
		this.addUIElement(orbit.planet)
		this.scene.add(orbit)
	}

	update(time) {
		this.entities.forEach((el) => el.update(time))
	}
}
