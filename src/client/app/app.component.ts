import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { ClientPacket } from '@kuroi/common/core/client/net'
import { LobbyService, WebClient } from '@kuroi/core/services'
import { ClientPacketHandler } from '@kuroi/core/services/client-handler'
import { Destroyer } from '@kuroi/core/utils'
import { fromEvent } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends Destroyer implements AfterViewInit, OnDestroy {

  public clientId: uint32

  constructor(private lobbyService: LobbyService, private router: Router) {
    super()
  }

  ngAfterViewInit() {
    // fromEvent<KeyboardEvent>(document, 'keyup').pipe(takeUntil(this._destroyed$)).subscribe(
    //   event => {
    //     // encode keycode string
    //     const _message: Uint8Array = WebClient.getEncoder().encode(event.key)
    //     // calculate byte length
    //     const _byteLength: byte = Uint8Array.BYTES_PER_ELEMENT * 2 + _message.byteLength
    //     // allocate buffer space
    //     const _buffer: ArrayBuffer = new ArrayBuffer(_byteLength)
    //     // create packet
    //     const _packet: ClientPacket = new ClientPacket(_buffer)
    //     // write bytes in order server expects
    //     _packet.writeBytes([
    //       ClientPacketHandler.packets.KEYPRESS,
    //       WebClient.getId(),
    //       ..._message
    //     ])
    //     console.log(`Sending packet to server as client [${WebClient.getId()}]`)
    //     // send packet to server
    //     WebClient.send(_packet)
    //   }
    // )
  }

  

  ngOnDestroy() {
    super.ngOnDestroy()
  }

}
