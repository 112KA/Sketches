import { Object3D, WebGLRenderer } from 'three'
import { ApiChangeEvents, InputBindingApi, TpChangeEvent, TpUpdateEvent } from '@tweakpane/core'
import { ListApi, Pane } from 'tweakpane'
import { InstanceData } from '../InstanceData'
import { Container } from '../Container'

export class Debug {
  #pane = new Pane()
  #renderer: WebGLRenderer
  #instanceDataList: InstanceData[]
  public n = 100
  public drawcalls: string = '0'
  #drawcallsBinding: InputBindingApi<unknown, this['drawcalls']>

  constructor({ renderer, grid }: Container, instanceDataList: InstanceData[]) {
    this.#renderer = renderer
    this.#instanceDataList = instanceDataList

    this.#drawcallsBinding = this.#pane.addInput(this, 'drawcalls', {
      disabled: true,
    })

    this.#pane
      .addInput(this, 'n', {
        min: 1,
        max: 300,
        step: 1,
      })
      .on('change', (e: TpChangeEvent<number>) => {
        this.#updateInstanceDataList()
      })

    this.#updateInstanceDataList()

    this.#pane.addInput(grid, 'visible', {
      label: 'grid',
    })
  }

  #updateInstanceDataList() {
    this.#instanceDataList.forEach((data: InstanceData, index: number) => {
      data.enabled = index < this.n
    })
  }

  update() {
    this.drawcalls = this.#renderer.info.render.calls.toString()
    this.#drawcallsBinding.refresh()
  }
}
