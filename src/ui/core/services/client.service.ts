import { Injectable } from '@angular/core'
import { ClientPacket } from '@kuroi/common/core/client/net'
import WebSocket from 'ws'

@Injectable({
  providedIn: 'root'
})
export class WebClient {

  private static id: uint32

  private static socket: WebSocket

  constructor() {

  }

  public static getId(): uint32 {
    return WebClient.id
  }

  public static setId(id: uint32): void {
    WebClient.id = id
  }

  public static getSocket(): WebSocket {
    return WebClient.socket
  }

  public static setSocket(socket: WebSocket): void {
    WebClient.socket = socket
  }

  public static send(packet: ClientPacket): void {
    if (!WebClient.socket) {
      console.warn('[WebClient.send] no available socket')
      return
    }
    if (WebClient.socket.readyState !== WebSocket.OPEN) {
      console.warn('[WebClient.send] connection not ready')
      return
    }
    WebClient.socket.send(packet.data())
  }

}
