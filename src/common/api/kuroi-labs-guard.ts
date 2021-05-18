import { KuroiLabsAPIEndpoint } from './kuroi-labs-endpoint'
import { RequestHandler } from 'express'

export class KuroiLabsAPIGuard extends KuroiLabsAPIEndpoint {
  constructor(handler: RequestHandler) {
    super('', '', handler)
  }
}
