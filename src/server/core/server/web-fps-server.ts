import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import { KuroiLabsAPIRoute, KuroiLabsServer } from '../../../common/api'
import { LobbyManager } from '../models/lobby/lobby-manager'

export class WebServer extends KuroiLabsServer {

  private static _sharedInstance: WebServer

  public static getSharedInstance(): WebServer {
    return this._sharedInstance
  }

  public lobbyManager = LobbyManager.getSharedInstance()

  constructor(routes: KuroiLabsAPIRoute[]) {
    super(routes)
    this.api.use('/', express.static('dist/web-fps'))
    WebServer._sharedInstance = this
  }

  public start(): void {
    super.start()
    this.httpServer.on('upgrade', (request: http.IncomingMessage, socket, head) => {
      const _lobbyId = request.url.split('/').pop()
      this.lobbyManager.lobbies.forEach(lobby => {
        if (+_lobbyId === lobby.id) {
          lobby.wss.handleUpgrade(request, socket, head, (_ws: WebSocket) => {
            lobby.wss.emit('connection', _ws, request)
          })
        }
      })
    })
  }

}