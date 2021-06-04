import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { CubeBoi } from '@kuroi/game-objects'
import { ClientEngineService, LobbyService } from '@kuroi/core/services'
import { take } from 'rxjs/operators'
import { PerspectiveCamera, Scene } from 'three'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  constructor(
    private lobbyService: LobbyService,
    private router: Router,
    private clientEngine: ClientEngineService
  ) {

  }

  ngOnInit() {
    // create scene
    const scene = new Scene()
    // create and position camera
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5;
    // create game object
    const cubeBoi = new CubeBoi()
    // add cube to scene
    scene.add(cubeBoi.cube);
    // run scene
    this.clientEngine.run(scene, camera, [cubeBoi])
  }

  public newLobby(): void {
    this.lobbyService.createLobby().pipe(
      take(1)
    ).subscribe(
      lobby => {
        this.router.navigateByUrl(`/lobby/${lobby.id}`)
      },
      _err => {
        console.error(_err)
      }
    )
  }

}