import { ArrowHelper, Clock, Object3D, Quaternion, Vector3 } from 'three'

import { Container } from './Container'
import { assertIsDefined } from '@112ka/x'

const canvas = document.getElementById('canvas')
assertIsDefined(canvas)
const container = new Container({
  canvas,
})
function setup() {
  // const point = new Vector3(1, 0, 0),
  //   direction = new Vector3(1, 1, 1).normalize(),
  //   sectionNormal = new Vector3(0, 1, 0),
  //   axisVector = new Vector3().crossVectors(direction, sectionNormal)

  //   Math.acos()

  const targetObject = new Object3D(),
    origin = new Vector3(0, 0, 0),
    vectorDirection = new Vector3(1, 0, 0),
    vectorNormal = new Vector3(0, 1, 0),
    vectorTarget = new Vector3(2, 1, 3),
    arrowDirection = new ArrowHelper(vectorDirection, origin, 2, 0xff0000),
    arrowNormal = new ArrowHelper(vectorNormal, origin, 2, 0x00ff00),
    arrowTarget = new ArrowHelper(vectorTarget.normalize(), origin, 1, 0x0000ff)
  targetObject.add(arrowDirection, arrowNormal)
  container.scene.add(targetObject, arrowTarget)

  const axisVector = new Vector3().crossVectors(vectorNormal, vectorTarget).normalize(),
    radians = Math.acos(vectorNormal.dot(vectorTarget)),
    attitudeQuaternion = new Quaternion().setFromAxisAngle(axisVector, radians)

  targetObject.quaternion.multiply(attitudeQuaternion)

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
