import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(public AuthService: AuthService,  public router: Router) { }

  ngOnInit(): void {
    this.AuthService.deleteToken()
    let token = this.AuthService.getToken()
    console.log(token)
    // while(token) {
    //   this.AuthService.deleteToken()
    //   token = this.AuthService.getToken()
    // }
    setTimeout(() => {
      this.router.navigateByUrl('/auth/login');
    }, 1000);
  }

}
