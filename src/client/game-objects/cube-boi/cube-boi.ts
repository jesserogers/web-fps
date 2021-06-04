import { BoxGeometry, Euler, Mesh, MeshBasicMaterial } from 'three';
import { GameObject } from '@kuroi/common/core/models/game-object'

export class CubeBoi extends GameObject {

  public cube: Mesh

  private cachedRotation: { x: float, y: float, z: float }

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
    this.cachedRotation = { ...this.cube.rotation }
    this.cube.rotation.x += 100 * fixedDeltaTime
    this.cube.rotation.y += 100 * fixedDeltaTime
  }

  public stop(): void {

  }

}