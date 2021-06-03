import { ClientPacket } from '@kuroi/common/core/client/net'
import { WebClient } from './client.service'

type ClientHandler = (_packet: ClientPacket) => void

export class ClientPacketHandler {

  public static codes = {
    WELCOME: <byte>0,
    KEYPRESS: <byte>1
  }

  public static handlers: ClientHandler[] = [
    ClientPacketHandler.welcomeReceived,
    ClientPacketHandler.keyPressed
  ]

  public static welcomeReceived(_packet: ClientPacket): void {
    const _clientId: uint32 = _packet.readUint32()
    console.log(`Received welcome message from server with clientId [${_clientId}]`)
    WebClient.setId(_clientId)
  }

  public static keyPressed(_packet: ClientPacket): void {
    // get clientId
    const _clientId: uint32 = _packet.readUint32()
    // get keycode
    const _keyCode: Uint8Array = _packet.readBytes()
    console.log(`Client [${_clientId}] sent key code: "${_keyCode}"`)
  }

}