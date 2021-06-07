import { Subject } from 'rxjs'
import { Camera, Scene, WebGLRenderer } from 'three'
import { GameObject } from '../../global/models/game-object'
import { DTime } from '../../global/time'

export class DClientEngine {

  // #region statics
  private static _sharedInstance: DClientEngine

  public static getSharedinstance(): DClientEngine {
    if (!DClientEngine._sharedInstance) {
      DClientEngine._sharedInstance = new DClientEngine()
    }
    return this._sharedInstance
  }

  public static TICK_RATE: byte = 24

  public static alphaTime: float = 0
  // #endregion

  private __accumulator: int = 0

  public lastTick: int

  public tick$ = new Subject<int>()

  public renderer: WebGLRenderer

  public lastRenderTimestamp: int

  public scene: Scene

  private _shouldRender: boolean = false

  private _tick: int = 0

  private _delta: int = 0

  constructor() {
    // set global fixedDeltaTime value according to engine tick rate
    DTime.setFixedDeltaTime(1 / DClientEngine.TICK_RATE)
    this.renderer = new WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)
  }

  //#region get/set
  public static setTickRate(tickRate: byte): void {
    DClientEngine.TICK_RATE = tickRate && tickRate > 0 && tickRate <= 60 ?
      tickRate : DClientEngine.TICK_RATE
    DTime.setFixedDeltaTime(1 / tickRate)
  }

  public setDeltaTime(_deltaTime: int): void {
    this._delta = Math.min(_deltaTime, 100)
  }

  public getRenderTimeOffset(): float {
    return this.__accumulator / DTime.fixedDeltaTime
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
    const _engine: DClientEngine = this
    // define engine-level game loop logic
    function _gameLoop(_timestamp: int = 0) {
      if (!_engine._shouldRender) {
        return
      }
      // calculate deltaTime
      _engine.setDeltaTime(_timestamp - _engine.lastRenderTimestamp)
      // accumulate leftover frames to calculate alpha value for client side interp
      _engine.__accumulator += _engine._delta
      // update fixed time step
      if (_engine.__accumulator >= DTime.getFixedDeltaMs()) {
        // tick engine on fixed step
        const tick: int = _engine.tick()
        // run fixedUpdate hook for each GameObject
        _gameObjects.forEach(_object => {
          _object.fixedUpdate(tick)
        })
        _engine.__accumulator -= DTime.getFixedDeltaMs()
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
