import { Camera, Scene } from 'three'
import { GameObject } from '../game-object'
import { ISceneConfig } from './scene-config.interface'

export class SceneConfig implements ISceneConfig {

  public scene: Scene

  public camera: Camera

  public gameObjects: GameObject[]

  constructor(config: ISceneConfig) {
    this.scene = config.scene
    this.camera = config.camera
    this.gameObjects = config.gameObjects || []
  }
}