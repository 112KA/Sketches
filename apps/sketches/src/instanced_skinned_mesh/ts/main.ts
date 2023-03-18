import { LineBasicMaterial, Matrix4, SkeletonHelper } from 'three'
import { assertIsDefined } from 'x/utils/assert'
import { Container } from './Container'
import { CylinderSkinnedMesh } from './CylinderSkinnedMesh'
import { CylinderInstancedSkinnedMesh } from './CylinderInstancedSkinnedMesh'

const canvas = document.getElementById('canvas')
assertIsDefined(canvas)
const container = new Container({
    canvas,
  }),
  // mesh = new CylinderSkinnedMesh(container.scene),
  mesh = new CylinderInstancedSkinnedMesh(container.scene, 10),
  skeletonHelper = new SkeletonHelper(mesh)

;(skeletonHelper.material as LineBasicMaterial).linewidth = 2
container.scene.add(skeletonHelper)

function setup() {
  const matrix = new Matrix4()
  for (let i = 0; i < mesh.count; i++) {
    matrix.identity()
    matrix.makeRotationY(Math.PI * 2 * Math.random())
    matrix.setPosition((0.5 - Math.random()) * 10, 0, (0.5 - Math.random()) * 10)
    mesh.setMatrixAt(i, matrix)
  }

  container.renderer.setAnimationLoop((time: number) => {
    mesh.update(time)
    container.render()
  })
  resize()

  window.addEventListener('resize', resize)
}

function resize() {
  container.resize()
}

setup()
