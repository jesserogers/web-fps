import { Injectable, OnDestroy } from '@angular/core';
import { GameObject } from '@kuroi/common/core/models';
import { Subject } from 'rxjs';
import { Camera, Scene, WebGLRenderer } from 'three';
import { ClientNetworkSystem } from '../types';
import { Destroyer } from '../utils';
import { AFrameService } from './aframe.service';

@Injectable({
  providedIn: 'root'
})
export class ClientEngineService extends Destroyer implements OnDestroy {

  private static _sharedInstance: ClientEngineService

  public static getSharedinstance(): ClientEngineService {
    return this._sharedInstance
  }

  public static readonly TICK_RATE: byte = 20

  public static step: float = 1 / ClientEngineService.TICK_RATE

  public static STEP_MS: float = 1000 / ClientEngineService.TICK_RATE

  public static deltaTime: int = 0

  private static lagTime: int = 0

  public static fixedDeltaTime: int = 0

  public lastTick: int

  public tick$ = new Subject<int>()

  public renderer: WebGLRenderer

  public lastRenderTimestamp: int

  public scene: Scene

  private _shouldRender: boolean = false

  private _tick: int = 0

  constructor(public aframe: AFrameService) {
    super()
    ClientEngineService._sharedInstance = this
    this.renderer = new WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  public static getDeltaTime(): float {
    return ClientEngineService.deltaTime / 1000
  }

  public static setDeltaTime(_deltaTime: int): void {
    ClientEngineService.deltaTime = Math.min(_deltaTime, 100)
  }

  public static getFixedDeltaTime(): float {
    return ClientEngineService.fixedDeltaTime / 1000
  }

  public static setFixedDeltaTime(_fixedDeltaTime: int): void {
    ClientEngineService.fixedDeltaTime = Math.min(_fixedDeltaTime, 100)
  }

  public stop(): void {
    this._shouldRender = false
  }

  public tick(): int {
    this.lastTick = performance.now()
    this._tick += 1
    this.tick$.next(this._tick)
    return this._tick
  }

  public run(_scene: Scene, _camera: Camera, _gameObjects: GameObject[]): void {
    const clientEngine = this
    this.lastRenderTimestamp = performance.now()
    this._shouldRender = true
    // run start hook before gameloop begins
    _gameObjects.forEach(_object => _object.start());
    (function _gameLoop(_timestamp: int = 0) {
      if (!clientEngine._shouldRender) {
        return
      }
      // calculate deltaTime
      ClientEngineService.setDeltaTime(_timestamp - clientEngine.lastRenderTimestamp)
      ClientEngineService.lagTime += ClientEngineService.deltaTime
      // update fixed time step
      if (ClientEngineService.lagTime >= ClientEngineService.STEP_MS) {
        // @todo: capture state for networked objects in scene
        const tick: int = clientEngine.tick()
        ClientEngineService.setFixedDeltaTime(_timestamp - clientEngine.lastTick)
        _gameObjects.forEach(_object => {
          _object.fixedUpdate(tick, ClientEngineService.getFixedDeltaTime())
        })
        ClientEngineService.lagTime -= ClientEngineService.STEP_MS
      }
      const _interp: float = ClientEngineService.lagTime / ClientEngineService.STEP_MS
      // run client-side refresh rate update
      _gameObjects.forEach(_object => {
        _object.update(_interp)
      })
      // render scene
      clientEngine.renderer.render(_scene, _camera)
      // save timestamp
      clientEngine.lastRenderTimestamp = _timestamp
      // run game loop
      requestAnimationFrame(_gameLoop)
    })()
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
