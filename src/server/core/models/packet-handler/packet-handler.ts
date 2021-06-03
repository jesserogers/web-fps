import WebSocket from 'ws'
import { Packet } from '@kuroi/common/core/server/net'

type ServerHandler = (_clientId: uint32, _packet: Packet, _clients?: Map<uint32, WebSocket>) => void

export class PacketHandler {

  public static codes = {
    WELCOME: <byte>0,
    KEYPRESS: <byte>1
  }

  public handlers: ServerHandler[] = [
    () => undefined,
    this.keyPressed
  ]

  public keyPressed(_clientId: uint32, _packet: Packet, _clients: Map<uint32, WebSocket>): void {
    // get keycode
    const _keyCode: Uint8Array = _packet.readBytes()
    // send to all other clients
    _clients.forEach((_client: WebSocket, _id: uint32) => {
      if (
        // exclude client that sent packet
        _clientId !== _id &&
        // only send to clients ready to receive data
        _client.readyState === WebSocket.OPEN
      ) {
        // create server packet
        const _out: Packet = new Packet(Buffer.alloc(2 + _keyCode.byteLength))
        // byte schema: packetId, clientId, keycode
        _out.writeByte(PacketHandler.codes.KEYPRESS)
        _out.writeByte(_clientId)
        _out.writeBytes(_keyCode)
        // send to client
        _client.send(_out.data())
      }
    })
  }

}