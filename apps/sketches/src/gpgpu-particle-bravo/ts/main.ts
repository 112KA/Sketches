import { assertIsDefined, MediaQuery } from '@112ka/x'
import { Container } from './Container'
import { Floor } from './Floor'
import { Particle } from './Particle'
import { Debug } from './debug'

const canvas = document.getElementById('canvas')
assertIsDefined(canvas)
const container = new Container({
    canvas,
  }),
  particle = new Particle(container),
  floor = new Floor(container),
  debug = new Debug(container, particle),
  mq = new MediaQuery()

let _currentTime: number

function setup() {
  _currentTime = Date.now()

  update()
  resize()

  window.addEventListener('resize', resize)

  container.setDeviceSize(mq.deviceSize)
  particle.setDeviceSize(mq.deviceSize)
  mq.addEventListener('change', _onChangeMediaQuery as EventListener)
}

function _onChangeMediaQuery(e: CustomEvent) {
  const { deviceSize } = e.detail
  container.setDeviceSize(deviceSize)
  particle.setDeviceSize(deviceSize)
}

function update() {
  const t = Date.now(),
    dt = t - _currentTime
  _currentTime = t

  particle.update(dt, _currentTime)

  container.render()

  requestAnimationFrame(update)
}

function resize() {
  container.resize()
}

setup()
