import { ApiChangeEvents, TpChangeEvent, TpUpdateEvent } from '@tweakpane/core'
import { ListApi, Pane } from 'tweakpane'
import { Container } from '../Container'
import { Grass } from '../Grass'
import { InstancedGrass } from '../InstancedGrass'

export class Debug {
  private _pane = new Pane()

  constructor(grass: Grass, instancedGrass: InstancedGrass) {
    ;(
      this._pane.addBlade({
        view: 'list',
        label: 'grass',
        options: [
          { text: 'Grass', value: 0 },
          { text: 'InstancedGrass', value: 1 },
        ],
        value: grass.visible ? 0 : 1,
      }) as ListApi<number>
    ).on('change', (e: TpChangeEvent<number>) => {
      switch (e.value) {
        case 0:
          grass.visible = true
          instancedGrass.visible = false
          break
        case 1:
          grass.visible = false
          instancedGrass.visible = true
          break
      }
    })
  }
}
