import { Container } from './Container'
import { assertIsDefined } from '@112ka/x'
import { Grass } from './Grass'
import { InstancedGrass } from './InstancedGrass'
import { Debug } from './debug'

const canvas = document.getElementById('canvas')
assertIsDefined(canvas)
const container = new Container({
    canvas,
  }),
  size = 30,
  count = 100000,
  // size = 3,
  // count = 1000,
  grass = new Grass(container.scene, size, count),
  instancedGrass = new InstancedGrass(container.scene, size, count)

function setup() {
  grass.visible = false
  // instancedGrass.visible = false

  new Debug(grass, instancedGrass)

  container.renderer.setAnimationLoop((time: number) => {
    if (grass.visible) {
      grass.update(time)
    } else {
      instancedGrass.update(time)
    }
    container.render()
  })
  resize()

  window.addEventListener('resize', resize)
}

function resize() {
  container.resize()
}

setup()
