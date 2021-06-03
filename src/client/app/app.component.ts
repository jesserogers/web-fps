import { AfterViewInit, Component, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { ClientPacket } from '@kuroi/common/core/client/net'
import { ILobby } from '@kuroi/common/core/models'
import { LobbyService, WebClient } from '@kuroi/core/services'
import { ClientPacketHandler } from '@kuroi/core/services/client-handler'
import { Destroyer } from '@kuroi/core/utils'
import { fromEvent } from 'rxjs'
import { switchMap, takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends Destroyer implements AfterViewInit, OnDestroy {

  public clientId: uint32

  constructor(private router: Router, private lobbyService: LobbyService) {
    super()
  }

  ngAfterViewInit() {
    fromEvent<KeyboardEvent>(document, 'keyup').pipe(takeUntil(this._destroyed$)).subscribe(
      event => {
        // encode keycode string
        const _message: Uint8Array = WebClient.getEncoder().encode(event.key)
        // calculate byte length
        const _byteLength: byte = Uint8Array.BYTES_PER_ELEMENT * 2 + _message.byteLength
        // allocate buffer space
        const _buffer: ArrayBuffer = new ArrayBuffer(_byteLength)
        // create packet
        const _packet: ClientPacket = new ClientPacket(_buffer)
        // write bytes in order server expects
        _packet.writeBytes([
          ClientPacketHandler.packets.KEYPRESS,
          WebClient.getId(),
          ..._message
        ])
        console.log(`Sending packet to server as client [${WebClient.getId()}]`)
        // send packet to server
        WebClient.send(_packet)
      }
    )
  }

  public newLobby(): void {
    this.lobbyService.createLobby().pipe(
      switchMap((lobby: ILobby) =>
        this.lobbyService.connect(lobby.id)
      )
    ).subscribe(
      (_packet: ClientPacket) => {
        // first byte is always packet ID
        const _packetId: byte = _packet.readByte()
        console.log(`received packet [${_packetId}] from server`)
        // run handler for packet ID
        ClientPacketHandler.handlers[_packetId](_packet)
      },
      _err => {
        console.error(_err)
      }
    )
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

}
