import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';
import { GameObject } from '@kuroi/common/core/models/game-object'

export class CubeBoi extends GameObject {

  public cube: Mesh

  constructor() {
    super()
  }

  public init() {
    const geometry = new BoxGeometry()
    const material = new MeshBasicMaterial( { color: 0x00ff00 } )
    this.cube = new Mesh( geometry, material )
  }

  public start(): void {
    
  }

  public update(deltaTime: float): void {
    // @todo: interpolate position
  }

  public fixedUpdate(tick: int, fixedDeltaTime: float): void {
    this.previousState.rotation = { ...this.cube.rotation }
    this.previousState.position = { ...this.cube.position }
    this.cube.rotation.x += 100 * fixedDeltaTime
    this.cube.rotation.y += 100 * fixedDeltaTime
  }

  public stop(): void {

  }

}