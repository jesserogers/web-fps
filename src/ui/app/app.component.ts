import { AfterViewInit, Component } from '@angular/core'
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'kuroi-labs-ui';

  public clientId: uint32

  constructor(private router: Router) {

  }

  ngAfterViewInit() {
    console.log(this.router.url)
  }

}
