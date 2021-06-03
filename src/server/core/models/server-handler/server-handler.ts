import WebSocket from 'ws'
import { Packet } from '@kuroi/common/core/server/net'

type ServerHandler = (_clientId: uint32, _packet: Packet, _clients?: Map<uint32, WebSocket>) => void

export class ServerPacketHandler {

  public static packets = {
    WELCOME: <byte>0,
    KEYPRESS: <byte>1
  }

  public handlers: ServerHandler[] = [
    () => undefined,
    this.keyPressed
  ]

  public keyPressed(_clientId: byte, _packet: Packet, _clients: Map<uint32, WebSocket>): void {
    // get keycode
    const _keyCode: Uint8Array = _packet.readBytes()
    const _keyCodeString: string = new TextDecoder().decode(_keyCode)
    console.log(`Received packet from client [${_clientId}] with key code: "${_keyCodeString}"`)
    // send to all other clients
    _clients.forEach((_client: WebSocket, _id: uint32) => {
      if (
        // exclude client that sent packet
        _clientId !== _id &&
        // only send to clients ready to receive data
        _client.readyState === WebSocket.OPEN
      ) {
        // create server packet
        const _byteLength: byte = Uint8Array.BYTES_PER_ELEMENT * 2 + _keyCode.byteLength
        const _out: Packet = new Packet(Buffer.alloc(_byteLength))
        // byte schema: packetId, clientId, keycode
        _out.writeBytes([
          ServerPacketHandler.packets.KEYPRESS,
          _clientId,
          ..._keyCode
        ])
        // send to client
        _client.send(_out.data())
      }
    })
  }

}