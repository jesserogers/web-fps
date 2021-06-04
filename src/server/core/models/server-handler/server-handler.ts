import WebSocket from 'ws'
import { Packet } from '@kuroi/common/core/server/net'

type ServerHandler = (_clientId: uint32, _packet: Packet, _clients?: Map<uint32, WebSocket>) => void

export class ServerPacketHandler {

  public static packets = {
    WELCOME: <byte>0,
    USER_INPUT: <byte>1
  }

  public handlers: ServerHandler[] = [
    () => undefined,
    this.userInputHandler
  ]

  public userInputHandler(_clientId: byte, _packet: Packet, _clients: Map<uint32, WebSocket>): void {
    // get user inputs
    const _inputs: uint32 = _packet.readUint32()
    console.log(`Received packet from client [${_clientId}] with input flags: "${_inputs}"`)
    // send to all other clients
    _clients.forEach((_client: WebSocket, _id: byte) => {
      if (
        // exclude client that sent packet
        _clientId !== _id &&
        // only send to clients ready to receive data
        _client.readyState === WebSocket.OPEN
      ) {
        // create server packet
        const _byteLength: byte = Uint8Array.BYTES_PER_ELEMENT * 2 + Uint32Array.BYTES_PER_ELEMENT
        const _out: Packet = new Packet(Buffer.alloc(_byteLength))
        // byte schema: packetId, clientId, keycode
        _out.writeBytes([
          ServerPacketHandler.packets.USER_INPUT,
          _clientId
        ])
        _out.writeUint32(_inputs)
        // send to client
        _client.send(_out.data())
      }
    })
  }

}