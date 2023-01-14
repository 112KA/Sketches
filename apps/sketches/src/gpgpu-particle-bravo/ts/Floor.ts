import { Mesh, MeshStandardMaterial, PlaneGeometry } from 'three'
import { Container } from './Container'

export class Floor extends Mesh {
  constructor({ scene }: Container) {
    var geometry = new PlaneGeometry(4000, 4000, 10, 10)
    var planeMaterial = new MeshStandardMaterial({
      roughness: 0.7,
      metalness: 1.0,
      color: 0x333333,
      emissive: 0x000000,
    })

    super(geometry, planeMaterial)

    this.position.y = -150
    this.rotation.x = -1.57
    this.receiveShadow = true

    scene.add(this)
  }
}
