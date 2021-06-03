import { Directive, OnDestroy } from '@angular/core'
import { Subject } from 'rxjs'

@Directive()
export class Destroyer implements OnDestroy {

  protected _destroyed$ = new Subject()

  ngOnDestroy() {
    this._destroyed$.next()
    this._destroyed$.complete()
  }

}