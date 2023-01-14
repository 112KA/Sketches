import { Pane } from 'tweakpane'
import { Container } from '../Container'
import { Particle } from '../Particle'
import { ParticleDebug } from './ParticleDebug'
import { PostProcessDebug } from './PostProcessDebug'
import { LightDebug } from './LightDebug'

export class Debug {
  private _pane = new Pane()
  private _particle: ParticleDebug
  private _postprocess: PostProcessDebug
  private _light: LightDebug

  constructor({ postprocess, pointLight }: Container, particle: Particle) {
    this._particle = new ParticleDebug(this._pane, particle)
    this._light = new LightDebug(this._pane, pointLight)
    this._postprocess = new PostProcessDebug(this._pane, postprocess)
  }
}
