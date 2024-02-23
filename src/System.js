import { MathUtils, Mesh, Object3D } from 'three'
import Orbit from './Orbit'
import Planet from './Planet'
import Moon from './Moon'
import Star from './Star'
import Ring from './Ring'
import gsap from 'gsap'

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

		const ring = new Ring(lastOrbit + 0.5, this.orbitGap)

		this.pushEntity(ring)
		this.add(ring)
		this.onEnter(ring)

		ring.initGUI()

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
		this.onEnter(orbit.ellipse)
		this.onEnter(entity.mesh, 0.8)

		select && this.setSelected(entity)
	}

	pushEntity(entity) {
		this.entities.push(entity)
		this.camera.intersectables.push(entity.mesh)
		this.addUIElement(entity)

		if (entity.system) {
			entity.system.initUI(entity.uiButton)

			let isPlanet = entity instanceof Planet ? true : false

			if (Math.random() < 0.2 && isPlanet) {
				if (Math.random() < 0.5) {
					entity.system.addEntity('moon', false)
				} else {
					entity.system.addRing(false)
				}
			}
		}
	}

	deleteEntity(entity) {
		this.setSelected(entity)
		const i = this.entities.indexOf(entity)
		if (i >= 0) this.entities.splice(i)

		if (entity.orbit) {
			this.remove(entity.orbit)
		} else {
			this.remove(entity)
		}

		entity.dispose()
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
		planet.initGUI()
		return planet
	}

	createMoon(orbit) {
		console.log('create moon')
		const moon = new Moon({ orbit, system: this })
		moon.position.x = orbit.a + orbit.c

		moon.initGUI()
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
			this.plusRingButton.innerText = '+'

			this.systemUIList.append(this.plusRingButton)

			this.plusRingButton.addEventListener('click', (e) => {
				e.stopPropagation()
				this.addRing()
				this.plusRingButton.remove()
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

		if (!(entity instanceof Star)) {
			this.eraseButton = document.createElement('div')
			this.eraseButton.className = 'item__delete'
			this.eraseButton.innerHTML = '<span>+</span>'

			this.eraseButton.addEventListener('click', (e) => {
				e.stopPropagation()
				this.deleteEntity(entity)
				item.remove()

				if (entity instanceof Ring) {
					this.systemUIList.append(this.plusRingButton)
				}
			})

			item.append(this.eraseButton)
		}

		if (typeof entity.initUI === 'function') {
			entity.initUI(item)
		}

		this.systemUIList.append(item)
	}

	setSelected(entity) {
		const focus = this.camera.focusBody

		if (focus) {
			focus.gui?.hide()
			if (focus.orbit) {
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
			}

			entity.gui?.show()
		}
	}

	update(dt) {
		this.time += dt

		if (!this.head.parentSystem) {
			// console.log(this.head)
			this.head.update(this.time)
		} else {
			this.entities.forEach((el) => el.update(this.time))
		}
	}

	onEnter(mesh, delay) {
		let scale = mesh.scale.x
		gsap.fromTo(
			mesh.scale,
			{ x: 0, y: 0, z: 0 },
			{
				x: scale,
				y: scale,
				z: scale,
				duration: 1,
				delay,
				ease: 'elastic.out(2.5,2.5)',
			}
		)
	}

	// removeEntity(entity) {
	// 	// remove from scene and from system
	// }
}
