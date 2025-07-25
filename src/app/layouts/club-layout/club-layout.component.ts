import {filter} from 'rxjs/operators';
import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription ,  Observable } from 'rxjs';
import PerfectScrollbar from 'perfect-scrollbar';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-club-layout',
  templateUrl: './club-layout.component.html',
  styleUrls: ['./club-layout.component.css'],
})
export class ClubLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  constructor( public location: Location, private router: Router, public AuthService: AuthService) {}
  links : any [] = []
  ngOnInit() {
    
    this.links = [
      { path: '/club/userDetails', title: 'Detalles',  icon: 'now-ui-icons users_single-02', class: '' },
      { path: '/club/ordenes', title: 'Ordenes',  icon:'now-ui-icons shopping_box', class: '' },
    ]
    const token = this.AuthService.getToken()
    console.log('club', token)
    if(!token){
      this.router.navigateByUrl('/')
    } else if (this.tokenExpired(token)) {
      this.router.navigateByUrl('/')
    }
    const getSistema = this.AuthService.getTipoSistema()
    console.log(getSistema)
    if(getSistema == '2') {
      this.router.navigateByUrl('/admin/dashboard')
    }

       
    const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

    if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
        // if we are on windows OS we activate the perfectScrollbar function

        document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
    } else {
        document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
    }
    const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
    const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

    this.location.subscribe((ev:PopStateEvent) => {
        this.lastPoppedUrl = ev.url;
    });
      this.router.events.subscribe((event:any) => {
        if (event instanceof NavigationStart) {
            if (event.url != this.lastPoppedUrl)
                this.yScrollStack.push(window.scrollY);
        } else if (event instanceof NavigationEnd) {
            if (event.url == this.lastPoppedUrl) {
                this.lastPoppedUrl = undefined;
                window.scrollTo(0, this.yScrollStack.pop());
            } else
                window.scrollTo(0, 0);
        }
    });
    this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
          elemMainPanel.scrollTop = 0;
          elemSidebar.scrollTop = 0;
    });
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
        let ps = new PerfectScrollbar(elemMainPanel);
        ps = new PerfectScrollbar(elemSidebar);
    }
  }
  ngAfterViewInit() {
    const loadScreen = document.getElementById('load-screen-club')
    if(loadScreen) {
  
      setTimeout(() => {
        loadScreen.classList.add('loading-screen')
      }, 500)
      setTimeout(() => {
        loadScreen.classList.add('loaded-screen')
      }, 1200);
    }
    this.runOnRouteChange();
  }
  isMaps(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
          return false;
      }
      else {
          return true;
      }
  }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
      let bool = false;
      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
          bool = true;
      }
      return bool;
  }
  

}

