import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ClientEngine, ClientPacketHandler, UserInputService, LobbyService, WebClient } from '@kuroi/core/services';
import { ClientNetworkSystem } from '@kuroi/core/types';
import { Destroyer } from '@kuroi/core/utils';
import { filter, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LobbyComponent extends Destroyer implements OnInit, AfterViewInit {

  constructor(
    private lobbyService: LobbyService,
    private route: ActivatedRoute,
    private keyboard: UserInputService,
    private clientEngine: ClientEngine
  ) {
    super()
  }

  ngOnInit() {
    const _params: Params = this.route.snapshot.params
    const _lobbyId: uint32 = _params && +_params.lobbyId
    if (_lobbyId) {
      this.lobbyService.connect(_lobbyId).pipe(takeUntil(this._destroyed$)).subscribe(
        _packet => {
          const _packetId: byte = _packet.readByte()
          console.log(`received packet [${_packetId}] from server`)
          // run handler for packet ID
          ClientPacketHandler.handlers[_packetId](_packet)
        },
        _err => {
          console.error('[LobbyComopnent.ngOnInit]', 'Error in packet stream', _err)
        }
      )
    }
    this.clientEngine.aframe.registerNetworkSystem()
    this.clientEngine.aframe.registerNetworkedPlayerObject()
    this.clientEngine.aframe.registerPlayerMovement()
  }

  ngAfterViewInit() {
    const system: ClientNetworkSystem = this.clientEngine.net()
    if (!system) {
      console.error('Unable to find system "networked"')
    }
    // wait until connection is opened
    WebClient.state$.pipe(
      filter(_state => _state === WebSocket.OPEN),
      // switch to consuming ticks
      switchMap(() => this.clientEngine.tick$),
      takeUntil(this._destroyed$)
    ).subscribe(
      tick => {
        system.serverTick(tick, ClientEngine.step)
      }
    )
  }

}
