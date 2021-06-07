import { IGameObjectState } from './game-object-state.interface'

export interface IGameObject {
  objectId?: int
  name?: string
  online?: boolean
  state?: IGameObjectState
  previousState?: IGameObjectState
  init?(): void
  start?(): void
  update?(deltaTime: float): void
  fixedUpdate?(tick: int): void
  stop?(): void
}