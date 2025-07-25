import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemFormService } from '../item-form/item-form.service';
import { environment } from './../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
  providers: [DatePipe]
})
export class TrackingComponent implements OnInit {

  title: any = ''
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;
  ccompania: any = ''

  pendingItems: any = []
  
  pendingTracking:any = null
  
  dailyItems: any = []
  
  dailyTracking:any = null

  lateItems: any = []

  lateTracking:any = null

  allItems: any = []

  sub = new Subscription()

  constructor(
    private route: ActivatedRoute,
    public ItemFormService: ItemFormService,
    private _snackBar: MatSnackBar,
    public router: Router,
    private http: HttpClient,
    private datePipe: DatePipe,
    public AuthService: AuthService) { }

  ngOnInit(): void {
    this.ccompania = this.AuthService.getCompania()
    this.sub = this.route
      .data
      .subscribe(v => {
        this.title = v.title
      })

    this.ItemFormService.getItemInfoPost('/api/v1/events/getSeguimientos/'+this.ccompania,{}).subscribe((data)=>{
      this.allItems = data.data
      // const newData = this.datePipe.transform(new Date(this.allItems[0].fseguimientonotificacion), 'dd/mm/yyyy')
      
      const pendingTrack = this.allItems.find(item => new Date(item.fseguimientonotificacion).toLocaleDateString() > new Date().toLocaleDateString())

      if(pendingTrack) {
        this.pendingTracking = pendingTrack
      }

      const dailyTrack = this.allItems.find(item => new Date(item.fseguimientonotificacion).toLocaleDateString() == new Date().toLocaleDateString())

      if(dailyTrack) {
        this.dailyTracking = dailyTrack
      }

      const lateTrack = this.allItems.find(item => new Date(item.fseguimientonotificacion).toLocaleDateString() < new Date().toLocaleDateString())

      if(lateTrack) {
        this.lateTracking = lateTrack
      }      
    })
  }
  showItem(id: any) {
    this.router.navigate([`/admin/events/notifications/${id}`]);
  }
  showAll(type?: any) {
    if(type) {
      this.router.navigate([`/admin/tracking/list/${type}`]);
    } else {
      this.router.navigate([`/admin/tracking/list`]);
    }
  }

}
