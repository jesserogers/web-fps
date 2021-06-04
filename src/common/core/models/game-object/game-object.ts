import { Randomizer } from '../../utils'
import { IGameObject } from './game-object.interface'

export abstract class GameObject implements IGameObject {

  public objectId: int

  public name: string

  public online: boolean

  constructor(object?: IGameObject) {
    this.objectId = object && object.objectId || Randomizer.generateNumericId()
    this.online = object && object.online || false
    this.init()
  }

  abstract init(): void
  
  abstract start?(): void

  abstract update?(deltaTime: float): void

  abstract fixedUpdate?(tick: int, fixedDeltaTime: float): void

  abstract stop?(): void

}