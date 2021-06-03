import { KuroiLabsAPIRoute } from '@kuroi/common/api'
import { NewLobbyEndpoint } from './new-lobby.endpoint'

export const LobbyRoute = new KuroiLabsAPIRoute('lobby', [ NewLobbyEndpoint ])