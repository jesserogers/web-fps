import { Injectable } from '@angular/core'
import { ClientPacket } from '@kuroi/common/core/client/net'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class WebClient {

  private static id: uint32

  private static socket: WebSocket

  public static decoder: TextDecoder

  public static encoder: TextEncoder

  public static state$ = new BehaviorSubject<byte>(WebSocket.CLOSED)

  private static state: byte = WebSocket.CLOSED

  constructor() {

  }

  public static getId(): uint32 {
    return WebClient.id
  }

  public static setId(_id: uint32): void {
    WebClient.id = _id
  }

  public static getSocket(): WebSocket {
    return WebClient.socket
  }

  public static setSocket(_socket: WebSocket): void {
    WebClient.socket = _socket
  }

  public static getState(): byte {
    return WebClient.state
  }

  public static setState(_state: byte): void {
    WebClient.state = _state
    WebClient.state$.next(_state)
  }

  public static getEncoder(): TextEncoder {
    if (!WebClient.encoder) {
      WebClient.encoder = new TextEncoder()
    }
    return WebClient.encoder
  }

  public static getDecoder(): TextDecoder {
    if (!WebClient.decoder) {
      WebClient.decoder = new TextDecoder()
    }
    return WebClient.decoder
  }

  public static send(_packet: ClientPacket): void {
    if (!WebClient.socket || WebClient.socket.readyState !== WebSocket.OPEN) {
      console.warn('[WebClient.send] no available socket')
      return
    }
    console.log('Sending packet to server as client [' + WebClient.getId() + ']')
    WebClient.socket.send(_packet.data())
  }

}
