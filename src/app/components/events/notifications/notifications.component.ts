import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { from } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { ItemFormService } from '../../../components/item-form/item-form.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  filterColumns: string[] = ['xcompania'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['cnotificacion', 'xnombre', 'xvehiculo', 'xplaca', 'xcausasiniestro', 'star'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filtersData: any[] = [
    {title: 'Compañia', key: 'ccompania', controlValue: '', data: [], url: '/api/v1/maestros/companias'},
  ]
  filters: any[] = []
  disableCompany = new FormControl(false);
  panelOpenState = false;
  currentUser!: any
  ccompania!: any

  constructor(private router: Router,
              private route: ActivatedRoute, 
              private http: HttpClient,
              private snackBar: MatSnackBar,
              private ItemFormService: ItemFormService
              ) {}

  openSnackBarLoading() {
    this.snackBar.open('Cargando datos...', '');
  }
  closeSnackBar() {
    this.snackBar.dismiss();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.openSnackBarLoading()
    this.ccompania = localStorage.getItem('ccompania');
    const storedSession = localStorage.getItem('user');
    this.currentUser = JSON.parse(storedSession);
    if(this.currentUser){
      this.ccompania = this.currentUser.data.ccompania;
      this.searchEvents();
      this.getCompany()
    }
    if(this.ccompania != 1){
      const filteredFilterIndex = this.filtersData.findIndex(item => item.key= 'ccompania')
      if(filteredFilterIndex != -1) {
        this.filtersData.splice(filteredFilterIndex, 1)
      }
    }
  }

  getCompany(){
    this.ItemFormService.getItemInfo('/api/v1/maestros/companias').subscribe(async (data) => {
      this.closeSnackBar()
    })
  }

  searchEvents(){
    this.openSnackBarLoading()
    const ccompania = this.currentUser.data.ccompania;
    this.http.post(environment.apiUrl + `/api/v1/events/search/${ccompania}/${this.currentUser.data.cpais}`, {}).subscribe((response: any) => {
      if (response.data.events) {
        response.data.events.sort((a, b) => (a.cnotificacion > b.cnotificacion) ? 1 : -1);
        this.dataSource.data = response.data.events;
        this.closeSnackBar()
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createNotifications(){
    this.router.navigate(['admin/events/notifications/create']);
  }

  edit(cnotificacion: any) {

  }


  changeData(filters: any) {
    this.openSnackBarLoading()
    this.http.post(environment.apiUrl + `/api/v1/events/search/${this.ccompania}/${this.currentUser.data.cpais}`, filters).subscribe((response: any) => {
      if (response.data.events) {
        this.dataSource.data = response.data.events;
      }
      this.closeSnackBar()
    });
  }

}
