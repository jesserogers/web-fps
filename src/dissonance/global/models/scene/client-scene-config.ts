import { IClientSceneConfig } from './client-scene-config.interface';
import { SceneConfig } from './scene-config';

export class ClientSceneConfig extends SceneConfig implements IClientSceneConfig {

  public renderTarget: HTMLElement

  constructor(config: IClientSceneConfig) {
    super(config)
    this.renderTarget = config.renderTarget || document.body
  }

}