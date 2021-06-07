import { ServerHandler } from './server-handler.type'

export interface IServerPacketHandler {
  packets: { [packet: string]: number }
  handlers: ServerHandler[]
}