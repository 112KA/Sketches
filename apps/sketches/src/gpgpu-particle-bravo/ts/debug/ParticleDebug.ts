import { TpChangeEvent } from '@tweakpane/core'
import { FolderApi, ListApi } from 'tweakpane'
import { Particle } from '../Particle'

export class ParticleDebug {
  private _folder: FolderApi

  constructor(parent: FolderApi, private _particle: Particle) {
    this._folder = parent.addFolder({
      title: 'Particle',
      expanded: false,
    })
    const { uniforms } = _particle.positionVariable.material

    this._folder.addInput(uniforms.speed, 'value', {
      label: 'speed',
      min: 0,
      max: 1,
      step: 0.1,
    })

    this._folder.addInput(uniforms.dieSpeed, 'value', {
      label: 'dieSpeed',
      min: 0.001,
      max: 0.5,
      step: 0.001,
    })

    this._folder.addInput(uniforms.radius, 'value', {
      label: 'radius',
      min: 0,
      max: 0.3,
      step: 0.01,
    })

    this._folder.addInput(uniforms.curlSize, 'value', {
      label: 'curlSize',
      min: 0.001,
      max: 0.05,
      step: 0.001,
    })

    this._folder.addInput(uniforms.attraction, 'value', {
      label: 'attraction',
      min: -2,
      max: 2,
      step: 0.1,
    })
    ;(
      this._folder.addBlade({
        view: 'list',
        label: 'text',
        options: [
          { text: 'text1', value: 'text1' },
          { text: 'text2', value: 'text2' },
        ],
        value: 'text1',
      }) as ListApi<string>
    ).on('change', (e: TpChangeEvent<string>) => {
      this._particle.textObjectKey = e.value
    })
  }
}
