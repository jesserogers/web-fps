import { Request, Response } from 'express'
import { KuroiLabsAPIEndpoint } from '../../../../common/api'
import { Lobby, LobbyManager } from '../../../core'

function newLobbyHandler(req: Request, res: Response) {
  try {
    // create new lobby
    const _lobby = new Lobby()
    LobbyManager.getSharedInstance().add(_lobby)
    res.json({ lobbyId: _lobby.id })
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