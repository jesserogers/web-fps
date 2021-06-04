import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { LobbyRoutingModule } from './lobby-routing.module'
import { LobbyComponent } from './lobby.component'

@NgModule({
  imports: [ CommonModule, LobbyRoutingModule ],
  declarations: [ LobbyComponent ],
  exports: [ LobbyComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LobbyModule {

}
