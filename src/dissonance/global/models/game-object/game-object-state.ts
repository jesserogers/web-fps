import { GameObjectCoordinate } from "./game-object-coordinate";
import { IGameObjectState } from "./game-object-state.interface";

export class GameObjectState implements IGameObjectState {

  public position: GameObjectCoordinate

  public rotation: GameObjectCoordinate

  constructor(state?: IGameObjectState) {
    this.position = new GameObjectCoordinate(state && state.position)
    this.rotation = new GameObjectCoordinate(state && state.rotation)
  }

  public update(state: IGameObjectState): void {
    this.position.update(state.position)
    this.rotation.update(state.rotation)
  }
  
}