import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';
import { DTime, GameObject, IGameObject } from '@kuroi/dissonance/global'
import { UserInputService } from '@kuroi/core/services';

export class CubeBoi extends GameObject {

  private static MOVEMENT_SPEED: float = 4.20 // lul

  public cube: Mesh

  constructor(private userInput: UserInputService, cube?: IGameObject) {
    super(cube)
  }

  public init() {
    // create cube
    const geometry = new BoxGeometry()
    const material = new MeshBasicMaterial({ color: 0x00ff00 })
    this.cube = new Mesh(geometry, material)
  }

  public start(): void {
    console.log('CubeBoi started yuh')
  }

  public fixedUpdate(): void {
    // capture previous state before running simulation
    this.previousState.update(this.state)
    // run "physics" simulation
    this.simulate()
  }

  public update(deltaTime: float): void {
    // snap cube back to previous state and interp to current state
    this.interpolate(deltaTime)
  }

  private interpolate(deltaTime: float): void {
    this.cube.position.x = this.state.position.x * deltaTime + this.previousState.position.x  * (1 - deltaTime)
    this.cube.position.z = this.state.position.z * deltaTime + this.previousState.position.z  * (1 - deltaTime)
  }

  public stop(): void {

  }

  private simulate(): void {
    // get position data from current state
    let { x, y, z } = this.state.position
    // handle movement inputs
    if (this.userInput.forward) {
      z = z - (CubeBoi.MOVEMENT_SPEED * DTime.fixedDeltaTime)
    }
    if (this.userInput.backward) {
      z = z + (CubeBoi.MOVEMENT_SPEED * DTime.fixedDeltaTime)
    }
    if (this.userInput.left) {
      x = x - (CubeBoi.MOVEMENT_SPEED * DTime.fixedDeltaTime)
    }
    if (this.userInput.right) {
      x = x + (CubeBoi.MOVEMENT_SPEED * DTime.fixedDeltaTime)
    }
    // apply simulation result to actual 3D object
    this.cube.position.set(x, y, z)
    // set current state
    this.state.update({ position: this.cube.position })
  }

}