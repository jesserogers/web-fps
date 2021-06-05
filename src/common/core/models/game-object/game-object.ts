import { Randomizer } from '../../utils'
import { IGameObjectState } from './game-object-state.interface'
import { IGameObject } from './game-object.interface'

export abstract class GameObject implements IGameObject {

  public objectId: int

  public name: string

  public online: boolean

  public state: IGameObjectState

  public previousState: IGameObjectState

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