import { Randomizer } from '../../utils'
import { GameObjectState } from './game-object-state'
import { IGameObject } from './game-object.interface'

export abstract class GameObject implements IGameObject {

  public objectId: int

  public name: string

  public online: boolean

  public state: GameObjectState

  public previousState: GameObjectState

  constructor(object?: IGameObject) {
    this.objectId = object && object.objectId || Randomizer.generateNumericId()
    this.online = object && object.online || false
    this.previousState = new GameObjectState(object && object.previousState)
    this.state = new GameObjectState(object && object.state)
    this.init()
  }

  abstract init(): void
  
  abstract start?(): void

  // client side refresh rate
  abstract update?(deltaTime: float): void

  // fixed time step
  abstract fixedUpdate?(tick: int, fixedDeltaTime: float): void

  abstract stop?(): void

}