import { Injectable, OnDestroy } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClientNetworkSystem } from '../types';
import { Destroyer } from '../utils';
import { AFrameService } from './aframe.service';

@Injectable({
  providedIn: 'root'
})
export class ClientEngineService extends Destroyer implements OnDestroy {

  public static TICK_RATE: byte = 30 // tick once per second lul

  public static fixedDeltaTime: float = 1000 / ClientEngineService.TICK_RATE

  public tick: int = 0

  public tick$ = new Subject<int>()

  constructor(public aframe: AFrameService) {
    super()
  }

  public start(): void {
    timer(0, ClientEngineService.fixedDeltaTime).pipe(
      takeUntil(this._destroyed$)
    ).subscribe(
      _tick => {
        this.tick$.next(_tick)
      }
    )
  }

  // client engine level get method for networking system
  // that drives fixed update/server tick hook to tell clients
  // to talk to server
  public net(): ClientNetworkSystem {
    return this.aframe.clientNetworkingSystem || null
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

}
