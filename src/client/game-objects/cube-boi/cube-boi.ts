import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';
import { GameObject } from '@kuroi/common/core/models/game-object'
import { UserInputService } from '@kuroi/core/services';

export class CubeBoi extends GameObject {

  public cube: Mesh

  private userInput: UserInputService

  private inputs: uint32

  constructor() {
    super()
  }

  public init() {
    // set up user input
    this.userInput = UserInputService.getSharedInstance()
    // create cube
    const geometry = new BoxGeometry()
    const material = new MeshBasicMaterial({ color: 0x00ff00 })
    this.cube = new Mesh(geometry, material)
  }

  public start(): void {
    console.log('CubeBoi started yuh')
  }

  public fixedUpdate(tick: int, fixedDeltaTime: float): void {
    // capture previous state before running simulation
    this.previousState.update(this.state)
    // run "physics" simulation
    this.simulate(fixedDeltaTime)
  }

  public update(deltaTime: float): void {
    // snap cube back to previous state and interp to current state
    this.cube.rotation.x = this.state.rotation.x * deltaTime + this.previousState.rotation.x  * (1 - deltaTime)
    this.cube.rotation.y = this.state.rotation.y * deltaTime + this.previousState.rotation.y  * (1 - deltaTime)
    // consume user input each frame
    this.consumeUserInput()
  }

  public stop(): void {

  }

  private simulate(fixedDeltaTime: float): void {
    this.cube.rotation.x += 1000 * fixedDeltaTime
    this.cube.rotation.y += 1000 * fixedDeltaTime
    // set current state
    this.state.update({ rotation: this.cube.rotation })
  }

  private consumeUserInput(): void {
    const _inputs: uint32 = this.userInput.getCompressedFlags()
  }

}