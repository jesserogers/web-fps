import { GameObject } from '@kuroi/common/core/models';
import { Subject } from 'rxjs';
import { Camera, Scene, WebGLRenderer } from 'three';

export class ClientEngine {

  // #region statics
  private static _sharedInstance: ClientEngine

  public static getSharedinstance(): ClientEngine {
    if (!ClientEngine._sharedInstance) {
      ClientEngine._sharedInstance = new ClientEngine()
    }
    return this._sharedInstance
  }

  public static TICK_RATE: byte = 24

  public static alphaTime: float = 0

  public static fixedDeltaTime: int = 0
  // #endregion

  private deltaTime: int = 0

  private __accumulator: int = 0

  private fixedDeltaTime: int = 0

  public lastTick: int

  public tick$ = new Subject<int>()

  public renderer: WebGLRenderer

  public lastRenderTimestamp: int

  public scene: Scene

  private _shouldRender: boolean = false

  private _tick: int = 0

  constructor() {
    this.renderer = new WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  //#region get/set
  get step(): float {
    return 1 / ClientEngine.TICK_RATE
  }

  get stepMs(): int {
    return 1000 / ClientEngine.TICK_RATE
  }

  get fps(): int {
    return Math.round(1000 / this.deltaTime)
  }

  get tps(): int {
    return Math.round(1000 / this.fixedDeltaTime)
  }

  public static setTickRate(tickRate: byte): void {
    ClientEngine.TICK_RATE = tickRate && tickRate > 0 && tickRate <= 60 ?
      tickRate : ClientEngine.TICK_RATE
  }

  public getDeltaTime(): int {
    return Math.min(this.deltaTime, 100)
  }

  public setDeltaTime(_deltaTime: int): void {
    this.deltaTime = Math.min(_deltaTime, 100)
  }

  public getFixedDeltaTime(): float {
    return this.fixedDeltaTime / 1000
  }

  public setFixedDeltaTime(_fixedDeltaTime: int): void {
    this.fixedDeltaTime = Math.min(_fixedDeltaTime, 100)
  }

  public getRenderTimeOffset(): float {
    return this.__accumulator / this.stepMs
  }
  //#endregion

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
      _engine.setDeltaTime(_timestamp - _engine.lastRenderTimestamp)
      // accumulate leftover frames to calculate alpha value for client side interp
      _engine.__accumulator += _engine.deltaTime
      // update fixed time step
      if (_engine.__accumulator >= _engine.stepMs) {
        // tick engine on fixed step
        const tick: int = _engine.tick()
        // update fixedDeltaTime
        _engine.setFixedDeltaTime(_timestamp - _engine.lastTick)
        // run fixedUpdate hook for each GameObject
        _gameObjects.forEach(_object => {
          _object.fixedUpdate(tick, _engine.step)
        })
        _engine.__accumulator -= _engine.stepMs
      }
      // run client-side refresh rate update
      // for each GameObject
      _gameObjects.forEach(_object => {
        _object.update(_engine.getRenderTimeOffset())
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
  
  public destroy(): void {
    // teardown logic
    this._shouldRender = false
  }

}
