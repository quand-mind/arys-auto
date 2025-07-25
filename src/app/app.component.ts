import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  constructor( public location: Location, private router: Router, public AuthService: AuthService) {}

  ngOnInit() {
    // const token = this.AuthService.getToken()
    // console.log('im here', token)
    // if(!token){
    //   this.router.navigateByUrl('/auth/login')
    // } else if (this.tokenExpired(token)) {
    //   this.router.navigateByUrl('/auth/login')
    // }
  }
  ngAfterViewInit() {
    
  }
}
