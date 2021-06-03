import { WebServer } from './core/server'
import { LobbyRoute } from './rest-api/routes'

const server = new WebServer([ LobbyRoute ])
server.start()