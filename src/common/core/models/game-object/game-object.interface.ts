export interface IGameObject {
  objectId?: int
  name?: string
  online?: boolean
  init?(): void
  start?(): void
  update?(deltaTime: float): void
  fixedUpdate?(tick: int, fixedDeltaTime: float): void
  stop?(): void
}