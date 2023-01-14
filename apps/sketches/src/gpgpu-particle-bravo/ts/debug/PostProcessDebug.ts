import { FolderApi } from 'tweakpane'
import { PostProcess } from '../PostProcess'

export class PostProcessDebug {
  private _folder: FolderApi

  constructor(parent: FolderApi, postprocess: PostProcess) {
    this._folder = parent.addFolder({
      title: 'PostProcess',
      expanded: false,
    })

    this._folder.addInput(postprocess.unrealBloomPass, 'enabled', { label: 'bloom' })
    this._folder.addInput(postprocess.unrealBloomPass, 'threshold', { min: 0, max: 1, step: 0.1 })
    this._folder.addInput(postprocess.unrealBloomPass, 'strength', { min: 0, max: 3, step: 0.1 })
    this._folder.addInput(postprocess.unrealBloomPass, 'radius', { min: 0, max: 1, step: 0.01 })
    this._folder.addSeparator()
    this._folder.addInput(postprocess.fxaaPass, 'enabled', { label: 'fxaa' })
  }
}
