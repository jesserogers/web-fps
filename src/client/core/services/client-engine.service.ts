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
export class ClientEngine extends Destroyer implements OnDestroy {

  private static _sharedInstance: ClientEngine

  public static getSharedinstance(): ClientEngine {
    return this._sharedInstance
  }

  public static readonly TICK_RATE: byte = 1

  public static step: float = 1 / ClientEngine.TICK_RATE

  public static STEP_MS: float = 1000 / ClientEngine.TICK_RATE

  private static deltaTime: int = 0

  private static _accumulator: int = 0

  public static alphaTime: float = 0

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
    ClientEngine._sharedInstance = this
    this.renderer = new WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  public static getDeltaTime(): float {
    return ClientEngine.deltaTime / 1000
  }

  public static setDeltaTime(_deltaTime: int): void {
    ClientEngine.deltaTime = Math.min(_deltaTime, 100)
  }

  public static getFixedDeltaTime(): float {
    return ClientEngine.fixedDeltaTime / 1000
  }

  public static setFixedDeltaTime(_fixedDeltaTime: int): void {
    ClientEngine.fixedDeltaTime = Math.min(_fixedDeltaTime, 100)
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
    // bootstrap logic to run scene
    this.lastRenderTimestamp = performance.now()
    this._shouldRender = true
    // run start hook before gameloop begins
    _gameObjects.forEach(_object => _object.start())
    // reference to client engine
    const _engine: ClientEngine = this
    // define engine-level game loop logic
    function _gameLoop(_timestamp: int = 0) {
      if (!_engine._shouldRender) {
        return
      }
      // calculate deltaTime
      ClientEngine.setDeltaTime(_timestamp - _engine.lastRenderTimestamp)
      // accumulate leftover frames to calculate alpha value for client side interp
      ClientEngine._accumulator += ClientEngine.deltaTime
      // update fixed time step
      while (ClientEngine._accumulator >= ClientEngine.STEP_MS) {
        // tick engine on fixed step
        const tick: int = _engine.tick()
        // update fixedDeltaTime
        ClientEngine.setFixedDeltaTime(_timestamp - _engine.lastTick)
        // run fixedUpdate hook for each GameObject
        _gameObjects.forEach(_object => {
          _object.fixedUpdate(tick, ClientEngine.getFixedDeltaTime())
        })
        ClientEngine._accumulator -= ClientEngine.STEP_MS
      }
      // calculate alpha
      ClientEngine.alphaTime = ClientEngine._accumulator / ClientEngine.STEP_MS
      // run client-side refresh rate update
      // for each GameObject
      _gameObjects.forEach(_object => {
        _object.update(ClientEngine.alphaTime)
      })
      // render scene
      _engine.renderer.render(_scene, _camera)
      // save timestamp
      _engine.lastRenderTimestamp = _timestamp
      // run game loop
      requestAnimationFrame(_gameLoop)
    }
    // kick off game loop
    _gameLoop(performance.now())
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
