import { PointLight } from 'three'
import { FolderApi } from 'tweakpane'

export class LightDebug {
  private _folder: FolderApi

  constructor(parent: FolderApi, pointLight: PointLight) {
    this._folder = parent.addFolder({
      title: 'Light',
      expanded: false,
    })

    this._folder.addInput(pointLight.position, 'y', { min: 200, max: 800, step: 10 })
  }
}
