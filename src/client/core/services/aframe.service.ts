import { Injectable } from '@angular/core'
import { ClientPacket } from '@kuroi/common/core/client/net'
import { Component as AFrameComponent, Entity } from 'aframe'
import { ClientNetworkSystem } from '../types'
import { ClientPacketHandler } from './client-handler'
import { WebClient } from './client.service'
import { UserInputService } from './user-inputs.service'

@Injectable({
  providedIn: 'root'
})
export class AFrameService {

  public static systems = {
    NETWORKED: 'networked'
  }

  public static components = {
    NETWORKED_PLAYER_OBJECT: 'networked-player-object',
    PLAYER_MOVEMENT: 'player-movement'
  }

  public clientNetworkingSystem: ClientNetworkSystem

  constructor(
    private inputs: UserInputService
  ) {

  }

  public registerPlayerMovement(): void {
    // early exit if player movement already registered
    if (AFRAME.systems[AFrameService.components.PLAYER_MOVEMENT]) {
      return
    }
    const aframeService: AFrameService = this
    AFRAME.registerComponent(AFrameService.components.PLAYER_MOVEMENT, {
      init() {
        console.log('Registering player movement')
        const self = this
        this.serverTick = function(tick, fixedDeltaTime) {
          const el: Entity = self.el
          let { x, y, z } = el.object3D.position
          if (aframeService.inputs.isKeyDown('w')) {
            console.log('w key down')
            z = z - (0.0001 * fixedDeltaTime)
          } else if (aframeService.inputs.isKeyDown('s')) {
            console.log('s key down')
            z = z + (0.0001 * fixedDeltaTime)
          }
          if (aframeService.inputs.isKeyDown('a')) {
            console.log('a key down')
            x = x - (0.0001 * fixedDeltaTime)
          } else if (aframeService.inputs.isKeyDown('d')) {
            console.log('d key down')
            x = x + (0.0001 * fixedDeltaTime)
          }
          el.object3D.position.set(x, y, z)
        }
        aframeService.clientNetworkingSystem.register(this)
      },
      remove() {
        aframeService.clientNetworkingSystem.unregister(this)
      }
    })
  }

  // registers network system and allows them to send packets on
  // server tick with fixedDeltaTime context
  public registerNetworkSystem(): void {
    // early exit if system already initialized
    if (AFRAME.systems[AFrameService.systems.NETWORKED]) {
      return
    }
    const aframeService = this
    AFRAME.registerSystem(AFrameService.systems.NETWORKED, {
      init() {
        this.components = new Set<AFrameComponent>()
        const self = this
        this.register = function(comp: AFrameComponent) {
          self.components.add(comp)
        }
        this.unregister = function(comp: AFrameComponent) {
          self.components.delete(comp)
        }
        this.serverTick = function(tick: int, fixedDeltaTime: float) {
          self.components.forEach(comp => {
            if (comp && comp.serverTick && typeof comp.serverTick === 'function') {
              comp.serverTick(tick, fixedDeltaTime)
            }
          })
        }
        aframeService.clientNetworkingSystem = this
      }
    })
  }

  // registers a component that sends user inputs to dedicated server
  public registerNetworkedPlayerObject(): void {
    // early exit if component already registered
    if (AFRAME.systems[AFrameService.components.NETWORKED_PLAYER_OBJECT]) {
      return
    }
    const aframeService = this
    AFRAME.registerComponent(AFrameService.components.NETWORKED_PLAYER_OBJECT, {
      init() {
        // cached inputs
        this.cachedInputs = null
        // create a fixedUpdate method
        this.serverTick = function(_tick: int, _fixedDeltaTime: float) {
          // get inputs pressed at this server tick
          const _inputs = aframeService.inputs.getCompressedFlags()
          // if no input change, don't send redundant data
          if (_inputs === this.cachedInputs) {
            return
          }
          // allocate packet size
          const _length: byte = Int32Array.BYTES_PER_ELEMENT * 2
          const _buffer: ArrayBuffer = new ArrayBuffer(_length)
          const _packet: ClientPacket = new ClientPacket(_buffer)
          // write packet id
          _packet.writeByte(ClientPacketHandler.packets.INPUTS)
          // write client id
          _packet.writeByte(WebClient.getId())
          // write inputs
          _packet.writeUint32(_inputs)
          // send to server
          WebClient.send(_packet)
          // cache inputs
          this.cachedInputs = _inputs
        }
        // register with system
        aframeService.clientNetworkingSystem.register(this)
      },
      remove() {
        aframeService.clientNetworkingSystem.unregister(this)
      }
    })
  }

}
