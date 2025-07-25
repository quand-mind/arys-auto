import { Component, OnInit, ElementRef, Input, Injectable } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';
import Chart from 'chart.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../src/environments/environment';
import { Observable } from 'rxjs';
import {io} from 'socket.io-client'


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class NavbarComponent implements OnInit {

    @Input() title?: any = 'Inicio';
    @Input() type?: any;
    url = '/'
    notifications:any = []
    notificationsNumber:any = 0
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    socket:any = null 

    public isCollapsed = true;

    constructor(  private element: ElementRef, private router: Router, private http: HttpClient, private snackBar: MatSnackBar,) {

    }

    openSnackBarAlert() {
      this.snackBar.open('Tienes una nueva notificación', 'Cerrar');
    }

    clickNotification(i, notification) {
      this.socket.emit('edit_notifications_admin', notification)
    }

    ngOnInit(){
      let n =0
      if(this.type == 1){
        this.url = '/admin/dashboard'
      } else {
        this.url = '/club/userDetails'
      }
      this.socket = io(environment.wsUrl)
      if(this.type == 1) {
        this.socket.on('notifications_admin', (msg) =>{
          this.notifications = []
          this.notificationsNumber = msg.length
          if(msg.length == 0){
            this.notifications.push({xmensaje: 'No hay notificaciones disponibles'})
          } else {
            this.notifications = msg
            if(n > 0) {
              if(msg.length > 0) {
                this.openSnackBarAlert()
              }
            } else {
              n++
            }
          }
          
          
          
          
        })
      } else {
        this.socket.on('notifications_club', (msg) =>{
          this.notifications = msg
          this.openSnackBarAlert()
        })
      }
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
      this.router.events.subscribe((event) => {
        this.sidebarClose();
         var $layer: any = document.getElementsByClassName('close-layer')[0];
         if ($layer) {
           $layer.remove();
           this.mobile_menu_visible = 0;
         }
     });
    }

    collapse(){
      this.isCollapsed = !this.isCollapsed;
      const navbar = document.getElementsByTagName('nav')[0];
      console.log(navbar);
      if (!this.isCollapsed) {
        navbar.classList.remove('navbar-transparent');
        navbar.classList.add('bg-white');
      }else{
        navbar.classList.add('navbar-transparent');
        navbar.classList.remove('bg-white');
      }

    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
        const html = document.getElementsByTagName('html')[0];
        if (window.innerWidth < 991) {
          mainPanel.style.position = 'fixed';
        }

        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);

        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        this.toggleButton.classList.remove('toggled');
        const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
        if(mainPanel) {
          if (window.innerWidth < 991) {
            setTimeout(function(){
              mainPanel.style.position = '';
            }, 500);
          }
          this.sidebarVisible = false;
          html.classList.remove('nav-open');
        }
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const html = document.getElementsByTagName('html')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const html = document.getElementsByTagName('html')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            html.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (html.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }else if (html.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { //asign a function
              html.classList.remove('nav-open');
              this.mobile_menu_visible = 0;
              $layer.classList.remove('visible');
              setTimeout(function() {
                  $layer.remove();
                  $toggle.classList.remove('toggled');
              }, 400);
            }.bind(this);

            html.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };
}
