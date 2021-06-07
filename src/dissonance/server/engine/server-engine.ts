import { Subject, timer } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { WebGLRenderer } from 'three'
import SoftwareRenderer from 'three-software-renderer'
import { DTime, SceneConfig } from '../../global'

export class DServerEngine {

  private static _sharedInstance: DServerEngine

  public static getSharedInstance(): DServerEngine {
    if (!DServerEngine._sharedInstance) {
      DServerEngine._sharedInstance = new DServerEngine()
    }
    return DServerEngine._sharedInstance
  }

  public static TICK_RATE: byte = 20

  public tick$ = new Subject<int>()

  public renderer: WebGLRenderer

  private _tick: int = 0

  private _lastTickAt: int

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
    this._lastTickAt = performance.now()
    this._tick += 1
    this.tick$.next(this._tick)
    return this._tick
  }

  // since the server will exclusively run game simulations, no need to worry about
  // taking up resources with timers -- just run the simulation at a fixed rate until
  // the engine stops
  public run(_config: SceneConfig): void {
    timer(0, DTime.fixedDeltaTime).pipe(takeUntil(this._stop$)).subscribe(
      () => {
        const _tick = this.tick()
        for (let i = 0; i < _config.gameObjects.length; i++) {
          _config.gameObjects[i].fixedUpdate(_tick)
        }
        this.renderer.render(_config.scene, _config.camera)
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