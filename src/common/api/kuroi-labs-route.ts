import { KuroiLabsAPIEndpoint } from './kuroi-labs-endpoint'
import { KuroiLabsAPIGuard } from './kuroi-labs-guard'
import express from 'express'

export class KuroiLabsAPIRoute {

  private static readonly ROOT = `*/api`

  public path: string

  public endpoints: KuroiLabsAPIEndpoint[]

  public router = express.Router()

  public guards: KuroiLabsAPIGuard[]

  constructor(
    path: string,
    endpoints: KuroiLabsAPIEndpoint[],
    guards?: KuroiLabsAPIGuard[]
  ) {
    this.path = `${KuroiLabsAPIRoute.ROOT}/${path}` || ''
    this.endpoints = endpoints || []
    this.guards = guards || []
    this.configureEndpoints()
  }

  private configureEndpoints(): void {
    if (this.endpoints) {
      for (const endpoint of this.endpoints) {
        const handlers: express.RequestHandler[] = []
        // front load guards/middleware
        this.guards.forEach(guard => handlers.push(guard.handler))
        // append route handler at end
        handlers.push(endpoint.handler)
        switch (endpoint.type.toLowerCase()) {
          case 'get':
            this.router.get(endpoint.path, ...handlers)
            break
          case 'post':
            this.router.post(endpoint.path, ...handlers)
            break
          case 'patch':
            this.router.patch(endpoint.path, ...handlers)
            break
          case 'put':
            this.router.put(endpoint.path, ...handlers)
            break
          case 'delete':
            this.router.delete(endpoint.path, ...handlers)
            break
          default:
            console.error(`Invalid request type: ${endpoint.type}`)
            break
        }
      }
    }
  }

}
