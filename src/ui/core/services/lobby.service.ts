import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ClientPacket } from '@kuroi/common/core/client/net'
import { Observable, Subscriber } from 'rxjs'
import WebSocket from 'ws'

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

  public static readonly ROOT_URL = `api/lobby`

  private socket: WebSocket

  constructor(private http: HttpClient) {

  }

  public createLobby(): Observable<{ lobbyId: uint32 }> {
    const url = `${LobbyService.ROOT_URL}/new`
    return this.http.post<{ lobbyId: uint32 }>(url, null)
  }

  public connect(_lobbyId: uint32): Observable<any> {
    this.socket = new WebSocket(`ws://${window.location.host}/api/lobby/${_lobbyId}`)
    const that = this
    return new Observable(function _connect(observer: Subscriber<any>) {
      that.socket.addEventListener('message', event => {
        observer.next(new ClientPacket(event.data))
      })
      that.socket.addEventListener('error', event => {
        observer.error(event.error)
      })
      return {
        unsubscribe: () => {
          that.socket.close()
          that.socket.terminate()
        }
      }
    })
  }

}
