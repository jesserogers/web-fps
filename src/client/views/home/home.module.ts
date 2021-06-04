import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { HomeRoutingModule } from './home-routing.module'
import { HomeComponent } from './home.component'

@NgModule({
  imports: [ CommonModule, HomeRoutingModule ],
  exports: [ HomeComponent ],
  declarations: [ HomeComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HomeModule {

}
