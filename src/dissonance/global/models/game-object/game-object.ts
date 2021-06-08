import { Randomizer } from '@kuroi/common/core/utils'
import { Mesh } from 'three'
import { GameObjectState } from './game-object-state'
import { IGameObject } from './game-object.interface'

export abstract class GameObject implements IGameObject {

  public children: Map<int, GameObject>

  public mesh: Mesh

  public name: string

  public objectId: int

  public online: boolean

  public previousState: GameObjectState

  public state: GameObjectState

  constructor(object?: IGameObject) {
    this.objectId = object && object.objectId || Randomizer.generateNumericId()
    this.online = object && object.online || false
    this.previousState = new GameObjectState(object && object.previousState)
    this.state = new GameObjectState(object && object.state)
    this.children = new Map()
    this.init()
  }

  abstract init(): void

  public addChild(object: GameObject): void {
    this.children.set(object.objectId, object)
  }

  public addChildren(objects: GameObject[]): void {
    objects.forEach(object => this.addChild(object))
  }

  public getChild(id: int): GameObject {
    return this.children.get(id)
  }

  public removeChild(id: int): void {
    // @todo: destroy handlers?
    this.children.delete(id)
  }

}