import { assertIsDefined } from '@112ka/x'
import { Container } from './Container'
import { Background } from './Background'
import { Clock } from 'three'

const canvas = document.getElementById('canvas')
assertIsDefined(canvas)
const clock = new Clock(),
  container = new Container({
    canvas,
  }),
  background = new Background(container)

function setup() {
  update()
  resize()

  window.addEventListener('resize', resize)
}

function update() {
  const dt = clock.getDelta(),
    elapsedTime = clock.elapsedTime

  background.update(dt, elapsedTime)
  container.render()

  requestAnimationFrame(update)
}

function resize() {
  container.resize()
  background.resize()
}

setup()
