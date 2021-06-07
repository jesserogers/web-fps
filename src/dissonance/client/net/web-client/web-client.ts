import { BehaviorSubject } from 'rxjs'
import { Packet } from '../packet'

export class DWebClient {

  private static id: uint32

  private static socket: WebSocket

  public static decoder: TextDecoder

  public static encoder: TextEncoder

  public static state$ = new BehaviorSubject<byte>(WebSocket.CLOSED)

  private static state: byte = WebSocket.CLOSED

  constructor() {

  }

  public static getId(): uint32 {
    return DWebClient.id
  }

  public static setId(_id: uint32): void {
    DWebClient.id = _id
  }

  public static getSocket(): WebSocket {
    return DWebClient.socket
  }

  public static setSocket(_socket: WebSocket): void {
    DWebClient.socket = _socket
  }

  public static getState(): byte {
    return DWebClient.state
  }

  public static setState(_state: byte): void {
    DWebClient.state = _state
    DWebClient.state$.next(_state)
  }

  public static getEncoder(): TextEncoder {
    if (!DWebClient.encoder) {
      DWebClient.encoder = new TextEncoder()
    }
    return DWebClient.encoder
  }

  public static getDecoder(): TextDecoder {
    if (!DWebClient.decoder) {
      DWebClient.decoder = new TextDecoder()
    }
    return DWebClient.decoder
  }

  public static send(_packet: Packet): void {
    if (!DWebClient.socket || DWebClient.socket.readyState !== WebSocket.OPEN) {
      console.warn('[WebClient.send] no available socket')
      return
    }
    console.log('Sending packet to server as client [' + DWebClient.getId() + ']')
    DWebClient.socket.send(_packet.data())
  }

}
