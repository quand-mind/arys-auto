import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TableListService } from './table-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from './../../../environments/environment';
import { ItemFormService } from '../item-form/item-form.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  noData = true

  title = ''
  url = ''
  redirectUrl = ''
  data? = {}
  ccompania : any = null
  cusuario : any = null
  tableId = ''
  tableExtraInfo = 'Cargando Datos...'
  tableInfo = []
  extraInfo = []
  idUser:any = false

  tableData: any = []
  noCreate = false
  filtersData: any[] = []
  filterValue:any = ''
  filterDefaultKey = ''
  filters: any[] = []
  infoUrl = ''
  createUrl = ''
  sub = new Subscription()
  
  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    public TableListService: TableListService,
    private ItemFormService: ItemFormService
  ) {}

  openSnackBarLoading() {
    this._snackBar.open('Cargando datos...', '');
  }
  closeSnackBar() {
    this._snackBar.dismiss();
  }
  ngOnInit() {
    this.openSnackBarLoading()
    this.route.url.subscribe( v => {
      
      let url = this.router.url
      if(v[2]){
        this.filterValue = parseInt(v[2].path)
        url = url.slice(0, -1)
        const urlSplited = url.split('/')
        urlSplited.splice(0,1)
        urlSplited.pop()
        urlSplited.pop()
        url = '/'+ urlSplited.join('/')
      }
      this.infoUrl = `${url}/info/`
      // this.infoUrl = `${url}/`
      this.createUrl = `${url}/create`
    });
    this.sub = this.route.data.subscribe(v => {
      this.title = v.title
      this.url = v.url
      this.noCreate = v.noCreate
      this.redirectUrl = v.redirectUrl
      this.tableInfo = v.tableInfo
      this.idUser = v.idUser
      this.filterDefaultKey = v.filterDefaultKey
      this.tableId = v.tableId
      this.ccompania = localStorage.getItem('ccompania');
      this.cusuario = localStorage.getItem('cusuario');
      
      if(v.filtersData) {
        this.filtersData = v.filtersData
        if(this.ccompania != 1){
          const filteredFilterIndex = this.filtersData.findIndex(item => item.key= 'ccompania')
          if(filteredFilterIndex != -1) {
            this.filtersData.splice(filteredFilterIndex, 1)
          }
        }
        
      }
      if (v.extraInfo) {
        
        this.extraInfo = v.extraInfo
      }

      
    });
    
    this.displayedColumns = this.tableInfo.map(item => item.key)
    this.extraInfo.forEach(item => {
      
      this.displayedColumns.push(item.action)
    })

    if(this.idUser) {
      this.TableListService.getItems(this.url + '/' + this.cusuario, {}).subscribe((data) => {
        console.log(data.data.length)
        let dataRecived = []
        if(data.data){
          if(data.data.length > 0) {
            dataRecived = data.data
            if(this.extraInfo.length > 0) {
              dataRecived = dataRecived.map(item => {
                if (!item.id) {
                  const primary_key = this.tableInfo.find(infoItem => infoItem.primary_key == true)
                  item.id = item[primary_key.key]
                }
                if(this.redirectUrl) {
                  for (const iterator of this.extraInfo) {
                    iterator.url = this.redirectUrl
                  }
                }
                item.extraInfo = this.extraInfo
                return item
              })
            }
          } else {
            this.tableExtraInfo = 'No hay datos'
          }          
        } else {
          this.tableExtraInfo = 'No hay datos'
        }
        this.dataSource.data = dataRecived
        this.closeSnackBar()
      })
    } else {
      this.TableListService.getItems(this.url + '/' + this.ccompania, {}).subscribe((data) => {
        console.log(data.data.length)
        let dataRecived = []
        if(data.data){
          if(data.data.length > 0) {
            dataRecived = data.data
            if(this.extraInfo.length > 0) {
              dataRecived = dataRecived.map(item => {
                if (!item.id) {
                  const primary_key = this.tableInfo.find(infoItem => infoItem.primary_key == true)
                  item.id = item[primary_key.key]
                }
                if(this.redirectUrl) {
                  for (const iterator of this.extraInfo) {
                    iterator.url = this.redirectUrl
                  }
                }
                item.extraInfo = this.extraInfo  
                return item
              })
            }
          } else {
            this.tableExtraInfo = 'No hay datos'
          }
        } else {
          this.tableExtraInfo = 'No hay datos'
        }
        this.dataSource.data = dataRecived
        this.closeSnackBar()
      })
    }

    if(this.filterDefaultKey) {
      const filterDefaultItem = this.filtersData.find(item=> item.key == this.filterDefaultKey)
      console.log(filterDefaultItem);
      filterDefaultItem.controlValue = filterDefaultItem.data[this.filterValue-1].value
    }
      
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  changeData(filters: any) {
    console.log('filters',filters);
    this.openSnackBarLoading()
    this.TableListService.getItemsPost(this.url + '/' + this.ccompania, filters).subscribe((response: any) => {
      console.log(response.data);
      if (response.data) {
        const newData = response.data.map( item => {
          if (!item.id) {
            const primary_key = this.tableInfo.find(infoItem => infoItem.primary_key == true)
            item.id = item[primary_key.key]
          }
          item.extraInfo = this.extraInfo
          return item
        })
        this.dataSource.data = newData;
      }
      this.closeSnackBar()
    });
  }

}
