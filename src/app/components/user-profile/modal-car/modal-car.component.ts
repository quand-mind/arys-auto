import { Component, Input, OnInit } from '@angular/core';
import { ItemFormService } from './../../../components/item-form/item-form.service';
import { PdfGenerationService } from './../../../_services/ServicePDF'
import { MatSnackBar } from '@angular/material/snack-bar';
import { from } from 'rxjs';

@Component({
  selector: 'app-modal-car',
  templateUrl: './modal-car.component.html',
  styleUrls: ['./modal-car.component.scss']
})
export class ModalCarComponent implements OnInit {

  constructor(public ItemFormService: ItemFormService, private pdfGenerationService: PdfGenerationService, private snackBar: MatSnackBar,) { }

  @Input() subscription: any = null
  @Input() userData: any = null

  infoCar:any = null

  ngOnInit(): void {
  }
  getUserCarData() {
    // if(!this.infoCar) {
    //   this.ItemFormService.getItemInfo('/api/v1/user/getCarInfo/' + this.cvehiculopropietario).subscriptionscribe(async (data) => {
    //     this.infoCar = data.data
    //     console.log(this.userData)
    //     console.log(this.infoCar)
    //   })
    // }
  }
  openPdf() {
    console.log(this.userData);
    let data = {
      ccontratoflota: this.subscription.ccontratoflota,
      cpais: this.subscription.cpais,
      ccompania: this.subscription.ccompania
    }

    const observable = from(this.pdfGenerationService.LoadDataCertifiqued(data));

    observable.subscribe(
      (data) => {
        console.log('DATA ' + data)
      },
      (error) => {
        console.log(error)
      }
    );

    this.snackBar.open(`Se está generando el Certificado. Por favor espere.`, '', {
      duration: 6000,
    });
  }

}
