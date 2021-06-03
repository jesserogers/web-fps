import { Request, Response } from 'express'
import { ILobby } from '@kuroi/common/core/models'
import { KuroiLabsAPIEndpoint } from '@kuroi/common/api'
import { Lobby, LobbyManager } from '../../../core'

function newLobbyHandler(req: Request, res: Response) {
  try {
    // configure lobby
    const _lobbyConfig: ILobby = { name: 'Shitter Lobby', maxClients: 6 }
    const _lobby = new Lobby(_lobbyConfig)
    LobbyManager.getSharedInstance().add(_lobby)
    res.json(_lobby.getConfig())
  } catch (_err) {
    console.error('[newLobbyHandler] uncaught exception', _err)
    res.sendStatus(500).json({ error: 'Internal server error' })
  }
}

export const NewLobbyEndpoint = new KuroiLabsAPIEndpoint(
  '/new',
  'POST',
  newLobbyHandler
)