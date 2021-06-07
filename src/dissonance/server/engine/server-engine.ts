import { Subject, timer } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { Camera, Scene, WebGLRenderer } from 'three'
import { DTime, GameObject } from '@kuroi/common/core'
import SoftwareRenderer from 'three-software-renderer'

export class DServerEngine {

  private static _sharedInstance: DServerEngine

  public static getSharedInstance(): DServerEngine {
    if (!DServerEngine._sharedInstance) {
      DServerEngine._sharedInstance = new DServerEngine()
    }
    return DServerEngine._sharedInstance
  }

  public static TICK_RATE: byte = 24

  public lastTickTimestamp: int

  public tick$ = new Subject<int>()

  public renderer: WebGLRenderer

  private _tick: int = 0

  private _stop$ = new Subject()

  constructor() {
    this.renderer = new SoftwareRenderer()
  }

  //#region get/set
  get fixedDeltaTime(): float {
    return 1 / DServerEngine.TICK_RATE
  }

  get fixedDeltaTimeMs(): int {
    return 1000 / DServerEngine.TICK_RATE
  }
  //#endregion

  public tick(): int {
    this.lastTickTimestamp = performance.now()
    this._tick += 1
    this.tick$.next(this._tick)
    return this._tick
  }

  public run(_scene: Scene, _camera: Camera, _gameObjects: GameObject[]): void {
    timer(0, DTime.fixedDeltaTime).pipe(takeUntil(this._stop$)).subscribe(
      () => {
        const _tick = this.tick()
        _gameObjects.forEach(_object =>
          _object.fixedUpdate(_tick, DTime.fixedDeltaTime)
        )
        this.renderer.render(_scene, _camera)
      },
      err => {
        console.error('[DServerEngine.run] uncaught exception', err)
        this.stop()
      }
    )
  }

  public stop(): void {
    console.log('[DServerEngine.stop] stopping server engine...')
    this._stop$.next()
    this._stop$.complete()
  }

}