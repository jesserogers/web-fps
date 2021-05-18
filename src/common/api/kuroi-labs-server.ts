import bodyParser from 'body-parser'
import express from 'express'
import { KuroiLabsAPIRoute } from './kuroi-labs-route'

export class KuroiLabsServer {

  public static PORT = 6969

  public routes: KuroiLabsAPIRoute[]

  public api = express()

  constructor(routes: KuroiLabsAPIRoute[]) {
    this.routes = routes || []
    this.configureRoutes()
    this.api.use(bodyParser.json())
  }

  public static setPort(_port: number): void {
    KuroiLabsServer.PORT = _port
  }

  private configureRoutes(): void {
    if (this.routes) {
      for (const route of this.routes) {
        this.api.use(route.path, route.router)
      }
    }
  }

  public start(): void {
    this.api.listen(KuroiLabsServer.PORT, () => {
      console.log('KuroiLabs Server up and running on port ' + KuroiLabsServer.PORT)
    })
  }

}