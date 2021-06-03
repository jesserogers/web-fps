import { AfterViewInit, Component } from '@angular/core'
import { Router } from '@angular/router';
import { LobbyService } from '@kuroi/core/services';
import { take } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  public clientId: uint32

  constructor(private router: Router, private lobbyService: LobbyService) {

  }

  ngAfterViewInit() {
    console.log(this.router.url)
  }

  public newLobby(): void {
    this.lobbyService.createLobby().pipe(take(1)).subscribe(res => {
      console.log('CREATED LOBBY:', res)
    })
  }

}
