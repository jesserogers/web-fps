import { Lobby } from './lobby'

export class LobbyManager {

  private static _sharedInstance: LobbyManager

  public static getSharedInstance(): LobbyManager {
    if (!LobbyManager._sharedInstance) {
      LobbyManager._sharedInstance = new LobbyManager()
    }
    return LobbyManager._sharedInstance
  }

  public lobbies: Map<uint32, Lobby>

  constructor() {
    this.lobbies = new Map()
  }

  public add(_lobby: Lobby): void {
    this.lobbies.set(_lobby.id, _lobby)
  }

  public remove(_lobbyId: uint32): void {
    this.lobbies.delete(_lobbyId)
  }

}