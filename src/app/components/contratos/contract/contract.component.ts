import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { from } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PdfGenerationService } from './../../../_services/ServicePDF'
import { ItemFormService } from '../../item-form/item-form.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css'],
})
export class ContractComponent implements OnInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  dataSource2: MatTableDataSource<any> = new MatTableDataSource<any>();
  ccompania: any = ''
  receipts: any = ''
  filters: any = {}
  n = 0
  registerPay: boolean = false
  receiptSelected: any = null
  banks: any = null
  length = 0;
  filterValue = '';
  pageSize = 10;
  pageIndex = 0;
  pageEvent: PageEvent;
  pageSizeOptions = [5, 10, 25, 100];

  filtersData: any[] = [
    {title: 'Compañia', key: 'ccompania', controlValue: '', data: [], url: '/api/v1/maestros/companias'},
    {title: 'Estatus', key: 'cestatusgeneral', controlValue: '', data: [], url: '/api/v1/maestros/estatus'},
    {title: 'Tipo Contrato', key: 'icontrato', controlValue: '', data: [
      { text: 'Individual', value: 'i'},
      { text: 'Flota', value: 'f'}
    ]},
  ]
  displayedColumns: string[] = ['ccontratoflota', 'xnombre', 'xvehiculo', 'xplaca', 'xcompania', 'star'];
  displayedColumns2: string[] = ['ccontratoflota', 'xnombre', 'xvehiculo', 'xplaca', 'xcompania', 'star'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  currentUser!: any
  first: boolean = true;
  second: boolean = false;

  constructor(private router: Router,
              private _formBuilder: FormBuilder,
              private route: ActivatedRoute, 
              private http: HttpClient,
              private snackBar: MatSnackBar,
              private pdfGenerationService: PdfGenerationService,
              private ItemFormService: ItemFormService) {}

  openSnackBarLoading() {
    this.snackBar.open('Cargando datos...', '');
  }
  closeSnackBar() {
    this.snackBar.dismiss();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.openSnackBarLoading()
    const storedSession = localStorage.getItem('user');
    this.ccompania = localStorage.getItem('ccompania');
    this.currentUser = JSON.parse(storedSession);

    if(this.ccompania != 1){
      const filteredFilterIndex = this.filtersData.findIndex(item => item.key= 'ccompania')
      
      if(filteredFilterIndex != -1) {
        this.filtersData.splice(filteredFilterIndex, 1)
      }
    }
    if(this.currentUser){
      this.http.post(environment.apiUrl + `/api/v1/contracts/search/${this.ccompania}`, {}).subscribe((response: any) => {
        if (response.data.contracts) {
          // this.dataSource.data = response.data.contracts;
          this.paginator.length = response.data.contracts
        }
        this.closeSnackBar()
        this.http.post(environment.apiUrl + `/api/v1/contracts/searchByPage/${0}/${this.pageSize}`, {}).subscribe((response: any) => {
          if (response.data.contracts) {
            this.dataSource.data = response.data.contracts;
          }
          this.closeSnackBar()
        });
      });
    }
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.http.post(environment.apiUrl + `/api/v1/contracts/searchText`, {text: this.filterValue}).subscribe((r: any) => {
      if (r.data.contracts != null) {
        this.paginator.length = r.data.contracts;
        this.pageIndex = 0

        this.http.post(environment.apiUrl + `/api/v1/contracts/searchByPage/${this.pageIndex}/${this.pageSize}`, {}).subscribe((response: any) => {
          if (response.data.contracts) {
            this.dataSource.data = response.data.contracts;
          }
          this.closeSnackBar()
        });

      }
      this.closeSnackBar()
    });
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openPdf(ccontratoflota: any, ccompania: any) {
    let data = {
      ccontratoflota: ccontratoflota,
      cpais: this.currentUser.data.cpais,
      ccompania: ccompania
    }
    const observable = from(this.pdfGenerationService.LoadDataCertifiqued(data));

    observable.subscribe(
      (data) => {

      },
      (error) => {
        console.log(error)
      }
    );

    this.snackBar.open(`Se está generando el Certificado. Por favor espere.`, '', {
      duration: 6000,
    });

  }
  viewReceipts(element: any) {
    this.http.post(environment.apiUrl + `/api/v1/contracts/searchReceipts/${element.ccontratoflota}`,{}).subscribe((response: any) => {
      for (const item of response.receipts) {
        if(!item.mcosto) {
          item.mcosto = 0
        }
        if(!item.mcosto_ext) {
          item.mcosto_ext = 0
        }
        item.mcosto = item.mcosto.toFixed(2)
        item.mcosto_ext = item.mcosto_ext.toFixed(2)
        item.femision = new Date(item.femision)
        item.fdesde_rec = new Date(item.fdesde_rec)
        item.fhasta_rec = new Date(item.fhasta_rec)
      }
      element.receipts = response.receipts
    })

  }
  bankSelect(event: any, element: any) {
    const selectedValue = event.option.value;
    const selectedBank = this.banks.find(bank => bank.text == selectedValue)
    element.cbanco = parseInt(selectedBank.value)
  }
  bankDestinoSelect(event: any, element: any) {
    const selectedValue = event.option.value;
    const selectedBank = this.banks.find(bank => bank.text == selectedValue)
    element.cbanco_destino = parseInt(selectedBank.value)
  }
  
  activateForm(){
    this.first = false;
    this.second = true;
  }
  openPayReceipt(item) {
    if(this.n <= 0) {
      this.http.get(environment.apiUrl + `/api/v1/bancos/getBancos/58`).subscribe((response: any) => {
        this.banks = response.data
        let bancoDestino = null
        let bancoS = null
        if(item.cbanco_destino) {
          const searchBancoDestino = this.banks.find(bank => bank.value == item.cbanco_destino)
          bancoDestino = searchBancoDestino.text
        }
        if(item.cbanco) {
          const searchBanco = this.banks.find(bank => bank.value == item.cbanco)
          bancoS = searchBanco.text
        }
        item.registerPay = false
        item.banco_destino = bancoDestino
        item.bancoS = bancoDestino
      })
      this.n++
    } else {
      let bancoDestino = null
      let bancoS = null
      if(item.cbanco_destino) {
        const searchBancoDestino = this.banks.find(bank => bank.value == item.cbanco_destino)
        bancoDestino = searchBancoDestino.text
      }
      if(item.cbanco) {
        const searchBanco = this.banks.find(bank => bank.value == item.cbanco)
        bancoS = searchBanco.text
      }
      item.registerPay = false
      item.banco_destino = bancoDestino
      item.bancoS = bancoDestino
    }
    this.receiptSelected = item
  }

  registerPayAction(item) {
    console.log(item);
  }

  membership(){
    this.router.navigate(['admin/contratos/create/membership']);
  }
  corporate(){
    this.router.navigate(['admin/contratos/create/corporate']);
  }

  changeDataPage(event:any) {
    this.pageIndex = event.pageIndex
    this.http.post(environment.apiUrl + `/api/v1/contracts/searchByPage/${event.pageIndex}/${event.pageSize}`, {}).subscribe((response: any) => {
      if (response.data.contracts) {
        this.dataSource.data = response.data.contracts;
      }
      this.closeSnackBar()
    });
  }

  changeData(filters: any) {
    this.filters = filters
    this.openSnackBarLoading()
    this.http.post(environment.apiUrl + `/api/v1/contracts/search/${this.ccompania}`, this.filters).subscribe((resp: any) => {
      if (resp.data.contracts != null) {
        this.pageIndex = 0
        this.paginator.pageIndex = 0
        this.http.post(environment.apiUrl + `/api/v1/contracts/searchText`, {text: this.filterValue}).subscribe((r: any) => {
          if (r.data.contracts != null) {
            this.pageIndex = 0
            this.paginator.pageIndex = 0
            this.paginator.length = r.data.contracts;
            this.http.post(environment.apiUrl + `/api/v1/contracts/searchByPage/${this.pageIndex}/${this.pageSize}`, {}).subscribe((response: any) => {
              if (response.data.contracts) {
                this.dataSource.data = response.data.contracts;
              }
              this.closeSnackBar()
            });
          }
        })
      }
      this.closeSnackBar()
    });
  }

}


// Des73jha63.