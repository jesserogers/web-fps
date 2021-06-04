import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Router } from '@angular/router'
import { LobbyService } from '@kuroi/core/services'
import { take } from 'rxjs/operators'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  constructor(private lobbyService: LobbyService, private router: Router) {

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