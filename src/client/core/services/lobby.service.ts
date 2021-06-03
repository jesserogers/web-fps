import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ClientPacket } from '@kuroi/common/core/client/net'
import { Observable, Subscriber, throwError } from 'rxjs'
import { tap } from 'rxjs/operators'
import { ILobby } from '@kuroi/common/core/models'
import { WebClient } from './client.service'

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

  public static readonly ROOT_URL = `api/lobby`

  constructor(private http: HttpClient) {

  }

  public createLobby(): Observable<ILobby> {
    const url = `${LobbyService.ROOT_URL}/new`
    return this.http.post<ILobby>(url, null).pipe(
      tap(_lobby => console.log('Created lobby', _lobby))
    )
  }

  public connect(_lobbyId: uint32): Observable<ClientPacket> {
    try {
      // create web socket client
      const _socket = new WebSocket(`ws://localhost:6969/api/lobby/${_lobbyId}`)
      // set socket in client service
      WebClient.setSocket(_socket)
      _socket.binaryType = 'arraybuffer'
      // return an Observable ClientPacket stream
      return new Observable<ClientPacket>(function _connect(observer: Subscriber<any>) {
        _socket.addEventListener('open', () => {
          console.log(`Opened gateway to server, awaiting client ID...`)
          _socket.addEventListener('message', event => {
            observer.next(new ClientPacket(event.data))
          })
        })
        _socket.addEventListener('error', error => {
          observer.error(error)
        })
        // teardown logic
        return {
          unsubscribe: () => {
            _socket.close()
          }
        }
      })
    } catch (err) {
      return throwError(err)
    }
  }

}
