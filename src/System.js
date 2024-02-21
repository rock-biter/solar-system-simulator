import { MathUtils, Mesh, Object3D } from 'three'
import Orbit from './Orbit'
import Planet from './Planet'
import SolarSystem from './SolarSystem'

export default class System extends Object3D {
	speed = 0.05
	time = 0
	entities = []
	head

	constructor({ camera, head, orbitGap = 1, orbitStart = 0 }) {
		super()

		this.camera = camera
		this.head = head
		this.head.entities = this.entities
		this.orbitGap = orbitGap
		this.orbitStart = head.radius + orbitStart

		this.add(this.head)
		this.className = 'system'

		// console.log(this)
	}

	addEntity(type) {
		if (!type) return

		console.log('add orbitant entity', type)

		// get last entity
		const lastEntity = this.entities.at(-1) || this.head
		const lastOrbit = lastEntity.orbit ? lastEntity.orbit.a : this.orbitStart
		// create new orbit
		// console.log(lastOrbit + this.orbitGap)
		const orbit = new Orbit(this, type, lastOrbit + this.orbitGap)
		console.log('orbit', this, orbit, lastEntity, lastOrbit, this.orbitGap)
		const entity = orbit.body
		entity.prev = lastEntity
		lastEntity.next = entity
		// push entity
		this.entities.push(entity)
		// add ui button
		this.addUIElement(entity)
		// add entity to the scene
		this.add(orbit)
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

		this.uiRoot.append(this.systemUIList)

		if (head) {
			this.addUIElement(this.head)
		}

		this.plusButton.addEventListener('click', (e) => {
			e.stopPropagation()
			this.addEntity(this.entityType)
		})
	}

	addUIElement(entity) {
		// console.log('ui of', entity)

		const item = document.createElement('li')
		item.innerHTML = `<span class="item__name">${entity.name}</span>`
		item.className =
			'system__item cursor-pointer hover:bg-white/10 rounded-lg border-dashed border-2 aspect-square h-16 text-white border-white/30 flex items-center justify-center'

		entity.uiButton = item

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
		if (this.selected) {
			if (this.selected.orbit) {
				this.selected.orbit.gui.hide()
				this.selected.orbit.ellipse.material.color.set(0xffffff)
				this.selected.orbit.ellipse.material.opacity = 0.25
			}

			this.selected.uiButton?.classList?.remove('active')
		}

		if (this.selected === entity) {
			this.selected = null
			this.speed = MathUtils.lerp(0.05, 0.001, 0.05)
			return
		}
		this.speed = MathUtils.lerp(0.001, 0.05, 0.05)
		this.selected = entity

		if (entity) {
			entity.uiButton.classList.add('active')

			if (entity.orbit) {
				entity.orbit.ellipse.material.color.set(0x5c54f7)
				entity.orbit.ellipse.material.opacity = 1
				entity.orbit?.gui.show()
			}
		}
	}

	update(dt) {
		this.time += dt * this.speed
		this.head.update(this.time)
		this.entities.forEach((el) => el.update(this.time))
	}

	removeEntity(entity) {
		// remove from scene and from system
	}
}
