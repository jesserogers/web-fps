import { RequestHandler } from 'express'

export class KuroiLabsAPIEndpoint {

  public path: string

  public type: string

  public handler: RequestHandler

  public guards: KuroiLabsAPIEndpoint[] = []

  constructor(
    path: string,
    type: string,
    handler: RequestHandler,
    guards?: KuroiLabsAPIEndpoint[]
  ) {
    this.path = path || ''
    this.type = type || 'get'
    this.handler = handler || null
    this.guards = guards || []
  }

}
