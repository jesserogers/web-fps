import { IServerPacketHandler } from '../packet-handler'

export interface ILobby {
  name?: string
  maxClients?: byte
  id?: uint32
  packetHandler?: IServerPacketHandler
}