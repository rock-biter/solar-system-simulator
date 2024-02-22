import { MathUtils, Mesh, Object3D } from 'three'
import Orbit from './Orbit'
import Planet from './Planet'
import Moon from './Moon'
import Star from './Star'
import Ring from './Ring'

export default class System extends Object3D {
	time = 0
	entities = []
	headEntity

	constructor({ camera, orbitGap = 1, orbitStart = 0 }) {
		super()

		this.camera = camera
		this.orbitGap = orbitGap
		this.orbitStart = orbitStart

		this.className = 'system'
	}

	set head(head) {
		if (head instanceof Star) {
			this.className += ' system--solar'
		}

		if (head instanceof Planet) {
			this.className += ' system--planet'
		}

		this.headEntity = head
	}

	get head() {
		return this.headEntity
	}

	getLastOrbit() {
		let last = this.entities.at(-1) || {}
		let lastOrbit = last.orbit?.a || last.outerRadius || this.orbitStart

		return lastOrbit
	}

	addRing(select = true) {
		let lastOrbit = this.getLastOrbit()

		const ring = new Ring(lastOrbit + this.orbitGap + 3, this.orbitGap * 3)

		this.pushEntity(ring)
		this.add(ring)

		select && this.setSelected(ring)
	}

	addEntity(type, select = true) {
		if (!type) return

		console.log('add orbitant entity', type)

		let entity

		// get last entity
		let lastOrbit = this.getLastOrbit()

		const orbit = new Orbit(this, lastOrbit + this.orbitGap)

		switch (type) {
			case 'planet':
				entity = this.createPlanet(orbit)
				break
			case 'star':
				// this.createStar()
				break
			case 'moon':
				entity = this.createMoon(orbit)
				break
			case 'satellite':
				// this.createSatellite()
				break
		}

		this.pushEntity(entity)
		this.add(orbit)

		select && this.setSelected(entity)
	}

	pushEntity(entity) {
		this.entities.push(entity)
		this.addUIElement(entity)

		if (entity.system) {
			entity.system.initUI(entity.uiButton)
		}
	}

	createPlanet(orbit) {
		console.log('create planet')
		const planet = new Planet({ orbit, system: this })
		const system = new System({
			camera: this.camera,
			orbitGap: 1,
			orbitStart: planet.radius,
		})
		planet.addSystem(system)

		console.log('planet system', system)

		planet.position.x = orbit.a + orbit.c
		planet.iniGUI()
		return planet
	}

	createMoon(orbit) {
		console.log('create moon')
		const moon = new Moon({ orbit, system: this })
		moon.position.x = orbit.a + orbit.c

		moon.iniGUI()
		return moon
	}

	initUI(root, head = false) {
		if (typeof root === 'string') {
			this.uiRoot = document.querySelector(`${root}`)
		} else {
			this.uiRoot = root
		}

		this.systemUIList = document.createElement('ul')
		this.systemUIList.className = this.className
		this.plusButton = document.createElement('li')
		this.plusButton.className = 'system__plus'
		this.plusButton.innerText = '+'

		this.systemUIList.append(this.plusButton)

		if (this.head instanceof Planet) {
			this.plusRingButton = document.createElement('li')
			this.plusRingButton.className = 'ring__plus'
			this.plusRingButton.innerText = '+R'

			this.systemUIList.append(this.plusRingButton)

			this.plusRingButton.addEventListener('click', (e) => {
				e.stopPropagation()
				this.addRing()
			})
		}

		this.uiRoot.append(this.systemUIList)

		if (head) {
			this.addUIElement(this.head)
		}

		this.plusButton.addEventListener('click', (e) => {
			e.stopPropagation()
			const type = this.head instanceof Star ? 'planet' : 'moon'
			this.addEntity(type)
		})
	}

	addUIElement(entity) {
		// console.log('ui of', entity)

		const item = document.createElement('li')

		item.innerHTML = `<span class="item__name">${entity.name}</span>`
		item.className = 'system__item '

		entity.uiButton = item

		if (entity instanceof Planet) {
			item.classList.add('planet')
		}

		if (entity instanceof Star) {
			item.classList.add('star')
		}

		if (entity instanceof Moon) {
			item.classList.add('moon')
		}

		if (entity instanceof Ring) {
			item.classList.add('ring')
		}

		item.addEventListener('click', (e) => {
			e.stopPropagation()
			console.log(`open edit panel for ${entity.name}`)
			this.setSelected(entity)
		})

		if (typeof entity.initUI === 'function') {
			entity.initUI(item)
		}

		this.systemUIList.append(item)
	}

	setSelected(entity) {
		const focus = this.camera.focusBody

		if (focus) {
			if (focus.orbit) {
				focus.gui?.hide()
				focus.orbit.ellipse.material.color.set(0xffffff)
				focus.orbit.ellipse.material.opacity = 0.25
			}

			focus.uiButton?.classList?.remove('active')
		}

		if (focus === entity) {
			this.camera.focusBody = null
			this.camera.worldSpeed = MathUtils.lerp(0.025, 0.001, 0.05)
			return
		}
		this.camera.worldSpeed = MathUtils.lerp(0.001, 0.025, 0.05)
		this.camera.focusBody = entity

		if (entity) {
			entity.uiButton.classList.add('active')

			if (entity.orbit) {
				entity.orbit.ellipse.material.color.set(0x5c54f7)
				entity.orbit.ellipse.material.opacity = 1
				entity.gui?.show()
			}
		}
	}

	update(dt) {
		this.time += dt
		this.entities.forEach((el) => el.update(this.time))
	}

	removeEntity(entity) {
		// remove from scene and from system
	}
}
