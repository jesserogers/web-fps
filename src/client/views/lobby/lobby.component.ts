import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ClientPacketHandler, UserInputService, LobbyService, WebClient } from '@kuroi/core/services';
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
    private keyboard: UserInputService
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
  }

  ngAfterViewInit() {
    
  }

}
