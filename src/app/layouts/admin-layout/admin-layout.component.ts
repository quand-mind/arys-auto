import {filter} from 'rxjs/operators';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription ,  Observable } from 'rxjs';
import PerfectScrollbar from 'perfect-scrollbar';
import { AuthService } from '../../auth/auth.service';
import { ItemFormService } from './../../components/item-form/item-form.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  constructor( public location: Location, private router: Router, public AuthService: AuthService, private ItemFormService: ItemFormService) {}
  links : any [] = []
  ngOnInit() {

  //   this.links = [
  //     { path: '/admin/dashboard', title: 'Inicio',  icon: 'fa-solid fa-house', class: '' },
      
  //     { path: '/admin/contratos', title: 'Contratos',  icon:'now-ui-icons files_paper', class: '' },
  //     { path: '/admin/events', title: 'Notificaciones',  icon:'fa-solid fa-exclamation', class: '' },
  //     { path: '/admin/planes', title: 'Planes',  icon:'now-ui-icons design_app', class: '' },
  //     { path: '/admin/maestros', title: 'Maestros',  icon:'now-ui-icons objects_globe', class: ''},
  // ]

    const token = this.AuthService.getToken()
    console.log('admin', token);
    
    if(!token){
      this.router.navigateByUrl('/auth/login')
    } else if (this.tokenExpired(token)) {
      console.log('vencido');
      this.router.navigateByUrl('/auth/login')
    } else {

      const getSistema = this.AuthService.getTipoSistema()
      console.log('tipoSistema', getSistema);
      if(getSistema == '1') {
        this.router.navigateByUrl('/club/UserDetails')
      }
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
    const loadScreen = document.getElementById('load-screen-admin')
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
