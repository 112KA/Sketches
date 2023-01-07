import { Container } from './Container'

const canvas = document.getElementById('canvas'),
  container = new Container({
    canvas,
  })
function setup() {
  update()
  resize()

  window.addEventListener('resize', resize)
}

function update() {
  container.render()
  requestAnimationFrame(update)
}

function resize() {
  container.resize()
}

setup()
