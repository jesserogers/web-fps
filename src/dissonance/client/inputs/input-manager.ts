import { fromEvent, Subject } from "rxjs"
import { takeUntil } from "rxjs/operators"

export abstract class InputManager {

  protected pressed = new Set<string>()

  protected _destroyed$ = new Subject()

  constructor() {
    this.listen()
  }

  get forward(): boolean {
    return this.isKeyDown('w') && this.isKeyUp('s')
  }

  get backward(): boolean {
    return this.isKeyDown('s') && this.isKeyUp('w')
  }

  get left(): boolean {
    return this.isKeyDown('a') && this.isKeyUp('d')
  }

  get right(): boolean {
    return this.isKeyDown('d') && this.isKeyUp('a')
  }

  private listen(): void {
    fromEvent<KeyboardEvent>(window, 'keydown').pipe(takeUntil(this._destroyed$)).subscribe(
      event => {
        this.pressed.add(event.key.toLowerCase())
      }
    )
    fromEvent<KeyboardEvent>(window, 'keyup').pipe(takeUntil(this._destroyed$)).subscribe(
      event => {
        this.pressed.delete(event.key.toLowerCase())
      }
    )
  }

  public isKeyDown(_key: string): boolean {
    return this.pressed.has(_key.toLowerCase())
  }

  public isKeyUp(_key: string): boolean {
    return !this.isKeyDown(_key)
  }

  public abstract getCompressedFlags(): uint32

  public destroy(): void {
    this._destroyed$.next(true)
    this._destroyed$.complete()
  }

}