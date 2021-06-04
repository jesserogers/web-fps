import { Component as AFrameComponent, System } from 'aframe'

export type ClientNetworkSystem = {
  components: Set<AFrameComponent>
  serverTick: (tick: int, fixedDeltaTime: float) => void
  register: (comp: AFrameComponent) => void
  unregister: (comp: AFrameComponent) => void
} & System