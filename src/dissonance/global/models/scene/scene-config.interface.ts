import { Camera, Scene } from 'three'
import { GameObject } from '../game-object'

export interface ISceneConfig {
  camera: Camera
  gameObjects: GameObject[]
  scene: Scene
}