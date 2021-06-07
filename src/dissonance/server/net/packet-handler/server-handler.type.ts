import WebSocket from 'ws'
import { Packet } from '../packet'

export type ServerHandler = (_clientId: uint32, _packet: Packet, _clients?: Map<uint32, WebSocket>) => void