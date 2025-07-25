import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ItemFormService } from '../item-form/item-form.service';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() filtersData:any 
  @Output() changeData = new EventEmitter<string>();
  filterOpenState = false;
  ccompania: any = ''
  filters: any = {}
  currentUser!: any

  constructor(private ItemFormService: ItemFormService, private http: HttpClient,) { }

  ngOnInit(): void {
    const storedSession = localStorage.getItem('user');
    this.ccompania = localStorage.getItem('ccompania');
    this.currentUser = JSON.parse(storedSession);
    this.getFilters()
  }
  addFilterAndSearch(key: any, value: any){
    const filterSearch = this.filters[key]
    if (!filterSearch) {
      this.filters[key] = value
    } else {
      if (value){
        this.filters[key] = value
      } else {
        delete this.filters[key];
      }
    }

    if(!this.filters.ccompania){
      // this.filters.ccompania = this.ccompania
    }
    this.changeData.emit(this.filters);
    // this.http.post(environment.apiUrl + `/api/v1/contracts/search/${this.ccompania}`, this.filters).subscribe((response: any) => {
    //   if (response.data.result) {
    //     // this.dataSource.data = response.data.contracts;
    //   }
    // });
  }
  getFilters(){
    for (const filter of this.filtersData) {
      if(filter.url) {
        this.ItemFormService.getItemInfo(filter.url).subscribe(async (data) => {
          filter.data = data.data
        })
      }
      if(filter.controlValue){
        this.addFilterAndSearch(filter.key, filter.controlValue)
      }
    }
  }

}
