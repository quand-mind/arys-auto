import { Component, Input, OnInit } from '@angular/core';
import { ItemFormService } from '../item-form/item-form.service';

declare interface RouteInfo {
    xruta: string;
    xmodulo: string;
    xicono: string;
    class?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  @Input() type?: any;
  url = '/'

  constructor(private ItemFormService: ItemFormService) { }

  ngOnInit() {
    if(this.type == 1){
      this.url = '/admin/dashboard'
      this.searchMenus('admin')
    } else {
      this.url = '/club/userDetails'
      this.searchMenus('club')
    }
    
  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };
  searchMenus(type: any) {
    this.ItemFormService.getItemInfo(`/api/v1/menus/search/${type}`).subscribe(async (data) => {
      this.menuItems = data.data.result
    })
  }
}
