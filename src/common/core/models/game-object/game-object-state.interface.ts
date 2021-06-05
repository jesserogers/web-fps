import { IGameObjectCoordinate } from './game-object-coordinate.interface'

export interface IGameObjectState {
  position: IGameObjectCoordinate,
  rotation: IGameObjectCoordinate
}