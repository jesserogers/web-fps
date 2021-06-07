/**
 * @author kuro <kuro@kuroi.io>
 * @fileoverview Client side Dissonance Engine
 * @description Resonsible for running game loop and executing lifecycle hooks
 *  for all GameObjects in the current scene
 */

import { Subject } from 'rxjs';
import { Camera, Scene, WebGLRenderer } from 'three';
import { DTime } from '../../global';
import { GameObject } from '../../global/models';

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
  // #endregion

  //#region instance properties
  public lastTick: int

  public tick$ = new Subject<int>()

  public renderer: WebGLRenderer

  public lastRenderTimestamp: int

  public scene: Scene

  private _shouldRender: boolean = false

  private _tick: int = 0

  private _accumulator: int = 0
  //#endregion

  constructor() {
    DTime.setFixedDeltaTime(1 / DClientEngine.TICK_RATE)
    this.renderer = new WebGLRenderer()
    this.resize()
    window.onresize = this.resize.bind(this)
    document.body.appendChild(this.renderer.domElement)
  }

  //#region get/set
  public static setTickRate(tickRate: byte): void {
    DClientEngine.TICK_RATE = tickRate && tickRate > 0 && tickRate <= 60 ?
      tickRate : DClientEngine.TICK_RATE
    DTime.setFixedDeltaTime(1 / tickRate)
  }

  public getDeltaTime(): float {
    return this._accumulator / DTime.getFixedDeltaMs()
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
    // reset values/flags
    this.lastRenderTimestamp = performance.now()
    this._shouldRender = true
    // run start hook on all game objects in scene
    for (let i = 0; i < _gameObjects.length; i++) {
      _gameObjects[i].start()
    }
    // reference to client engine
    const _engine: DClientEngine = this
    // define engine-level game loop logic
    function _gameLoop(_timestamp: int = 0) {
      if (!_engine._shouldRender) {
        return
      }
      // calculate deltaTime
      const _delta: int = Math.min(_timestamp - _engine.lastRenderTimestamp, 100)
      const _stepms: int = DTime.getFixedDeltaMs()
      // accumulate leftover frames to calculate alpha value for client side interp
      _engine._accumulator += _delta
      // update on fixed time step
      while (_engine._accumulator >= _stepms) {
        // tick engine on fixed step
        const _tick: int = _engine.tick()
        // run fixedUpdate hook for each GameObject
        for (let i = 0; i < _gameObjects.length; i++) {
          _gameObjects[i].fixedUpdate(_tick)
        }
        _engine._accumulator -= _stepms
      }
      // run client-side refresh rate update
      // for each GameObject
      const _deltaTime: float = _engine.getDeltaTime()
      for (let i = 0; i < _gameObjects.length; i++) {
        _gameObjects[i].update(_deltaTime)
      }
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

  private resize(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
  
  public destroy(): void {
    // teardown logic
    this.stop()
  }

}
