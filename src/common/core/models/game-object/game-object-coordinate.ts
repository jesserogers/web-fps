import { IGameObjectCoordinate } from "./game-object-coordinate.interface";

export class GameObjectCoordinate implements IGameObjectCoordinate {
  
  public x: float
  
  public y: float
  
  public z: float

  constructor(coordinate?: IGameObjectCoordinate) {
    this.x = coordinate && coordinate.x || 0
    this.y = coordinate && coordinate.y || 0
    this.z = coordinate && coordinate.z || 0
  }

  public update(coordinate: IGameObjectCoordinate): void {
    if (!coordinate) {
      return
    }
    if (coordinate.x) {
      this.x = coordinate.x
    }
    if (coordinate.y) {
      this.y = coordinate.y
    }
    if (coordinate.z) {
      this.z = coordinate.z
    }
  }

}