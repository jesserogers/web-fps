import { BoxGeometry, Mesh } from 'three'
import { ByteConverter } from '@kuroi/common/core/utils'
import { DTime, GameObject, IGameObject } from '@kuroi/dissonance/global'
import { ECubeMovement } from './cube-movement.enum'

export class CubeBoi extends GameObject {

  private static MOVEMENT_SPEED: float = 4.20 // lul

  constructor(cube?: IGameObject) {
    super(cube)
  }

  public init() {
    // create cube
    this.mesh = new Mesh(new BoxGeometry())
  }

  public start(): void {
    console.log('CubeBoi started on server yuh')
  }

  public fixedUpdate(): void {
    // run "physics" simulation
    // @todo: get user inputs from client
    this.simulate(0)
  }

  public stop(): void {

  }

  private simulate(inputs: uint16): void {
    // get position data from current state
    let { x, y, z } = this.mesh.position
    // handle movement inputs
    if (ByteConverter.checkBit(ECubeMovement.FORWARD, inputs)) {
      z = z - (CubeBoi.MOVEMENT_SPEED * DTime.fixedDeltaTime)
    }
    if (ByteConverter.checkBit(ECubeMovement.BACK, inputs)) {
      z = z + (CubeBoi.MOVEMENT_SPEED * DTime.fixedDeltaTime)
    }
    if (ByteConverter.checkBit(ECubeMovement.LEFT, inputs)) {
      x = x - (CubeBoi.MOVEMENT_SPEED * DTime.fixedDeltaTime)
    }
    if (ByteConverter.checkBit(ECubeMovement.RIGHT, inputs)) {
      x = x + (CubeBoi.MOVEMENT_SPEED * DTime.fixedDeltaTime)
    }
    // apply simulation result to actual 3D object
    this.mesh.position.set(x, y, z)
  }

}