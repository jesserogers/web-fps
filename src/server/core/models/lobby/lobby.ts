import WebSocket from 'ws'
import { IdGenerator, Packet, Randomizer, ILobby } from '@kuroi/common/core'
import { PacketHandler } from '../packet-handler/packet-handler'

export class Lobby implements ILobby {

  public static readonly DEFAULT_MAX_CLIENTS: byte = 12

  public clients: Map<uint32, WebSocket>

  public id: uint16

  public name: string

  public maxClients: byte

  public wss: WebSocket.Server
  
  private packetHander = new PacketHandler()

  private idGenerator = new IdGenerator()

  constructor(_lobby?: ILobby) {
    this.id = _lobby && _lobby.id || Randomizer.generateNumericId()
    this.name = _lobby && _lobby.name || ''
    this.maxClients = _lobby && _lobby.maxClients || Lobby.DEFAULT_MAX_CLIENTS
    this.wss = new WebSocket.Server({ noServer: true })
    this.clients = new Map<uint32, WebSocket>()
    this.connect()
  }

  public getConfig(): ILobby {
    return {
      id: this.id,
      name: this.name,
      maxClients: this.maxClients
    }
  }

  public connect(): void {
    this.wss.on('connection', (_client: WebSocket) => {
      this.handshake(_client)
    })
  }

  private handshake(_client: WebSocket): void {
    if (this.clients.size >= this.maxClients) {
      return _client.close()
    }
    const id: byte = this.idGenerator.generateId()
    // allocate 2 byte buffer for packet
    const _buffer = Buffer.alloc(Uint8Array.BYTES_PER_ELEMENT * 2)
    const _packet = new Packet(_buffer)
    // write two bytes to packet: packet id and the client's new id
    _packet.writeBytes([0, id])
    _client.send(_packet.data())
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
    const _clientId: uint32 = _packet.readByte()
    console.log(`Received packet from client [${_clientId}]`)
    this.packetHander.handlers[_packetId](_clientId, _packet, this.clients)
  }

  private onClose(clientId: uint32): void {
    const _client = this.clients.get(clientId)
    console.log(`Removing client [${clientId}]`)
    // remove listeners
    _client.removeAllListeners()
  }

  public setMaxClients(_max: byte): void {
    this.maxClients = _max
  }

}