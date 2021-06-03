import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientPacket } from '@kuroi/common/core/client/net';
import { LobbyService } from '@kuroi/core/services';
import { ClientPacketHandler } from '@kuroi/core/services/client-handler';
import { fromEvent } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

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
    fromEvent(document, 'keyup').pipe()
  }

  public newLobby(): void {
    this.lobbyService.createLobby().pipe(
      switchMap((lobby: { lobbyId: uint32 }) =>
        this.lobbyService.connect(lobby.lobbyId)
      ),
      take(1)
    ).subscribe((_packet: ClientPacket) => {
      // first byte is always packet ID
      const _packetId: byte = _packet.readByte()
      console.log(`received packet [${_packetId}] from server`)
      // run handler for packet ID
      ClientPacketHandler.handlers[_packetId](_packet)
    })
  }

}
