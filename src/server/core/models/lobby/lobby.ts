import WebSocket from 'ws'
import { Packet, Randomizer } from '../../../../common/core'
import { PacketHandler } from '../packet-handler/packet-handler'

export class Lobby {

  public clients: Map<uint32, WebSocket>

  public id: uint16

  public wss: WebSocket.Server
  
  private packetHander = new PacketHandler()

  constructor() {
    this.id = Randomizer.generateNumericId()
    this.wss = new WebSocket.Server({ noServer: true })
    this.clients = new Map<uint32, WebSocket>()
    this.connect()
  }

  public connect(): void {
    this.wss.on('connection', (_client: WebSocket) => {
      this.handshake(_client)
    })
  }

  private handshake(_client: WebSocket): void {
    const id: byte = Randomizer.generateNumericId()
    // send client ID back to client
    const _buffer = new ArrayBuffer(2)
    const _data = new Uint8Array(_buffer)
    _data[0] = 0 // 0 will be "welcome message" packet ID for now
    _data[1] = id // send ID
    _client.send(_data)
    this.add(id, _client)
  }

  public add(id: byte, _client: WebSocket): void {
    if (!id) {
      console.error('NO ID!', id)
      return
    }
    // log
    console.log('Adding client [' + id + '] to lobby [' + this.id + ']')
    this.clients.set(id, _client)
    // listeners
    _client.on('open', this.onOpen.bind(this, id))
    _client.on('message', this.onMessage.bind(this))
    _client.on('close', this.onClose.bind(this, id))
  }

  public remove(_clientId: uint32): void {
    this.clients.delete(_clientId)
  }

  private onOpen(_clientId: uint32): void {
    console.log(`Client [${_clientId}] connected!`)
  }

  private onMessage(_data: WebSocket.Data): void {
    const _packet = new Packet(_data as Buffer)
    const _packetId: byte = _packet.readByte()
    const _clientId: byte = _packet.readByte()
    this.packetHander.handlers[_packetId](_clientId, _packet, this.clients)
  }

  private onClose(clientId: uint32): void {
    const _client = this.clients.get(clientId)
    console.log(`Removing client [${clientId}]`)
    // remove listeners
    _client.removeAllListeners()
  }

}