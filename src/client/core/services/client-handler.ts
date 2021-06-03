import { ClientPacket } from '@kuroi/common/core/client/net'
import { WebClient } from './client.service'

type ClientHandler = (_packet: ClientPacket) => void

export class ClientPacketHandler {

  public static packets = {
    WELCOME: <byte>0,
    KEYPRESS: <byte>1
  }

  public static handlers: ClientHandler[] = [
    ClientPacketHandler.welcomeReceived,
    ClientPacketHandler.keyPressed
  ]

  public static welcomeReceived(_packet: ClientPacket): void {
    const _clientId: byte = _packet.readByte()
    console.log(`Received welcome message from server with clientId [${_clientId}]`)
    WebClient.setId(_clientId)
  }

  public static keyPressed(_packet: ClientPacket): void {
    // get clientId
    const _clientId: byte = _packet.readByte()
    // get keycode
    const _keyCode: string = WebClient.getDecoder().decode(_packet.readBytes())
    console.log(`Client [${_clientId}] sent key code: "${_keyCode}"`)
  }

}