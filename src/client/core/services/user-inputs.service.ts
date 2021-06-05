import { Injectable } from '@angular/core'
import { EUserInputs } from '@kuroi/common/core/models'
import { ByteConverter } from '@kuroi/common/core/utils'
import { fromEvent } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { Destroyer } from '../utils'

@Injectable({
  providedIn: 'root'
})
export class UserInputService extends Destroyer {

  private static _sharedInstance: UserInputService

  public static getSharedInstance(): UserInputService {
    return UserInputService._sharedInstance || null
  }

  private pressed = new Set<string>()

  constructor() {
    super()
    this.listen()
  }

  private listen(): void {
    fromEvent<KeyboardEvent>(document, 'keydown').pipe(takeUntil(this._destroyed$)).subscribe(
      event => {
        this.pressed.add(event.key.toLowerCase())
      }
    )
    fromEvent<KeyboardEvent>(document, 'keyup').pipe(takeUntil(this._destroyed$)).subscribe(
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

  public getCompressedFlags(): uint32 {
    let _result: uint32 = 0
    if (this.isKeyDown('w')) {
      _result = ByteConverter.turnBitOn(EUserInputs.FORWARD, _result)
    } else if (this.isKeyDown('s')) {
      _result = ByteConverter.turnBitOn(EUserInputs.BACK, _result)
    }
    if (this.isKeyDown('a')) {
      _result = ByteConverter.turnBitOn(EUserInputs.LEFT, _result)
    } else if (this.isKeyDown('d')) {
      _result = ByteConverter.turnBitOn(EUserInputs.RIGHT, _result)
    }
    return _result
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

}
