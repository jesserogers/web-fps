import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public id: uint32

  constructor() {

  }

  public setId(id: uint32): void {
    this.id = id
  }

}
