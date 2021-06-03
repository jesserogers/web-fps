import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import { KuroiLabsAPIRoute, KuroiLabsServer } from '../../../common/api'
import { Lobby } from '../models/lobby'

export class WebServer extends KuroiLabsServer {

  private lobbies = new Map<uint32, Lobby>()

  constructor(routes: KuroiLabsAPIRoute[]) {
    super(routes)
    this.api.use('/', express.static('dist/web-fps'))
  }

  public start(): void {
    super.start()
    this.httpServer.on('upgrade', (request: http.IncomingMessage, socket, head) => {
      const _lobbyId = request.url.split('/').pop()
      this.lobbies.forEach(lobby => {
        if (+_lobbyId === lobby.id) {
          lobby.wss.handleUpgrade(request, socket, head, (_ws: WebSocket) => {
            lobby.wss.emit('connection', _ws, request)
          })
        }
      })
    })
  }

}