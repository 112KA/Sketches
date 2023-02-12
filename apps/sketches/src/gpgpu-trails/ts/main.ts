import { Clock } from 'three'
import { assertIsDefined } from 'x/utils/assert'
import { Container } from './Container'
import { Particle } from './Particle'

const canvas = document.getElementById('canvas')
assertIsDefined(canvas)
const clock = new Clock(),
  container = new Container({
    canvas,
  }),
  particle = new Particle(container)

function setup() {
  update()
  resize()

  window.addEventListener('resize', resize)
}

function update() {
  particle.update(clock.getDelta(), clock.elapsedTime)
  container.render()
  requestAnimationFrame(update)
}

function resize() {
  container.resize()
}

setup()
