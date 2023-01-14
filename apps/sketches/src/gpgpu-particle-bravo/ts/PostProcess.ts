import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'

import { Container } from './Container'
import { Vector2 } from 'three'
// import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';

export class PostProcess {
  private pixelRatio: number
  public fxaaPass: ShaderPass = new ShaderPass(FXAAShader)
  public unrealBloomPass = new UnrealBloomPass(new Vector2(0, 0), 1.5, 0, 0)
  private effectComposer: EffectComposer

  constructor({ renderer, scene, camera }: Container) {
    this.pixelRatio = renderer.getPixelRatio()

    // this.bloomPass = new BloomPass();
    // const copyPass = new ShaderPass(CopyShader);
    // copyPass.renderToScreen = true;

    this.effectComposer = new EffectComposer(renderer)
    this.effectComposer.addPass(new RenderPass(scene, camera))
    // this.effectComposer.addPass(this.bloomPass);
    // this.effectComposer.addPass(copyPass);
    this.effectComposer.addPass(this.unrealBloomPass)
    this.effectComposer.addPass(this.fxaaPass)
  }

  render() {
    this.effectComposer.render()
  }

  resize(width: number, height: number) {
    this.effectComposer.setSize(width, height)

    this.unrealBloomPass.resolution.set(width, height)

    this.fxaaPass.material.uniforms['resolution'].value.set(
      1 / (width * this.pixelRatio),
      1 / (height * this.pixelRatio),
    )
  }
}
