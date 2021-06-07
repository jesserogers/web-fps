import { ISceneConfig } from './scene-config.interface'

export interface IClientSceneConfig extends ISceneConfig {
  renderTarget: HTMLElement
}