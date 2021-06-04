import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../views/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'lobby',
        loadChildren: () => import('../views/lobby/lobby.module').then(m => m.LobbyModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
