import { Injectable } from '@angular/core'
import { ClientPacket } from '@kuroi/common/core/client/net'

@Injectable({
  providedIn: 'root'
})
export class WebClient {

  private static id: uint32

  private static socket: WebSocket

  public static decoder: TextDecoder

  public static encoder: TextEncoder

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
    if (!WebClient.socket) {
      console.warn('[WebClient.send] no available socket')
      return
    }
    WebClient.socket.send(_packet.data())
  }

}
