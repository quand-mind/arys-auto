import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable, from} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatStepper } from '@angular/material/stepper';
import { PdfGenerationService } from '../../../../_services/ServicePDF'
import { PdfGenerationServiceGrua } from '../../../../_services/ServicePDFGrua'
import { PdfGenerationServiceCompra } from '../../../../_services/ServicePDFCompra'
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DateUtilService } from '../../../../_services/date-util.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2'
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemFormService } from './../../../../components/item-form/item-form.service';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

interface QuoteData {
  cproveedor: number;
  crepuesto?: number;
  cservicio?: number;
  cnotificacion: number;
  xobservacion: string;
  mtotalcotizacion: number;
  mtotal: number;
  pimpuesto: number | null;
  cestatusgeneral: number;
  cmoneda: number | null;
  fcreacion: Date;
  cusuariocreacion: number;
  type: string;
  ncantidad?: number;
  xniveldano?: string;
  xproveedor: string | null;
  mmontototal: string;
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CreateNotificationComponent implements OnInit {
  @ViewChild('bottomSheetTemplate') bottomSheetTemplate: TemplateRef<any>;
  @ViewChild('quotesObservation') quotesObservation: TemplateRef<any>;
  @ViewChild('stepper') stepper!: MatStepper;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  replacementSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['ccontratoflota', 'xnombre', 'xvehiculo', 'xplaca', 'xestatusgeneral'];
  replacementColumns: string[] = ['value', 'text'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sortR!: MatSort;
  @ViewChild(MatPaginator) paginatorR!: MatPaginator;
  @ViewChild('Alerta') alertConfirmation!: TemplateRef<any>;
  @ViewChild('Proveedores') proveedoresConfirmation!: TemplateRef<any>;
  @ViewChild('ServiceOrder') serviceOrder!: TemplateRef<any>;
  @ViewChild('repuestosAdd') repuestosAdd!: TemplateRef<any>;
  @ViewChild('trackingAdd') trackingAdd!: TemplateRef<any>;
  @ViewChild('replacement') replacementUpdate!: TemplateRef<any>;
  @ViewChild('newQuotes') newQuotes!: TemplateRef<any>;
  @ViewChild('quoteAcep') quoteAcep!: TemplateRef<any>;
  @ViewChild('quoteAvailable') quoteAvailable!: TemplateRef<any>;
  @ViewChild('quoteAcep2') quoteAcep2!: TemplateRef<any>;

  itemId: any = ''
  times = ['segundos', 'minutos', 'horas', 'días', 'semanas', 'meses']
  eventData: any = {}
  title: any  = ''
  length = 0;
  mode: any = ''
  modeSerOrd: any = ''
  loading: boolean = false;
  type: any = ''
  cservicio: any;
  xservicio: any;
  environmentV = environment.apiUrl
  report: any;
  xservicioCotizacion: any;
  activaCartaGrua = false
  xrepuesto: any;
  xobservacion: any;
  xproveedor: any;
  ncantidad: any;
  ccotizacionOrden: any;
  items: any;
  montoTotalRepuesto: any;
  moneda: any;
  montoConIva: any;
  validForm: any = false;

  sub = new Subscription()
  currentUser!: any
  isLinear = false;
  selectAll: boolean = false;
  quoteDetailsDisable: boolean = false;
  information = false;
  ccotizacion: any;
  ccompania: any = ''
  currentFilterValue = '';
  isModalActive: boolean = false; 
  activateFirst: boolean = false;
  activaGrua: boolean = false;
  activaReplacements: boolean = false;
  isEditButtonVisible: boolean = true;
  cotizacionesAceptadas: boolean = false;
  displayCotizacionOrder: boolean = false
  dialogRef: MatDialogRef<any>;
  notificationTypeList: any[] = [];
  claimCauseList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  tracingTypeList: any[] = [];
  tracingMotiveList: any[] = [];
  selectedReplacement: any[] = [];
  serviceList: any[] = [];
  additionalServiceList: any[] = [];
  providerList: any[] = [];
  providerAllList: any[] = [];
  providerSelectedList: any[] = [];
  providerFinallyList: any[] = [];
  formServicesQuotes: any[] = [];
  statusList: any[] = [];
  filteredData: any = [];
  replacementList: any[] = [];
  filteredSeguimientosData: any = [];
  seguimientosList: any[] = [];
  filteredRepuestosData: any = [];
  filteredProveedoresData: any = [];
  proveedorSelected: any = [];
  filteredServiceOrderData: any = [];
  serviceOrderList: any = [];
  replacementEventsList: any = [];
  coinList: any = [];
  filteredReplacementData: any = [];
  quotesList: any[] = [];
  filteredQuotesData: any = [];
  serviceQuoteList: any = [];
  replacementQuoteList: any = [];
  quotesAceptedList: any = [];
  quotesAceptedOrders: any = [];
  quotesFinallyAceptedList: any = [];
  selectedItems: any[] = [];
  aceptedQuotes:any = []

  currentCode: string | null = null;
  currentValue: string | null = null;
  selectedServiceId: number | null = null;

  filtersSeguimientos : any = {}
  filtersRespuestosProveedores : any = {}
  repuestoSelected: any = {}
  filtersProveedores : any = {}

  notificationTypeControl = new FormControl('');
  claimCauseControl = new FormControl('');
  stateControl = new FormControl('');
  cityControl = new FormControl('');
  tracingTypeControl = new FormControl('');
  tracingMotiveControl = new FormControl('');
  serviceControl = new FormControl('');
  additionalServiceControl = new FormControl('');
  providerControl = new FormControl('');
  replacementEventsControl = new FormControl('');
  aceptedQuotesEventControl = new FormControl('');
  Control = new FormControl('');
  coinControl = new FormControl('');

  formType: any = 'create';
  trackingSelected: any = {}
  filteredNotificationType!: Observable<string[]>;
  filteredClaimCause!: Observable<string[]>;
  filteredState!: Observable<string[]>;
  filteredCity!: Observable<string[]>;
  filteredTracingType!: Observable<string[]>;
  filteredTracingMotive!: Observable<string[]>;
  filteredService!: Observable<string[]>;
  filteredAdditionalService!: Observable<string[]>;
  filteredProvider!: Observable<string[]>;
  filteredReplacementEvents!: Observable<string[]>;
  filteredCoin!: Observable<string[]>;

  camposSiniestros: { [key: string]: string } = { // Mapa de nombres de campo
    ctiponotificacion: 'Tipo de Notificación',
    ccausasiniestro: 'Causa del Evento',
    xnombrecompleto: 'Nombre y Apellido',
    xtelefonosiniestro: 'Teléfono',
    fevento: 'Fecha del Evento',
    hevento: 'Hora del Evento',
    xdireccion: 'Dirección',
    xdescripcion: 'Descripción del Accidente'
  };

  camposSiniestrosModal: { [key: string]: string } = { // Mapa de nombres de campo
    ctiposeguimiento: 'Tipo de Seguimiento',
    cmotivoseguimiento: 'Motivo de Seguimiento',
    fseguimiento: 'Fecha de Seguimiento',
    nalerta: 'Tiempo de Recordatorio',
    xintervalo: 'Intervalo de Recordatorio',
    xobservacion_s: 'Observación de Seguimiento',
  };

  camposOrdenModal: { [key: string]: string } = { // Mapa de nombres de campo
    xobservacion: 'Observación de la Orden de Servicio',
    fajuste: 'Fecha de Ajuste',
    cservicio: 'Servicio Requerido o Servicio Adicional',
    cproveedor: 'Proveedor según Servicio seleccionado' ,
  };

  camposCotiModal: { [key: string]: string } = { // Mapa de nombres de campo
    munitariorepuesto: 'Monto Unitario por Pieza Afectada',
    cmoneda: 'Moneda',
    mtotalrepuesto: 'Monto Total por Pieza Afectada',
  };

  filtroNombre: string = '';
  
  public page = 1;
  public pageSize = 5;
  public pageSeguimientos = 1;
  public pageSeguimientosSize = 5;
  public pageNotas = 1;
  public pageNotasSize = 5;
  public pageOrdenes = 1;
  public pageOrdenesSize = 5;
  public pageRespuestosProveedores = 1;
  public pageRespuestosProveedoresSize = 5;
  public pageRespuestos = 1;
  public pageRespuestosSize = 5;
  public pageQuotes = 1;
  public pageQuotesSize = 5;

  pageAll = 1;
  pageSizeAll = 6;

  pageIndex = 0;
  pageEvent: PageEvent;
  pageSizeOptions = [5, 10, 25, 100];

  pageSelected = 1;
  pageSizeSelected = 6;

  constructor(private _formBuilder: FormBuilder,
              private http: HttpClient,
              readonly dialog: MatDialog,
              private modalService: NgbModal,
              private dateAdapter: DateAdapter<Date>,
              private dateUtilService: DateUtilService,
              private pdfGenerationService: PdfGenerationService,
              private pdfGenerationServiceGrua: PdfGenerationServiceGrua,
              private pdfGenerationServiceCompra: PdfGenerationServiceCompra,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router,
              public ItemFormService: ItemFormService,
              private bottomSheet: MatBottomSheet
              ) {
                dateAdapter.setLocale('es');
              }


  contractFormGroup = this._formBuilder.group({
    ccompania: [{ value: '', disabled: true }],
    xpropietario: [{ value: '', disabled: true }],
    xcedula: [{ value: '', disabled: true }],
    xtelefono: [{ value: '', disabled: true }],
    xdireccion: [{ value: '', disabled: true }],
    xcorreo: [{ value: '', disabled: true }],
    fdesde: [{ value: '', disabled: true }],
    fhasta: [{ value: '', disabled: true }],
    xestatusgeneral: [{ value: '', disabled: true }],
    ccontratoflota: [{ value: '', disabled: true }],
  });

  vehicleFormGroup = this._formBuilder.group({
    xplaca: [{ value: '', disabled: true }],
    xmarca: [{ value: '', disabled: true }],
    xmodelo: [{ value: '', disabled: true }],
    xversion: [{ value: '', disabled: true }],
    fano: [{ value: '', disabled: true }],
    xcolor: [{ value: '', disabled: true }],
    xserialcarroceria: [{ value: '', disabled: true }],
    xserialmotor: [{ value: '', disabled: true }],
    xtipo: [{ value: '', disabled: true }],
  });

  seguimientosFormGroup = this._formBuilder.group({
    seguimientos: this._formBuilder.array([]),
  })
  notasList: any = []
  notasFormGroup = this._formBuilder.group({
    notas: this._formBuilder.array([]),
  })

  claimFormGroup = this._formBuilder.group({
    ctiponotificacion: ['' , Validators.required],
    ccausasiniestro: ['' , Validators.required],
    xnombrecompleto: ['' , Validators.required],
    xtelefonosiniestro: ['' , Validators.required],
    xnombrecompleto_al: ['' ],
    xtelefono_al: ['' ],
    fevento: ['' , Validators.required],
    hevento: ['' , Validators.required],
    cestado: ['' ],
    cciudad: ['' ],
    xciudad: ['' ],
    xestado: ['' ],
    xdireccion: ['' , Validators.required],
    xdescripcion: ['' , Validators.required],
    xobservacion: ['' ],
    bdano: [false],
    btransitar: [false],
    blesionado: [false],
    bdanootro: [false],
    bpropietario: [false],
    btransito: [false],
    bcarga: [false],
    bpasajero: [false],
    ctiposeguimiento: ['' ],
    xtiposeguimiento: ['' ],
    cmotivoseguimiento: [''],
    xmotivoseguimiento: ['' ],
    fseguimiento: [''],
    nalerta: [''],
    xintervalo: ['segundos'],
    // ntiempoalerta: ["1"],
    xobservacion_s: [''],
    bcerrado: [false],
    brepuesto: [false],
    ncantidad: [''],
    xniveldano: [''],
    crepuesto: ['']
  });

  gruaFormGroup = this._formBuilder.group({
    cmoneda: [''],
    xmoneda: ['', Validators.required],
    xorigen_grua: ['', Validators.required],
    xdestino_grua: ['', Validators.required],
    mmonto: ['', Validators.required],
  })
  serviceOrderFormGroup = this._formBuilder.group({
    corden: [''],
    cnotificacion: [''],
    xcotizacion: [''],
    ccotizacion: [''],
    ccontratoflota: [{ value: '', disabled: true }],
    xnombrecompleto: [{ value: '', disabled: true }],
    xnombre_al: [{ value: '', disabled: true }],
    xdescripcion: [{ value: '', disabled: true }],
    xobservacion: ['', Validators.required],
    fsolicitud: [{ value: '', disabled: true }],
    fajuste: ['', Validators.required],
    xvehiculo: [{ value: '', disabled: true }],
    xplaca: [{ value: '', disabled: true }],
    cservicio: ['', Validators.required],
    xservicio: [''],
    cservicio_adicional: [''],
    xservicio_adicional: [''],
    cproveedor: ['', Validators.required],
    xproveedor: [''],
    cestatusgeneral: [''],
    crepuesto: [''],
    xrepuesto: [''],
    cmoneda: [''],
    xmoneda: [''],
    xorigen_grua: [''],
    xdestino_grua: [''],
    mmonto: [''],
    orden: this._formBuilder.array([]),
  })

  replacementFormGroup = this._formBuilder.group({
    replacement: this._formBuilder.array([]),
  })

  quotesFormGroup = this._formBuilder.group({
    quotes: this._formBuilder.array([]),
    xobservacion: [''],
    munitariorepuesto: ['', Validators.required],
    cmoneda: ['', Validators.required],
    mtotalrepuesto: ['', Validators.required],
    bdisponible: [false],
    ncantidad: ['']
  })

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  get seguimientos() {
    return this.seguimientosFormGroup.get('segumientos') as FormArray;
  }
  get notas() {
    return this.notasFormGroup.get('notas') as FormArray;
  }

  get orden() {
    return this.serviceOrderFormGroup.get('orden') as FormArray;
  }

  get replacement() {
    return this.replacementFormGroup.get('replacement') as FormArray;
  }

  get quotes() {
    return this.quotesFormGroup.get('quotes') as FormArray;
  }

  get paginatedProviderAllList() {
    const start = (this.pageAll - 1) * this.pageSizeAll;
    const end = this.pageAll * this.pageSizeAll;
    return this.providerAllList.slice(start, end);
  }
  get leftColumnProviderAll() {
    return this.paginatedProviderAllList.slice(0, this.paginatedProviderAllList.length / 2);
  }
  get rightColumnProviderAll() {
    return this.paginatedProviderAllList.slice(this.paginatedProviderAllList.length / 2);
  }
  get paginatedProviderSelectedList() {
    const start = (this.pageSelected - 1) * this.pageSizeSelected;
    const end = this.pageSelected * this.pageSizeSelected;
    return this.providerSelectedList.slice(start, end);
  }
  get leftColumnProviderSelected() {
    return this.paginatedProviderSelectedList.slice(0, this.paginatedProviderSelectedList.length / 2);
  }
  get rightColumnProviderSelected() {
    return this.paginatedProviderSelectedList.slice(this.paginatedProviderSelectedList.length / 2);
  }

  addSeguimiento() {
    const seguimiento = this._formBuilder.group({
      // Define your form controls here
      ctiposeguimiento: [this.claimFormGroup.get('ctiposeguimiento').value, Validators.required],
      cmotivoseguimiento: [this.claimFormGroup.get('cmotivoseguimiento').value, Validators.required],
      fseguimiento: [this.claimFormGroup.get('fseguimiento').value, Validators.required],
      nalerta: [this.claimFormGroup.get('nalerta').value, Validators.required],
      xintervalo: [this.claimFormGroup.get('xintervalo').value, Validators.required],
      // ntiempoalerta: [this.claimFormGroup.get('ntiempoalerta').value, Validators.required],
      xobservacion_s: [this.claimFormGroup.get('xobservacion_s').value, Validators.required],
      xmotivoseguimiento: [this.claimFormGroup.get('xmotivoseguimiento').value, Validators.required],
      xtiposeguimiento: [this.claimFormGroup.get('xtiposeguimiento').value, Validators.required],
      cnotificacion: [this.itemId],
      bcerrado: [this.claimFormGroup.get('bcerrado')],
    });
  
    // Add the new form group to the FormArray
    // this.filteredSeguimientosData
    const xtiposeg = this.tracingTypeList.find(type => type.id == this.claimFormGroup.get('ctiposeguimiento').value)
    const xmotivoseg = this.tracingMotiveList.find(type => type.id == this.claimFormGroup.get('cmotivoseguimiento').value)
    this.claimFormGroup.get('fseguimiento')?.setValue(new Date())
    this.seguimientosList.push({
      xtiposeguimiento: xtiposeg.value,
      ctiposeguimiento: this.claimFormGroup.get('ctiposeguimiento').value,
      xmotivoseguimiento: xmotivoseg.value,
      cmotivoseguimiento: this.claimFormGroup.get('cmotivoseguimiento').value,
      ccontratoflota: this.contractFormGroup.get('ccontratoflota').value,
      // ntiempoalerta: this.claimFormGroup.get('ntiempoalerta').value,
      fseguimientonotificacion: this.claimFormGroup.get('fseguimiento').value,
      nalerta: this.claimFormGroup.get('nalerta').value,
      xintervalo: this.claimFormGroup.get('xintervalo').value,
      xfseguimientonotificacion: this.dateUtilService.formatDate(this.claimFormGroup.get('fseguimiento').value),
      xobservacion: this.claimFormGroup.get('xobservacion_s').value,
      bcerrado: this.claimFormGroup.get('bcerrado').value,
      type: 'create',
      cnotificacion: this.itemId,
    })

    this.dialog.closeAll()
  }

  editSeguimiento() {
    const searchedId = this.seguimientosList.findIndex(seg => seg.cseguimientonotificacion == this.trackingSelected.cseguimientonotificacion)
    this.seguimientosList[searchedId].bcerrado = this.claimFormGroup.get('bcerrado').value
    // this.seguimientosList[searchedId].ntiempoalerta = this.claimFormGroup.get('ntiempoalerta').value

    this.dialog.closeAll()
  }

  ngOnInit(): void {
    this.sub = this.route.data.subscribe(v => {
      this.mode = v.mode
      this.type = v.type
      this.title = v.title
    })

    this.route.url.subscribe( v => {
      if(this.mode == 'update'){
        this.itemId = parseInt(v[2].path)
        this.title += ' ' + this.itemId
      }
    })
    
    this.ccompania = localStorage.getItem('ccompania');
    const fechaHoraActual = new Date();
    const horaActual = fechaHoraActual.getHours().toString().padStart(2, '0') + ':' +
                       fechaHoraActual.getMinutes().toString().padStart(2, '0');
    
    this.claimFormGroup.get('fevento')?.setValue(fechaHoraActual);
    this.claimFormGroup.get('hevento')?.setValue(horaActual);
    this.claimFormGroup.get('fseguimiento')?.setValue(fechaHoraActual);
    // this.claimFormGroup.get('ntiempoalerta')?.setValue(horaActual);
    this.serviceOrderFormGroup.get('fsolicitud')?.setValue(fechaHoraActual);
    this.serviceOrderFormGroup.get('fajuste')?.setValue(fechaHoraActual);

    const storedSession = localStorage.getItem('user');
    this.currentUser = JSON.parse(storedSession);
    if(this.currentUser){
      this.contractFormGroup.get('ccompania')?.setValue(this.currentUser.data.ccompania)
      //Buscar todas la Listas
      this.getContracts();
      this.getNotificationType();
      this.getClaimCause();
      this.getState();
      this.getReplacement();
      this.getTracingType();
      this.getTracingMotive();
    }
    this.getStatusGeneral()
    if(this.mode == 'update'){
      this.claimFormGroup.disable()
      this.http.post(environment.apiUrl + `/api/v1/events/get/${this.itemId}`, {}).subscribe((response: any) => {
        if (response.data.result) {
          this.eventData = response.data.result[0];
          this.handleRowClick(this.eventData.ccontratoflota)

          this.http.post(environment.apiUrl + `/api/v1/events/get/${this.itemId}`, {}).subscribe((response2: any) => {
            this.claimFormGroup.get('ctiponotificacion').setValue(response2.data.result[0].ctiponotificacion)
            this.claimFormGroup.get('xdireccion').setValue(response2.data.result[0].xdireccion)
            this.claimFormGroup.get('xdescripcion').setValue(response2.data.result[0].xdescripcion)
            this.claimFormGroup.get('ccausasiniestro').setValue(this.eventData.ccausasiniestro)
            this.claimFormGroup.get('bdano').setValue(response2.data.result[0].bdano)
            this.claimFormGroup.get('btransitar').setValue(response2.data.result[0].btransitar)
            this.claimFormGroup.get('blesionado').setValue(response2.data.result[0].blesionado)
            this.claimFormGroup.get('bdanootro').setValue(response2.data.result[0].bdanootro)
            this.claimFormGroup.get('bpropietario').setValue(response2.data.result[0].bpropietario)
            this.claimFormGroup.get('btransito').setValue(response2.data.result[0].btransito)
            this.claimFormGroup.get('bcarga').setValue(response2.data.result[0].bcarga)
            this.claimFormGroup.get('bpasajero').setValue(response2.data.result[0].bpasajero)
            const fechaHoraActual = new Date(response2.data.result[0].fevento);
            const horaActual = fechaHoraActual.getHours().toString().padStart(2, '0') + ':' +
                       fechaHoraActual.getMinutes().toString().padStart(2, '0');
            console.log('horita',response2.data.result[0].fevento);
            this.claimFormGroup.get('fevento')?.setValue(fechaHoraActual);
            this.claimFormGroup.get('hevento')?.setValue(horaActual);
            this.notificationTypeControl.setValue(this.eventData.xtiponotificacion)
            this.claimCauseControl.setValue(this.eventData.xcausasiniestro)
          })
          this.http.post(environment.apiUrl + `/api/v1/events/getSeguimientosById/${this.itemId}`, {}).subscribe((response: any) => {
            if (response.data) {
              this.filteredSeguimientosData = response.data.result;
              for (const seguimiento of this.filteredSeguimientosData) {
                seguimiento.type = 'update'
              }
              this.seguimientosList = this.filteredSeguimientosData;
            } 
          });
          this.http.post(environment.apiUrl + `/api/v1/events/getServiceOrderById/${this.itemId}`, {}).subscribe((response: any) => {
            if (response.data) {
              this.filteredServiceOrderData = response.data;
              this.serviceOrderList = this.filteredServiceOrderData;
            } 
          });
          this.http.post(environment.apiUrl + `/api/v1/events/getNotasById/${this.itemId}`, {}).subscribe((response: any) => {
            if (response.data) {
              // this.filteredServiceOrderData = response.data;
              this.notasList = response.data;
            } 
          });
          this.http.post(environment.apiUrl + `/api/v1/events/getReplacementById/${this.itemId}`, {}).subscribe((response: any) => {
            if (response.data) {
              this.filteredReplacementData = response.data;
              this.replacementEventsList = this.filteredReplacementData;
              this.selectedReplacement = this.filteredReplacementData;
            } 
          });
          this.http.post(environment.apiUrl + `/api/v1/events/getQuotesById/${this.itemId}`, {}).subscribe((response: any) => {
            if (response.data) {
              this.filteredQuotesData = response.data;
              
              this.aceptedQuotes = this.filteredQuotesData.filter(quote => {
                if(quote.cestatusgeneral == 4) {
                  return quote
                }
              })
              this.aceptedQuotesEventControl.enable()
              // this.providerFinallyList = this.filteredQuotesData;
            } 
          });
        }
      });
      this.notificationTypeControl.disable()
      this.claimCauseControl.disable()
      this.stateControl.disable()
      this.cityControl.disable()
      this.tracingMotiveControl.disable()
      this.tracingTypeControl.disable()
      
    }
  }

  getContracts() {
    const ccompania = this.currentUser.data.ccompania;
    
    const data = {
      cpais: this.currentUser.data.cpais,
      ccompania: ccompania === 1 ? this.contractFormGroup.get('ccompania')?.value : ccompania
    };
    
    this.http.post(environment.apiUrl + `/api/v1/contracts/search/${data.ccompania}`, {}).subscribe((response: any) => {
      if (response.data.contracts) {
        this.paginator.length = response.data.contracts
        this.http.post(environment.apiUrl + `/api/v1/contracts/searchByPage/${0}/${this.pageSize}`, {}).subscribe((response: any) => {
          if (response.data.contracts) {
            this.dataSource.data = response.data.contracts;
          }
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.http.post(environment.apiUrl + `/api/v1/contracts/searchText`, {text: filterValue}).subscribe((r: any) => {
      if (r.data.contracts != null) {
        this.paginator.length = r.data.contracts;
        this.pageIndex = 0

        this.http.post(environment.apiUrl + `/api/v1/contracts/searchByPage/${this.pageIndex}/${this.pageSize}`, {}).subscribe((response: any) => {
          if (response.data.contracts) {
            this.dataSource.data = response.data.contracts;
          }
        });

      }
    });
  }

  handleRowClick(ccontratoflota: any) {
    let data = {
      ccontratoflota: ccontratoflota,
    }
    this.http.post(environment.apiUrl + '/api/v1/contracts/detail', data).subscribe(async (response: any) => {
      if (response.status) {
        this.information = true;
        //Datos del Vehiculo
        this.vehicleFormGroup.get('xmarca')?.setValue(response.detail.xmarca);
        this.vehicleFormGroup.get('xmodelo')?.setValue(response.detail.xmodelo);
        this.vehicleFormGroup.get('xversion')?.setValue(response.detail.xversion);
        this.vehicleFormGroup.get('fano')?.setValue(response.detail.fano);
        this.vehicleFormGroup.get('xplaca')?.setValue(response.detail.xplaca);
        this.vehicleFormGroup.get('xcolor')?.setValue(response.detail.xcolor);
        this.vehicleFormGroup.get('xserialcarroceria')?.setValue(response.detail.xserialcarroceria);
        this.vehicleFormGroup.get('xserialmotor')?.setValue(response.detail.xserialmotor);
        this.vehicleFormGroup.get('xtipo')?.setValue(response.detail.xclase_rcv);

        //Datos en General
        this.contractFormGroup.get('ccontratoflota')?.setValue(ccontratoflota);
        this.contractFormGroup.get('xpropietario')?.setValue(response.detail.xnombre + ' ' + response.detail.xapellido);
        this.contractFormGroup.get('xcedula')?.setValue(response.detail.icedula + '-' + response.detail.xcedula);
        this.contractFormGroup.get('xtelefono')?.setValue(response.detail.xtelefono);
        this.contractFormGroup.get('xdireccion')?.setValue(response.detail.xdireccion);
        this.contractFormGroup.get('xcorreo')?.setValue(response.detail.xcorreo);
        this.contractFormGroup.get('fdesde')?.setValue(response.detail.fdesde);
        this.contractFormGroup.get('fhasta')?.setValue(response.detail.fhasta);
        this.contractFormGroup.get('xestatusgeneral')?.setValue(response.detail.xestatusgeneral);

        //Aquí igualo el nombre y telefono como predeterminado
        this.claimFormGroup.get('xnombrecompleto')?.setValue(response.detail.xnombre + ' ' + response.detail.xapellido)
        this.claimFormGroup.get('xtelefonosiniestro')?.setValue(response.detail.xtelefono)

        this.getService();
      }
    })
  }

  getNotificationType(){
    let data = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    }
    this.http.post(environment.apiUrl + '/api/v1/valrep/notification-type', data).subscribe((response: any) => {
      if (response.data.notificationtype) {
        for (let i = 0; i < response.data.notificationtype.length; i++) {
          this.notificationTypeList.push({
            id: response.data.notificationtype[i].ctiponotificacion,
            value: response.data.notificationtype[i].xtiponotificacion,
          });
        }
        this.filteredNotificationType = this.notificationTypeControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterNotificationType(value || ''))
        );
      }
    });
  }

  private _filterNotificationType(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.notificationTypeList
      .map(type => type.value)
      .filter(type => type.toLowerCase().includes(filterValue));
  }

  onNotificationTypeSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedType = this.notificationTypeList.find(type => type.value === selectedValue);
    if (selectedType) {
      this.claimFormGroup.get('ctiponotificacion')?.setValue(selectedType.id);
    }
  }

  getClaimCause(){
    let data = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    }
    this.http.post(environment.apiUrl + '/api/v1/valrep/claim-cause', data).subscribe((response: any) => {
      if (response.data.claim) {
        for (let i = 0; i < response.data.claim.length; i++) {
          this.claimCauseList.push({
            id: response.data.claim[i].ccausasiniestro,
            value: response.data.claim[i].xcausasiniestro,
          });
        }
        this.filteredClaimCause = this.claimCauseControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterClaimCause(value || ''))
        );
      }
    });
  }

  private _filterClaimCause(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.claimCauseList
      .map(claim => claim.value)
      .filter(claim => claim.toLowerCase().includes(filterValue));
  }

  onClaimCauseSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedClaim = this.claimCauseList.find(claim => claim.value === selectedValue);
    if (selectedClaim) {
      this.claimFormGroup.get('ccausasiniestro')?.setValue(selectedClaim.id);
    }
  }

  getState(){
    let data = {
      cpais: this.currentUser.data.cpais
    };
    this.http.post(environment.apiUrl + '/api/v1/valrep/state', data).subscribe((response: any) => {
      this.stateList = []
      if (response.data.state) {
        for (let i = 0; i < response.data.state.length; i++) {
          this.stateList.push({
            id: response.data.state[i].cestado,
            value: response.data.state[i].xdescripcion_l
          });
        }
        this.stateList.sort((a, b) => a.value > b.value ? 1 : -1)

        const selectedState = this.stateList.find(state => state.id === 1);
        if (selectedState) {
            this.claimFormGroup.get('cestado')?.setValue(selectedState.id);
            this.claimFormGroup.get('xestado')?.setValue(selectedState.value);
            this.getCity()
        }

        this.filteredState = this.stateControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterState(value || ''))
        );
      }
    });
  }

  private _filterState(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.stateList
      .map(state => state.value)
      .filter(state => state.toLowerCase().includes(filterValue));
  }

  onStateSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedState = this.stateList.find(state => state.value === selectedValue);
    if (selectedState) {
      this.claimFormGroup.get('cestado')?.setValue(selectedState.id);
      this.getCity();
    }
  }

  getCity(){
    let data = {
      cpais: this.currentUser.data.cpais,
      cestado: this.claimFormGroup.get('cestado')?.value
    };
    this.http.post(environment.apiUrl + '/api/v1/valrep/city', data).subscribe((response: any) => {
      if (response.data.city) {
        this.cityList = []
        for (let i = 0; i < response.data.city.length; i++) {
          this.cityList.push({
            id: response.data.city[i].cciudad,
            value: response.data.city[i].xdescripcion_l
          });
        }
        this.cityList.sort((a, b) => a.value > b.value ? 1 : -1)

        const selectedCity = this.cityList.find(city => city.id === 1);
        if (selectedCity) {
            this.claimFormGroup.get('cciudad')?.setValue(selectedCity.id);
            this.claimFormGroup.get('xciudad')?.setValue(selectedCity.value);
        }
        this.filteredCity = this.cityControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCity(value || ''))
        );
      }
    });
  }

  private _filterCity(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.cityList
      .map(city => city.value)
      .filter(city => city.toLowerCase().includes(filterValue));
  }

  onCitySelection(event: any) {
    const selectedValue = event.option.value;
    const selectedCity = this.cityList.find(city => city.value === selectedValue);
    if (selectedCity) {
      this.claimFormGroup.get('cciudad')?.setValue(selectedCity.id);
    }
  }

  saveNotification() {
    if (!this.claimFormGroup.valid && this.claimFormGroup.invalid) {
      let camposFaltantes = '';
      camposFaltantes += '<br>- '; // Iniciar con un salto de línea y guión
      Object.keys(this.claimFormGroup.controls).forEach(key => {
          const control = this.claimFormGroup.get(key);
          if (control && control.invalid) { // Agregar verificación de nulidad
              camposFaltantes += this.camposSiniestros[key] + '<br>-'; // Usar el mapa de nombres de campo y agregar un salto de línea
          }
      });
      camposFaltantes = camposFaltantes.slice(0, -5); // Eliminar el espacio extra al final
      
      Swal.fire({
          title: "Por favor, complete los siguientes campos: <br>",
          html: `${camposFaltantes}`, // Usar html en lugar de text
          icon: "warning",
          confirmButtonText: "<strong>Aceptar</strong>",
          confirmButtonColor: "#fcb203d1",
      });
    } else {
      this.onSubmit()
    }
  }
  onNextStep() {
    if (!this.claimFormGroup.valid && this.claimFormGroup.invalid) {
      
      let camposFaltantes = '';
      camposFaltantes += '<br>- '; // Iniciar con un salto de línea y guión
      Object.keys(this.claimFormGroup.controls).forEach(key => {
          const control = this.claimFormGroup.get(key);
          if (control && control.invalid) { // Agregar verificación de nulidad
              camposFaltantes += this.camposSiniestros[key] + '<br>-'; // Usar el mapa de nombres de campo y agregar un salto de línea
          }
      });
      camposFaltantes = camposFaltantes.slice(0, -5); // Eliminar el espacio extra al final
      
      Swal.fire({
          title: "Por favor, complete los siguientes campos: <br>",
          html: `${camposFaltantes}`, // Usar html en lugar de text
          icon: "warning",
          confirmButtonText: "<strong>Aceptar</strong>",
          confirmButtonColor: "#fcb203d1",
      });
    } else {
      this.stepper.next();
      this.Alert()
    }
  }
  onBackStep() {
    if (this.claimFormGroup.valid) {
      this.stepper.next();
      this.Alert()
    } else {
      let camposFaltantes = '';
      camposFaltantes += '<br>- '; // Iniciar con un salto de línea y guión
      Object.keys(this.claimFormGroup.controls).forEach(key => {
          const control = this.claimFormGroup.get(key);
          if (control && control.invalid) { // Agregar verificación de nulidad
              camposFaltantes += this.camposSiniestros[key] + '<br>-'; // Usar el mapa de nombres de campo y agregar un salto de línea
          }
      });
      camposFaltantes = camposFaltantes.slice(0, -4); // Eliminar el espacio extra al final
      
      Swal.fire({
          title: "Por favor, complete los siguientes campos: <br>",
          html: `${camposFaltantes}`, // Usar html en lugar de text
          icon: "warning",
          confirmButtonText: "<strong>Aceptar</strong>",
          confirmButtonColor: "#fcb203d1",
      });
    }
  }

  onNextStepTracing() {
    if (this.claimFormGroup.valid) {
      // this.stepper.next();
      const xtiposeg = this.tracingTypeList.find(type => type.id == this.claimFormGroup.get('ctiposeguimiento').value)
      const xmotivoseg = this.tracingMotiveList.find(type => type.id == this.claimFormGroup.get('cmotivoseguimiento').value)
      this.seguimientosList.push({
        xtiposeguimiento: xtiposeg.value,
        ctiposeguimiento: this.claimFormGroup.get('ctiposeguimiento').value,
        xmotivoseguimiento: xmotivoseg.value,
        cmotivoseguimiento: this.claimFormGroup.get('cmotivoseguimiento').value,
        ccontratoflota: this.contractFormGroup.get('ccontratoflota').value,
        nalerta: this.claimFormGroup.get('nalerta').value,
        xintervalo: this.claimFormGroup.get('xintervalo').value,
        fseguimientonotificacion: this.claimFormGroup.get('fseguimiento').value,
        xfseguimientonotificacion: this.dateUtilService.formatDate(this.claimFormGroup.get('fseguimiento').value),
        xobservacion: this.claimFormGroup.get('xobservacion_s').value,
        bcerrado: this.claimFormGroup.get('bcerrado').value,
        type: 'create',
        cnotificacion: this.itemId,
      })
      this.dialogRef.close();
      this.onSubmit();
    } else {
      let camposFaltantes = '';
      camposFaltantes += '<br>- '; // Iniciar con un salto de línea y guión
      Object.keys(this.claimFormGroup.controls).forEach(key => {
          const control = this.claimFormGroup.get(key);
          if (control && control.invalid) { // Agregar verificación de nulidad
              camposFaltantes += this.camposSiniestrosModal[key] + '<br>-'; // Usar el mapa de nombres de campo y agregar un salto de línea
          }
      });
      camposFaltantes = camposFaltantes.slice(0, -4); // Eliminar el espacio extra al final
      
      Swal.fire({
          title: "Por favor, complete los siguientes campos: <br>",
          html: `${camposFaltantes}`, // Usar html en lugar de text
          icon: "warning",
          confirmButtonText: "<strong>Aceptar</strong>",
          confirmButtonColor: "#fcb203d1",
      });
    }
  }

  onNextStepProveedor() {
    if (this.claimFormGroup.valid) {
      this.stepper.next();
      this.dialogRef.close();
      this.Proveedores();
    } else {
      let camposFaltantes = '';
      camposFaltantes += '<br>- '; // Iniciar con un salto de línea y guión
      Object.keys(this.claimFormGroup.controls).forEach(key => {
          const control = this.claimFormGroup.get(key);
          if (control && control.invalid) { // Agregar verificación de nulidad
              camposFaltantes += this.camposSiniestrosModal[key] + '<br>-'; // Usar el mapa de nombres de campo y agregar un salto de línea
          }
      });
      camposFaltantes = camposFaltantes.slice(0, -4); // Eliminar el espacio extra al final
      
      Swal.fire({
          title: "Por favor, complete los siguientes campos: <br>",
          html: `${camposFaltantes}`, // Usar html en lugar de text
          icon: "warning",
          confirmButtonText: "<strong>Aceptar</strong>",
          confirmButtonColor: "#fcb203d1",
      });
    }
  }

  onNextStepServiceOrder() {
    this.quotesFinallyAceptedList = []
    if (this.serviceOrderFormGroup.valid) {
      // this.stepper.next();
      this.dialogRef.close();
      if(this.formType == 'create'){
        this.addServiceOrder()
      }else{
        this.getEditSerOrd()
      }

    } else {
      let camposFaltantes = '';
      camposFaltantes += '<br>- '; // Iniciar con un salto de línea y guión
      Object.keys(this.serviceOrderFormGroup.controls).forEach(key => {
          const control = this.serviceOrderFormGroup.get(key);
          if (control && control.invalid) { // Agregar verificación de nulidad
              camposFaltantes += this.camposOrdenModal[key] + '<br>-'; // Usar el mapa de nombres de campo y agregar un salto de línea
          }
      });
      camposFaltantes = camposFaltantes.slice(0, -4); // Eliminar el espacio extra al final
      
      Swal.fire({
          title: "Por favor, complete los siguientes campos: <br>",
          html: `${camposFaltantes}`, // Usar html en lugar de text
          icon: "warning",
          confirmButtonText: "<strong>Aceptar</strong>",
          confirmButtonColor: "#fcb203d1",
      });
    }
  }
  closeQuoteAcepted() {
    this.dialogRef.close();
    this.quotesFormGroup.get('munitariorepuesto').setValue('')
    this.quotesFormGroup.get('cmoneda').setValue('')
    this.quotesFormGroup.get('ncantidad').setValue('')
    this.quotesFormGroup.get('mtotalrepuesto').setValue('')
  }

  onNextStepQuoteAcepted() {
    if (this.quotesFormGroup.valid) {
      this.validForm = true
    } else {
      
      let camposFaltantes = '';
      camposFaltantes += '<br>- '; // Iniciar con un salto de línea y guión
      Object.keys(this.quotesFormGroup.controls).forEach(key => {
          const control = this.quotesFormGroup.get(key);
          if (control && control.invalid) { // Agregar verificación de nulidad
              camposFaltantes += this.camposCotiModal[key] + '<br>-'; // Usar el mapa de nombres de campo y agregar un salto de línea
          }
      });
      camposFaltantes = camposFaltantes.slice(0, -4); // Eliminar el espacio extra al final
      
      Swal.fire({
          title: "Por favor, complete los siguientes campos: <br>",
          html: `${camposFaltantes}`, // Usar html en lugar de text
          icon: "warning",
          confirmButtonText: "<strong>Aceptar</strong>",
          confirmButtonColor: "#fcb203d1",
      });
      this.validForm = false
      const itemNotChecked = this.replacementQuoteList.find(item => item.crepuesto == this.items.crepuesto)
      if(itemNotChecked) {
        console.log(itemNotChecked);
        itemNotChecked.bdisponible = false
      }
    }
  }

  openSeguimientosForm() {
      // this.stepper.next();
      // this.dialogRef.close();
      this.formType = 'create'
      this.notificationTypeControl.enable()
      this.claimCauseControl.enable()
      this.stateControl.enable()
      this.cityControl.enable()
      this.tracingMotiveControl.enable()
      this.tracingMotiveControl.setValue('')
      this.tracingTypeControl.enable()
      this.tracingTypeControl.setValue('')
      this.claimFormGroup.enable()
      this.Seguimientos();
  }
  openNotasForm() {
      // this.stepper.next();
      // this.dialogRef.close();
      this.formType = 'create'
      this.Notas();
  }

  Alert(): void {
    this.claimFormGroup.get('ctiposeguimiento')?.setValidators([Validators.required]);
    this.claimFormGroup.get('cmotivoseguimiento')?.setValidators([Validators.required]);
    this.claimFormGroup.get('fseguimiento')?.setValidators([Validators.required]);
    this.claimFormGroup.get('nalerta')?.setValidators([Validators.required]);
    this.claimFormGroup.get('xintervalo')?.setValidators([Validators.required]);
    this.claimFormGroup.get('xobservacion_s')?.setValidators([Validators.required]);
    this.claimFormGroup.updateValueAndValidity();

    this.dialogRef = this.dialog.open(this.alertConfirmation, {
      width: '90%', // Ancho del diálogo
      height: '90%', // Alto del diálogo
      maxWidth: '1200px'
    });
  }
  Proveedores(): void {
    this.dialog.closeAll()
    // this.claimFormGroup.get('ctiposeguimiento')?.setValidators([Validators.required]);
    // this.claimFormGroup.get('cmotivoseguimiento')?.setValidators([Validators.required]);
    // this.claimFormGroup.get('fseguimiento')?.setValidators([Validators.required]);
    // this.claimFormGroup.get('ntiempoalerta')?.setValidators([Validators.required]);
    // this.claimFormGroup.get('xobservacion_s')?.setValidators([Validators.required]);
    // this.claimFormGroup.updateValueAndValidity();

    this.dialogRef = this.dialog.open(this.proveedoresConfirmation, {
      width: '90%', // Ancho del diálogo
      height: '90%', // Alto del diálogo
      maxWidth: '1200px'
    });
  }
  editTracking(item: any): void {
    this.dialog.closeAll()
    if(item.bcerrado == true) {
      alert('Seguimiento cerrado')
      return
    }
    if(item.type == 'update'){
      this.formType = 'edit'
    } else {
      this.formType = 'create'
    }
    this.trackingSelected = item
    this.claimFormGroup.get('ctiposeguimiento')?.setValue(item.ctiposeguimiento);
    // this.claimFormGroup.get('ctiposeguimiento')?.setValidators([Validators.required]);
    this.claimFormGroup.get('cmotivoseguimiento')?.setValue(item.cmotivoseguimiento);
    // this.claimFormGroup.get('cmotivoseguimiento')?.setValidators([Validators.required]);
    this.claimFormGroup.get('fseguimiento')?.setValue(item.fseguimientonotificacion);
    // this.claimFormGroup.get('fseguimiento')?.setValidators([Validators.required]);
    this.claimFormGroup.get('nalerta')?.setValue(item.nalerta);
    this.claimFormGroup.get('nalerta')?.setValidators([Validators.required]);
    this.claimFormGroup.get('xintervalo')?.setValue(item.xintervalo);
    this.claimFormGroup.get('xintervalo')?.setValidators([Validators.required]);
    // this.claimFormGroup.get('ntiempoalerta')?.setValue("1");
    // this.claimFormGroup.get('ntiempoalerta')?.setValidators([Validators.required]);
    this.claimFormGroup.get('xobservacion_s')?.setValue(item.xobservacion);
    // this.claimFormGroup.get('xobservacion_s')?.setValidators([Validators.required]);
    this.claimFormGroup.get('bcerrado')?.setValue(item.bcerrado);
    this.claimFormGroup.get('bcerrado')?.enable();
    this.claimFormGroup.updateValueAndValidity();

    this.dialogRef = this.dialog.open(this.trackingAdd, {
      width: '90%', // Ancho del diálogo
      height: '90%', // Alto del diálogo
      maxWidth: '1200px'
    });
  }
  Seguimientos(): void {
    
    this.dialog.closeAll()
    
    this.claimFormGroup.get('ctiposeguimiento')?.setValue('');
    this.claimFormGroup.get('ctiposeguimiento')?.setValidators([Validators.required]);
    this.claimFormGroup.get('cmotivoseguimiento')?.setValue('');
    this.claimFormGroup.get('cmotivoseguimiento')?.setValidators([Validators.required]);
    this.claimFormGroup.get('fseguimiento')?.setValue('');
    this.claimFormGroup.get('fseguimiento')?.setValidators([Validators.required]);
    this.claimFormGroup.get('nalerta')?.setValue(1);
    this.claimFormGroup.get('nalerta')?.setValidators([Validators.required]);
    this.claimFormGroup.get('xintervalo')?.setValue('segundos');
    this.claimFormGroup.get('xintervalo')?.setValidators([Validators.required]);
    this.claimFormGroup.get('xobservacion_s')?.setValue('');
    this.claimFormGroup.get('xobservacion_s')?.setValidators([Validators.required]);
    this.claimFormGroup.get('bcerrado')?.setValue(false);
    this.claimFormGroup.updateValueAndValidity();

    this.dialogRef = this.dialog.open(this.trackingAdd, {
      width: '90%', // Ancho del diálogo
      height: '90%', // Alto del diálogo
      maxWidth: '1200px'
    });
  }
  Notas(): void {
    
    this.dialog.closeAll()
    
    // this.claimFormGroup.get('ctiposeguimiento')?.setValue('');
    // this.claimFormGroup.get('ctiposeguimiento')?.setValidators([Validators.required]);
    // this.claimFormGroup.get('cmotivoseguimiento')?.setValue('');
    // this.claimFormGroup.get('cmotivoseguimiento')?.setValidators([Validators.required]);
    // this.claimFormGroup.get('fseguimiento')?.setValue('');
    // this.claimFormGroup.get('fseguimiento')?.setValidators([Validators.required]);
    // this.claimFormGroup.get('ntiempoalerta')?.setValue('');
    // this.claimFormGroup.get('ntiempoalerta')?.setValidators([Validators.required]);
    // this.claimFormGroup.get('xobservacion_s')?.setValue('');
    // this.claimFormGroup.get('xobservacion_s')?.setValidators([Validators.required]);
    // this.claimFormGroup.get('bcerrado')?.setValue(false);
    // this.claimFormGroup.updateValueAndValidity();
  }

  addFile(id:any): void {
    const newImgInput = <HTMLInputElement> document.getElementById(id)
    newImgInput.click()
  }
  addNote(event: any){
    
    const form = new FormData()
    form.append( "file", event.target.files[0], event.target.files[0].name)
    form.append( "url", `notificacion_${this.eventData.cnotificacion}`)
    form.append( "fileName", event.target.files[0].name)
    const response = this.http.post(environment.apiUrl + '/api/upload/document/' + this.eventData.cnotificacion + '/notificacion', form)
    response.subscribe( data => {
      this.notasList.push({cnotificacion: this.eventData.cnotificacion, xnombrenota: event.target.files[0].name, xrutaarchivo: environment.apiUrl + data['data']['url'], xnotanotificacion: '', type: 'create'})      
      const newImgInput = <HTMLInputElement> document.getElementById('newFile')
      newImgInput.value = null
    });
  }
  checkValue(item){

  }
  removeNote(index:any){
    this.notasList.splice(index, 1)
  }

  AnadirReplacement(): void {
    this.claimFormGroup.get('brepuesto')?.enable();
    this.claimFormGroup.get('xniveldano')?.enable();
    this.claimFormGroup.get('ncantidad')?.enable();
    this.formType = 'create'
    const updatedReplacementList = this.replacementList.filter(replacement =>
      !this.selectedReplacement.some(selected => selected.crepuesto === parseInt(replacement.value))
    );
    
    this.replacementList = updatedReplacementList;
    this.filteredData = this.replacementList

    this.dialogRef = this.dialog.open(this.replacementUpdate, {
      width: '90%', // Ancho del diálogo
      height: '90%', // Alto del diálogo
      maxWidth: '1200px'
    });
  }

  getReplacement() {
    const ccompania = this.currentUser.data.ccompania;
    
    const data = {
      cpais: this.currentUser.data.cpais,
      ccompania: ccompania === 1 ? this.contractFormGroup.get('ccompania')?.value : ccompania
    };
  
    this.http.post(environment.apiUrl + `/api/v1/maestros/replacement`, data).subscribe((response: any) => {
      if (response.data) {
        this.replacementList = response.data.map(item => {
          return {...item, check: false}
        } );
        
        this.filteredData = this.replacementList;
      }
    });
  }

  filterData(values: string) {
    this.filteredData = this.replacementList.filter((item) => {
      const searchValue = values.toLowerCase();
      const codigo = item.value ? item.value.toString().toLowerCase() : '';
      const replacement = item.text ? item.text.toString().toLowerCase() : '';
  
      return codigo.includes(searchValue) || replacement.includes(searchValue)
    });
  }

  filterSeguimientosData(values: string) {
    this.filteredSeguimientosData = this.seguimientosList.filter((item) => {
      const searchValue = values.toLowerCase();
      const codigo = item.cseguimientonotificacion ? item.cseguimientonotificacion.toString().toLowerCase() : '';
      const tipo = item.xtiposeguimiento ? item.xtiposeguimiento.toString().toLowerCase() : '';
      const motivo = item.xmotivoseguimiento ? item.xmotivoseguimiento.toString().toLowerCase() : '';
      const fecha = item.xfseguimientonotificacion ? item.xfseguimientonotificacion.toString().toLowerCase() : '';
  
      return codigo.includes(searchValue) || tipo.includes(searchValue) || motivo.includes(searchValue) || fecha.includes(searchValue)
    });
  }

  filterServiceOrderData(values: string) {
    this.filteredServiceOrderData = this.serviceOrderList.filter((item) => {
      const searchValue = values.toLowerCase();
      const xservicio = item.xservicio ? item.xservicio.toString().toLowerCase() : '';
      const xobservacion = item.xobservacion ? item.xobservacion.toString().toLowerCase() : '';
      const fecha = item.fsolicitud ? item.fsolicitud.toString().toLowerCase() : '';
  
      return xservicio.includes(searchValue) || xobservacion.includes(searchValue) || fecha.includes(searchValue)
    });
  }

  filterReplacementData(values: string) {
    this.currentFilterValue = values.toLowerCase(); // Actualiza el valor actual del filtro
    this.filteredReplacementData = this.selectedReplacement.filter((item) => {
      const xrepuesto = item.xrepuesto ? item.xrepuesto.toString().toLowerCase() : '';
      const ncantidad = item.ncantidad ? item.ncantidad.toString().toLowerCase() : '';
      const xdano = item.xniveldano ? item.xniveldano.toString().toLowerCase() : '';
  
      return item.type !== 'delete' && (xrepuesto.includes(this.currentFilterValue) || ncantidad.includes(this.currentFilterValue) || xdano.includes(this.currentFilterValue));
    });
  }

  toggleSelection(event: any, code: string) {
    const findedItem = this.filteredData.find(item => item.value == code);
    this.filteredRepuestosData.push(findedItem);
    const index = this.selectedReplacement.findIndex(item => item.crepuesto === code);

    if (index !== -1) {
      this.selectedReplacement.splice(index, 1);
    } else {
      this.currentCode = code;
      this.currentValue = findedItem.text;
      this.openBottomSheet();
    }
  }

  isSelected(code: string): boolean {
    return this.selectedReplacement.some(item => item.crepuesto === code);
  }

  getTracingType(){
    let data = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    }
    this.http.post(environment.apiUrl + '/api/v1/valrep/tracing-type', data).subscribe((response: any) => {
      if (response.data.result) {
        for (let i = 0; i < response.data.result.length; i++) {
          this.tracingTypeList.push({
            id: response.data.result[i].ctiposeguimiento,
            value: response.data.result[i].xtiposeguimiento,
          });
        }
        this.filteredTracingType = this.tracingTypeControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterTracingType(value || ''))
        );
      }
    });
  }

  private _filterTracingType(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.tracingTypeList
      .map(type => type.value)
      .filter(type => type.toLowerCase().includes(filterValue));
  }

  onTracingTypeSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedType = this.tracingTypeList.find(type => type.value === selectedValue);
    if (selectedType) {
      this.claimFormGroup.get('ctiposeguimiento')?.setValue(selectedType.id);
      this.claimFormGroup.get('xtiposeguimiento')?.setValue(selectedType.value);
    }
  }

  getTracingMotive(){
    let data = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
    }
    this.http.post(environment.apiUrl + '/api/v1/valrep/tracing-motive', data).subscribe((response: any) => {
      if (response.data.result) {
        for (let i = 0; i < response.data.result.length; i++) {
          this.tracingMotiveList.push({
            id: response.data.result[i].cmotivoseguimiento,
            value: response.data.result[i].xmotivoseguimiento,
          });
        }
        this.filteredTracingMotive = this.tracingMotiveControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterTracingMotive(value || ''))
        );
      }
    });
  }

  private _filterTracingMotive(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.tracingMotiveList
      .map(Motive => Motive.value)
      .filter(Motive => Motive.toLowerCase().includes(filterValue));
  }

  onTracingMotiveSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedMotive = this.tracingMotiveList.find(Motive => Motive.value === selectedValue);
    if (selectedMotive) {
      this.claimFormGroup.get('cmotivoseguimiento')?.setValue(selectedMotive.id);
      this.claimFormGroup.get('xmotivoseguimiento')?.setValue(selectedMotive.value);
    }
  }

  selectRepuesto(item){
    this.repuestoSelected = item
    const filterSearch = this.filtersProveedores.crepuesto
    if (!filterSearch) {
      this.filtersProveedores.crepuesto = this.repuestoSelected.value
    } else {
      if (this.repuestoSelected.value){
        this.filtersProveedores.crepuesto = this.repuestoSelected.value
      } else {
        delete this.filtersProveedores.crepuesto;
      }
    }

    this.ItemFormService.getItemInfoPost('/api/v1/proveedores/search/'+ this.ccompania, this.filtersProveedores).subscribe((data)=>{

    })
  }

  openBottomSheet() {
    this.bottomSheet.open(this.bottomSheetTemplate);
  }

  openBottomSheetEdit(replacement: any) {
    this.claimFormGroup.get('xniveldano')?.setValue(replacement.xniveldano)
    this.claimFormGroup.get('ncantidad')?.setValue(replacement.ncantidad)
    this.claimFormGroup.get('crepuesto')?.setValue(replacement.crepuesto)
    this.claimFormGroup.get('xniveldano')?.disable()
    this.claimFormGroup.get('ncantidad')?.disable()
    this.claimFormGroup.get('crepuesto')?.disable()
    this.formType = 'update'
    this.isEditButtonVisible = true;
    this.bottomSheet.open(this.bottomSheetTemplate);
  }
  
  addReplacement() {
    const xniveldano = this.claimFormGroup.get('xniveldano')?.value;
    const ncantidad = this.claimFormGroup.get('ncantidad')?.value;

    if (this.currentCode) {
      if(this.selectedReplacement.length == 0){
        this.selectedReplacement.push({
          cnotificacion: this.itemId,
          crepuesto: this.currentCode,
          xrepuesto: this.currentValue,
          cestatusgeneral: 14,
          fcreacion: new Date(),
          cusuariocreacion: this.currentUser.data.cusuario,
          bactivo: 1,
          xniveldano,
          ncantidad,
          type: 'create'
        });
        this.filteredReplacementData.push({
          crepuesto: this.currentCode,
          xrepuesto: this.currentValue,
          xniveldano,
          ncantidad,
        })
      }else{
        this.selectedReplacement.push({
          cnotificacion: this.itemId,
          crepuesto: this.currentCode,
          xrepuesto: this.currentValue,
          fcreacion: new Date(),
          cestatusgeneral: 14,
          cusuariocreacion: this.currentUser.data.cusuario,
          bactivo: 1,
          xniveldano,
          ncantidad,
          type: 'create'
        });
      }
      this.currentCode = null;
      this.currentValue = null;
      this.claimFormGroup.patchValue({
        xniveldano: '',
        ncantidad: ''
      });


    }
    
    this.bottomSheet.dismiss();
  }

  editReplacement(){
    this.claimFormGroup.get('xniveldano')?.enable();
    this.claimFormGroup.get('ncantidad')?.enable();
    this.isEditButtonVisible = false;
  }

  updateReplacement(event: Event) {
    event.preventDefault();
    const formValues = this.claimFormGroup.value;

    const nivelDano = formValues.xniveldano;
    const cantidad = formValues.ncantidad;
    const crepuesto = this.claimFormGroup.get('crepuesto')?.value

    const index = this.selectedReplacement.findIndex(repuesto => repuesto.crepuesto === crepuesto);

    if (index !== -1) {
      this.selectedReplacement[index] = {
        ...this.selectedReplacement[index],
        cnotificacion: this.itemId,
        crepuesto: crepuesto,
        xniveldano: nivelDano,
        ncantidad: cantidad,
        type: 'update',
        fmodificacion: new Date(),
        cusuariomodificacion: this.currentUser.data.cusuario
      };
    }

    this.bottomSheet.dismiss();
  }

  deleteReplacement(event: any) {
    this.claimFormGroup.get('crepuesto')?.setValue(event.crepuesto)
    this.claimFormGroup.get('xniveldano')?.setValue(event.xniveldano)
    this.claimFormGroup.get('ncantidad')?.setValue(event.ncantidad)

    const crepuesto =  this.claimFormGroup.get('crepuesto')?.value;
    const xniveldano = this.claimFormGroup.get('xniveldano')?.value;
    const ncantidad =  this.claimFormGroup.get('ncantidad')?.value;
  
    const index = this.selectedReplacement.findIndex(repuesto => repuesto.crepuesto === crepuesto);
    
    if (index !== -1) {
      const updatedReplacement = {
        ...this.selectedReplacement[index],
        cnotificacion: this.itemId,
        crepuesto: crepuesto,
        xniveldano: xniveldano,
        ncantidad: ncantidad,
        type: 'delete',
        fmodificacion: new Date(),
        cusuariomodificacion: this.currentUser.data.cusuario,
        bactivo: 0
      };
  
      this.selectedReplacement[index] = updatedReplacement;
      this.replacementEventsList[index] = updatedReplacement;
    }
    
    this.filterReplacementData(this.currentFilterValue); // Vuelve a aplicar el filtro para actualizar la tabla
    this.bottomSheet.dismiss();
  }

  clearServiceOrderForm() {
    this.serviceOrderFormGroup.get('xobservacion')?.setValue('');
    this.serviceOrderFormGroup.get('cservicio')?.setValue('');
    this.ccotizacionOrden = ''
    this.serviceOrderFormGroup.get('ccotizacion')?.setValue('')
    this.serviceOrderFormGroup.get('xservicio')?.setValue('');
    this.serviceOrderFormGroup.get('cservicio_adicional')?.setValue('');
    this.serviceOrderFormGroup.get('xservicio_adicional')?.setValue('');
    this.serviceOrderFormGroup.get('cproveedor')?.setValue('');
    this.serviceOrderFormGroup.get('xproveedor')?.setValue('');
    this.serviceOrderFormGroup.get('xrepuesto')?.setValue('')
    this.serviceOrderFormGroup.get('cestatusgeneral')?.setValue('');
    this.serviceOrderFormGroup.get('xestatusgeneral')?.setValue('PENDIENTE');


    this.serviceOrderFormGroup.get('xobservacion')?.enable();
    this.serviceOrderFormGroup.get('cestatusgeneral')?.disable();
    this.serviceOrderFormGroup.get('fajuste')?.enable();
    this.serviceOrderFormGroup.get('ccotizacion')?.enable();
    this.serviceOrderFormGroup.get('xservicio')?.enable();
    this.serviceControl.enable();
    this.additionalServiceControl.enable();
    this.serviceOrderFormGroup.get('xproveedor')?.enable();
    this.providerControl.enable();
    this.serviceOrderFormGroup.get('xrepuesto')?.enable()
    this.replacementEventsControl.enable()
    this.coinControl.enable();
    this.serviceOrderFormGroup.get('xorigen_grua')?.enable();
    this.serviceOrderFormGroup.get('xdestino_grua')?.enable();
    this.serviceOrderFormGroup.get('mmonto')?.enable();

  }
  
  createServiceOrder(){
    this.quotesFinallyAceptedList = []
    this.activaReplacements = false
    this.serviceOrderFormGroup.get('ccotizacion')?.setValue('')
    this.ccotizacionOrden = ''
    const { xmarca, xmodelo, xplaca } = this.vehicleFormGroup.value;
    const { ccontratoflota, xnombrecompleto, xdescripcion, xnombrecompleto_al } = this.claimFormGroup.value;
    
    const vehiculo = `${xmarca} ${xmodelo}`;

    this.serviceOrderFormGroup.patchValue({
      ccontratoflota: this.contractFormGroup.get('ccontratoflota')?.value,
      xnombrecompleto,
      xdescripcion,
      xnombre_al: xnombrecompleto_al || 'Sin Información',
      fsolicitud: new Date(),
      fajuste: new Date(),
      xvehiculo: vehiculo,
      xplaca: xplaca,
    });

    this.formType = 'create';
    this.getStatusGeneral();
    
    
    this.dialogRef = this.dialog.open(this.serviceOrder, {
      width: '90%', // Ancho del diálogo
      height: '90%', // Alto del diálogo
      maxWidth: '1200px',
    });

    this.clearServiceOrderForm();
    
  }
  addServiceOrder() {
    const id = this.serviceOrderFormGroup.get('corden').value;
  
    // Obtener la fecha como una cadena
    const fajusteInput = this.serviceOrderFormGroup.get('fajuste').value;
  
    // Verificar si el input ya es un objeto Date
    const isDateObject = Object.prototype.toString.call(fajusteInput) === '[object Date]' && !isNaN(fajusteInput);
  
    // Función para combinar la fecha ingresada con la hora local actual
    const combineWithLocalTime = (dateString) => {
      if (isDateObject) {
        return dateString;
      }
      const [day, month, year] = dateString.split('/');
      const date = new Date(year, month - 1, day);
      const now = new Date();
  
      date.setHours(now.getHours());
      date.setMinutes(now.getMinutes());
      date.setSeconds(now.getSeconds());
      date.setMilliseconds(now.getMilliseconds());
  
      return date;
    };
  
    const fajuste = combineWithLocalTime(fajusteInput);
  
    const orden = this._formBuilder.group({
      // Define your form controls here
      id: [id],
      xservicio: [this.xservicio],
      cservicio: [this.cservicio],
      ccotizacion: [this.serviceOrderFormGroup.get('ccotizacion').value],
      xobservacion: [this.serviceOrderFormGroup.get('xobservacion').value],
      fsolicitud: [this.serviceOrderFormGroup.get('fsolicitud').value],
      fajuste: [fajuste],
    });
    this.serviceOrderFormGroup.get('cestatusgeneral')?.setValue(13)
    const statusItem = this.statusList.find(item => item.id == this.serviceOrderFormGroup.get('cestatusgeneral')?.value)
    let xestatusgeneral = 'PENDIENTE'
    if (statusItem) {
      xestatusgeneral = statusItem.value
    }
  
    this.serviceOrderList.push({
      id: id,
      cnotificacion: this.itemId,
      xservicio: this.xservicio,
      cservicio: this.cservicio,
      xobservacion: this.serviceOrderFormGroup.get('xobservacion').value,
      ccotizacion: this.serviceOrderFormGroup.get('ccotizacion')?.value,
      crepuesto: this.serviceOrderFormGroup.get('crepuesto')?.value,
      fsolicitud: new Date(),
      fajuste: fajuste,
      cproveedor: this.serviceOrderFormGroup.get('cproveedor')?.value,
      ccompania: this.contractFormGroup.get('ccompania')?.value,
      cpais: this.currentUser.data.cpais,
      cestatusgeneral: this.serviceOrderFormGroup.get('cestatusgeneral')?.value,
      xestatusgeneral: xestatusgeneral,
      cmoneda: this.serviceOrderFormGroup.get('cmoneda')?.value,
      xorigen_grua: this.serviceOrderFormGroup.get('xorigen_grua')?.value,
      xdestino_grua: this.serviceOrderFormGroup.get('xdestino_grua')?.value,
      mmonto_grua: this.serviceOrderFormGroup.get('mmonto')?.value,
      bactivo: true,
      fcreacion: new Date(),
      cusuariocreacion: this.currentUser.data.cusuario,
      type: 'create'
    });
    this.formType = 'create'
    this.orden.push(orden);
    this.dialog.closeAll();
  }

  editServiceOrder(item){
    this.activaReplacements = false
    this.displayCotizacionOrder = false
    this.ccotizacionOrden = ''
    
    console.log(item.ccotizacion);
    this.quotesFinallyAceptedList = []
    this.serviceOrderFormGroup.get('corden')?.setValue(item.corden);
    this.serviceOrderFormGroup.get('xobservacion')?.setValue(item.xobservacion);
    this.serviceOrderFormGroup.get('cnotificacion')?.setValue(item.cnotificacion);
    if(item.ccotizacion) {
      this.ccotizacionOrden = item.ccotizacion
      this.displayCotizacionOrder = true

      if(item.itiporeporte != 'G') {
        this.http.post(environment.apiUrl + `/api/v1/events/quotes-replacement/detail/${item.ccotizacion}`, {}).subscribe((response: any) => {
          this.quotesFinallyAceptedList = []
          this.quotesFinallyAceptedList = response.data.filter(quote => {
            if(quote.cestatusgeneral == 4) {
              return quote
            }
          });
          this.activaGrua = false
          this.activaReplacements = true
        })
      } else {
        this.activaGrua = true
      }
    }
    this.serviceOrderFormGroup.get('ccotizacion')?.setValue(item.ccotizacion);
    this.serviceOrderFormGroup.get('cproveedor')?.setValue(item.cproveedor);
    this.serviceOrderFormGroup.get('xproveedor')?.setValue(item.xproveedor);
    this.serviceOrderFormGroup.get('fsolicitud')?.setValue(this.dateUtilService.formatDate(new Date(item.fsolicitud)));
    this.serviceOrderFormGroup.get('cestatusgeneral')?.setValue(item.cestatusgeneral);
    this.serviceOrderFormGroup.get('fajuste')?.setValue(this.dateUtilService.formatDate(new Date(item.fajuste)));
    this.serviceOrderFormGroup.get('fajuste')?.clearValidators()
    this.serviceOrderFormGroup.get('cservicio')?.setValue(item.cservicio);
    this.cservicio = item.cservicio;
    this.xservicio = item.xservicio;
    this.serviceOrderFormGroup.get('crepuesto')?.setValue(item.crepuesto);
    this.serviceOrderFormGroup.get('xservicio_adicional')?.disable();
    this.serviceOrderFormGroup.get('xrepuesto')?.setValue(item.xrepuesto);
    this.serviceOrderFormGroup.get('cmoneda')?.setValue(item.cmoneda);
    this.serviceOrderFormGroup.get('xmoneda')?.setValue(item.xmoneda);
    this.serviceOrderFormGroup.get('xorigen_grua')?.setValue(item.xorigen_grua);
    this.serviceOrderFormGroup.get('xdestino_grua')?.setValue(item.xdestino_grua);
    this.serviceOrderFormGroup.get('mmonto')?.setValue(item.mmonto_grua);

    if(item.type == 'update' || item.type == 'info') {
      this.serviceOrderFormGroup.get('xobservacion')?.disable();
      this.serviceOrderFormGroup.get('cestatusgeneral')?.disable();
      this.serviceOrderFormGroup.get('fajuste')?.disable();
      this.serviceOrderFormGroup.get('xservicio')?.disable();
      this.serviceOrderFormGroup.get('ccotizacion')?.disable();
      this.serviceControl.disable();
      this.additionalServiceControl.disable();
      this.serviceOrderFormGroup.get('xproveedor')?.disable();
      this.providerControl.disable();
      this.serviceOrderFormGroup.get('xrepuesto')?.disable()
      this.replacementEventsControl.disable()
      this.coinControl.disable();
      this.serviceOrderFormGroup.get('xorigen_grua')?.disable();
      this.serviceOrderFormGroup.get('xdestino_grua')?.disable();
      this.serviceOrderFormGroup.get('mmonto')?.disable();
    }
    if(item.xorigen_grua){
      this.activaGrua = true
    }else{
      this.activaGrua = false
    }
    this.formType = 'update'
    this.getStatusGeneral()
    this.getService();
    this.getReplacementValrep();
    this.editarServiceOrder();
  }
  async checkOrder(item){
    const buttonChecked = document.getElementById('checked-button-' + item.corden)
    const buttonUnChecked = document.getElementById('unchecked-button-' + item.corden)
    const statusLabel = document.getElementById('status-label-' + item.corden)

    
    let cestatusgeneral = 1

    switch (item.cestatusgeneral) {
      case 1: 
        cestatusgeneral = 14; break;
      case 14:
        cestatusgeneral = 4; break;
      case 4:
        cestatusgeneral = 11; break;
      case 11:
        cestatusgeneral = 10; break;
      case 10:
        cestatusgeneral = 16; break;
      case 16:
        cestatusgeneral = 9; break;
      case 9:
        cestatusgeneral = 5; break;
      case 5:
        cestatusgeneral = 12; break;
      case 12:
        cestatusgeneral = 6; break;
      default:
        cestatusgeneral = 6; break;

    }

    
    const statusChecked = this.statusList.find(status => status.id == cestatusgeneral)
    
    buttonUnChecked.classList.remove('fade-in')
    buttonUnChecked.parentElement.classList.remove('fade-in')
    buttonUnChecked.parentElement.children[2].classList.remove('fade-in')
    buttonChecked.parentElement.children[2].classList.remove('fade-in')

    buttonUnChecked.classList.add('fade-out')
    buttonUnChecked.parentElement.classList.add('fade-out')
    buttonUnChecked.parentElement.children[2].classList.add('fade-out')
    buttonChecked.parentElement.children[2].classList.add('fade-out')
    setTimeout(() => {
      item.xestatusgeneral = statusChecked.value
      if(cestatusgeneral == 6) {
        buttonChecked.classList.remove('d-none')
        buttonUnChecked.classList.add('d-none')
        buttonUnChecked.parentElement.children[2].classList.add('d-none')
        buttonChecked.parentElement.children[2].classList.add('d-none')
      }
    }, 300);
    setTimeout(() => {
        buttonChecked.parentElement.classList.add('fade-in')
        buttonChecked.classList.add('fade-in')
    }, 400);
    setTimeout(() => {
      buttonChecked.classList.remove('fade-in')
      buttonChecked.classList.add('fade-out')
      if(cestatusgeneral == 6) {
        buttonChecked.parentElement.classList.remove('fade-in')
        buttonChecked.parentElement.classList.add('fade-out')
        statusLabel.classList.add('fade-out')
      } else {
        buttonUnChecked.parentElement.children[2].classList.remove('fade-out')
        buttonUnChecked.parentElement.children[2].classList.add('fade-in')
        buttonUnChecked.classList.remove('fade-out')
        buttonUnChecked.classList.add('fade-in')
      }
    }, 1200);
    setTimeout(() => {
      item.cestatusgeneral = cestatusgeneral
      if(cestatusgeneral !=6) {
        
      }
    }, 1500);
    setTimeout(() => {
      // item.cestatusgeneral = cestatusgeneral
      if(cestatusgeneral == 6) {
        statusLabel.classList.remove('fade-out')
        statusLabel.classList.add('fade-in')
        item.type = 'update';
      } else {
        buttonUnChecked.parentElement.classList.remove('fade-out')
        buttonUnChecked.parentElement.classList.add('fade-in')
        item.type = 'info';
      }
    }, 1800);
  }

  editarServiceOrder(){
    const { xmarca, xmodelo, xplaca } = this.vehicleFormGroup.value;
    const { ccontratoflota, xnombrecompleto, xdescripcion, xnombrecompleto_al } = this.claimFormGroup.value;
    
    const vehiculo = `${xmarca} ${xmodelo}`;

    const { xobservacion, cservicio, cproveedor, xproveedor, cestatusgeneral, fajuste, fsolicitud } = this.serviceOrderFormGroup.value;

    if(this.serviceList || this.additionalServiceList){

      const service = this.findServiceByCode(cservicio);
      if (service) {
        if (service.list === 'serviceList') {
            this.serviceOrderFormGroup.patchValue({
                ccontratoflota: this.contractFormGroup.get('ccontratoflota')?.value,
                xnombrecompleto,
                xdescripcion,
                xnombre_al: xnombrecompleto_al || 'Sin Información',
                fsolicitud: this.parseDate(this.serviceOrderFormGroup.get('fsolicitud')?.value),
                fajuste: this.parseDate(this.serviceOrderFormGroup.get('fajuste')?.value),
                xvehiculo: vehiculo,
                xplaca: xplaca,
                xobservacion: this.serviceOrderFormGroup.get('xobservacion')?.value,
                cservicio: service.cservicio,
                xservicio: service.xservicio,
                cservicio_adicional: null,
                xservicio_adicional: '',
                cproveedor: cproveedor,
                xproveedor: this.serviceOrderFormGroup.get('xproveedor')?.value,
                cestatusgeneral: this.serviceOrderFormGroup.get('cestatusgeneral')?.value,
                type: 'update'
            });
        } else if (service.list === 'additionalServiceList') {
            this.serviceOrderFormGroup.patchValue({
                ccontratoflota: this.contractFormGroup.get('ccontratoflota')?.value,
                xnombrecompleto,
                xdescripcion,
                xnombre_al: xnombrecompleto_al || 'Sin Información',
                fsolicitud: this.parseDate(this.serviceOrderFormGroup.get('fsolicitud')?.value),
                fajuste: this.parseDate(this.serviceOrderFormGroup.get('fajuste')?.value),
                xvehiculo: vehiculo,
                xplaca: xplaca,
                xobservacion: this.serviceOrderFormGroup.get('xobservacion')?.value,
                cservicio: null,
                xservicio: '',
                cservicio_adicional: service.cservicio,
                xservicio_adicional: service.xservicio,
                cproveedor: cproveedor,
                xproveedor: this.serviceOrderFormGroup.get('xproveedor')?.value,
                cestatusgeneral: this.serviceOrderFormGroup.get('cestatusgeneral')?.value,
                type: 'update'
            });
        }
        this.formType = 'update'
        this.getProvider()
      } 
    }

    this.dialogRef = this.dialog.open(this.serviceOrder, {
        width: '90%', // Ancho del diálogo
        height: '90%', // Alto del diálogo
        maxWidth: '1200px',
    });
  }

  findServiceByCode(serviceCode) {
    const service = this.serviceList.find(service => service.id == serviceCode);

    if (service) {
        return { cservicio: service.id, xservicio: service.value, list: 'serviceList', report: service.report };
    }
    
    const additionalService = this.additionalServiceList.find(service => service.id == serviceCode);

    if (additionalService) {
        return { cservicio: additionalService.id, xservicio: additionalService.value, list: 'additionalServiceList', report: additionalService.report };
    }

    return null;
  }

  
  getEditSerOrd(){
    const id = this.serviceOrderFormGroup.get('corden').value;
    const index = this.serviceOrderList.findIndex(order => order.corden === id);
    this.formType = 'update'
    // Obtener la fecha como una cadena
    const fajusteInput = this.serviceOrderFormGroup.get('fajuste').value;
    
    // Verificar si el input ya es un objeto Date
    const isDateObject = Object.prototype.toString.call(fajusteInput) === '[object Date]' && !isNaN(fajusteInput);
    
    // Función para combinar la fecha ingresada con la hora local actual
    const combineWithLocalTime = (dateString) => {
      if (isDateObject) {
        return dateString;
      }
      const [day, month, year] = dateString.split('/');
      const date = new Date(year, month - 1, day);
      const now = new Date();
    
      date.setHours(now.getHours());
      date.setMinutes(now.getMinutes());
      date.setSeconds(now.getSeconds());
      date.setMilliseconds(now.getMilliseconds());
    
      return date;
    };
    
    const fajuste = combineWithLocalTime(fajusteInput);
    const service = this.findServiceByCode(this.cservicio);

    if (index !== -1) {
      this.serviceOrderList[index] = {
        ...this.serviceOrderList[index],
        xservicio: service.xservicio,
        cservicio: this.cservicio,
        xobservacion: this.serviceOrderFormGroup.get('xobservacion').value,
        crepuesto: this.serviceOrderFormGroup.get('crepuesto')?.value,
        fsolicitud: this.dateUtilService.formatDate(this.serviceOrderFormGroup.get('fsolicitud').value),
        fajuste: fajuste,
        type: 'update',
        cproveedor: this.serviceOrderFormGroup.get('cproveedor')?.value,
        ccompania: this.contractFormGroup.get('ccompania')?.value,
        cpais: this.currentUser.data.cpais,
        cestatusgeneral: this.serviceOrderFormGroup.get('cestatusgeneral')?.value,
        cmoneda: this.serviceOrderFormGroup.get('cmoneda')?.value,
        xorigen_grua: this.serviceOrderFormGroup.get('xorigen_grua')?.value,
        xdestino_grua: this.serviceOrderFormGroup.get('xdestino_grua')?.value,
        mmonto_grua: this.serviceOrderFormGroup.get('mmonto')?.value,
        bactivo: true,
        fmodificacion: new Date(),
        cusuariomodificacion: this.currentUser.data.cusuario
      };
      
      this.orden[index].patchValue({
        xservicio: this.xservicio,
        cservicio: this.cservicio,
        xobservacion: this.serviceOrderFormGroup.get('xobservacion').value,
        fsolicitud: this.serviceOrderFormGroup.get('fsolicitud').value,
        fajuste: this.dateUtilService.formatDate(fajuste),
      });
      this.dialog.closeAll();
    } else {
      console.error('Service order not found!');
    }
  }

  getServiceOrderReport(item){
    if(item.itiporeporte == 'N'){
      const observable = from(this.pdfGenerationService.LoadDataServiceOrder(item.corden));
    }else if(item.itiporeporte == 'G'){
      const observable = from(this.pdfGenerationServiceGrua.LoadDataServiceOrder(item.corden));
    }else if(item.itiporeporte == 'C'){
      const observable = from(this.pdfGenerationServiceCompra.LoadDataServiceOrder(item.corden));
    }

  }

  getService(){
    let ccontratoflota = this.contractFormGroup.get('ccontratoflota')?.value;

    this.http.get(environment.apiUrl + `/api/v1/valrep/contracted-services/${ccontratoflota}`).subscribe((response: any) => {
      if(response.status){
        this.serviceList = [];
        this.serviceList = response.data.list.map((item: any) => ({
          id: item.cservicio,
          value: item.xservicio,
          report: item.itiporeporte
        })).sort((a, b) => {
          const nameA = a.value.toUpperCase(); // ignore upper and lowercase
          const nameB = b.value.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
        
          // names must be equal
          return 0;
        })
        this.filteredService = this.serviceControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterService(value || ''))
        );

        this.getServiceAdditional();
        this.getReplacementValrep();
      }
    })
  }

  private _filterService(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.serviceList
      .map(service => service.value)
      .filter(service => service.toLowerCase().includes(filterValue));
  }

  onServiceSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedService = this.serviceList.find(service => service.value === selectedValue);
    if (selectedService) {
      this.serviceOrderFormGroup.get('cservicio')?.setValue(selectedService.id);
      this.serviceOrderFormGroup.get('xservicio')?.setValue(selectedService.value);
      this.serviceOrderFormGroup.get('xservicio_adicional')?.setValue('');  // Clear additional service
      this.serviceOrderFormGroup.get('cservicio_adicional')?.setValue(null); // Clear additional service

      this.getProvider();
    }

    if(selectedService.report == 'G'){
      this.activaGrua = true
      this.getCoin();
    }else{
      this.activaGrua = false
    }

    if(selectedService.report == 'C'){
      if(!this.replacementEventsList[0]){
        const snackbarRef = this.snackBar.open('No se puede generar una Orden de Compra debido a que no hay repuestos cotizados', 'Cerrar', {
          duration: 4000,
          verticalPosition: 'top'
        });
    
        snackbarRef.afterDismissed().subscribe(() => {
          this.serviceOrderFormGroup.get('cservicio')?.setValue(''); // Clear primary service
          this.serviceOrderFormGroup.get('xservicio')?.setValue('');
        });
      }
    }

    if(selectedService.report == 'R'){
      if(!this.replacementEventsList[0]){
        const snackbarRef = this.snackBar.open('No se puede generar una Orden de Reparación debido a que no hay repuestos cotizados', 'Cerrar', {
          duration: 4000,
          verticalPosition: 'top'
        });
    
        snackbarRef.afterDismissed().subscribe(() => {
          this.serviceOrderFormGroup.get('cservicio')?.setValue(''); // Clear primary service
          this.serviceOrderFormGroup.get('xservicio')?.setValue('');
        });
      }
    }
  }

  onServiceAdicional(){
    if(this.serviceOrderFormGroup.get('xservicio')?.value){
      this.serviceOrderFormGroup.get('xservicio_adicional')?.disable()
      this.getProvider();
    }else{
      this.serviceOrderFormGroup.get('xservicio_adicional')?.enable();
    }
  }

  getServiceAdditional(){
    let data = {
      cservicio: this.serviceList,
      cpais: this.currentUser.data.cpais,
    }
    this.http.post(environment.apiUrl + `/api/v1/valrep/additional-services`, data).subscribe((response: any) => {
      if(response.status){
        this.additionalServiceList = [];
        this.additionalServiceList = response.data.list.map((item: any) => ({
          id: item.cservicio,
          value: item.xservicio,
          report: item.itiporeporte
        })).sort((a, b) => {
          const nameA = a.value.toUpperCase(); // ignore upper and lowercase
          const nameB = b.value.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
        
          // names must be equal
          return 0;
        })
        this.filteredAdditionalService = this.additionalServiceControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterAdditionalService(value || ''))
        );
      }
    })
  }

  private _filterAdditionalService(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.additionalServiceList
      .map(additional => additional.value)
      .filter(additional => additional.toLowerCase().includes(filterValue));
  }

  onAdditionalServiceSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedAdditionalService = this.additionalServiceList.find(additional => additional.value === selectedValue);
    if (selectedAdditionalService) {
      this.serviceOrderFormGroup.get('cservicio_adicional')?.setValue(selectedAdditionalService.id);
      this.serviceOrderFormGroup.get('xservicio_adicional')?.setValue(selectedAdditionalService.value);
      this.serviceOrderFormGroup.get('xservicio')?.setValue('');  // Clear primary service
      this.serviceOrderFormGroup.get('cservicio')?.setValue(null); // Clear primary service
      this.serviceOrderFormGroup.get('xservicio')?.disable();
      this.getProvider();
    } else {
      this.serviceOrderFormGroup.get('xservicio')?.enable();
    }

    if(selectedAdditionalService.report == 'G'){
      this.activaGrua = true
      this.getCoin();
    }else{
      this.activaGrua = false
    }

    if(selectedAdditionalService.report == 'C'){
      if(!this.replacementEventsList[0]){
        const snackbarRef = this.snackBar.open('No se puede generar una Orden de Compra debido a que no hay repuestos cotizados', 'Cerrar', {
          duration: 4000,
          verticalPosition: 'top'
        });
    
        snackbarRef.afterDismissed().subscribe(() => {
          this.serviceOrderFormGroup.get('cservicio_adicional')?.setValue(''); // Clear primary service
          this.serviceOrderFormGroup.get('xservicio_adicional')?.setValue('');
        });
      }
    }

    if(selectedAdditionalService.report == 'R'){
      if(!this.replacementEventsList[0]){
        const snackbarRef = this.snackBar.open('No se puede generar una Orden de Reparación debido a que no hay repuestos cotizados', 'Cerrar', {
          duration: 4000,
          verticalPosition: 'top'
        });
    
        snackbarRef.afterDismissed().subscribe(() => {
          this.serviceOrderFormGroup.get('cservicio_adicional')?.setValue(''); // Clear primary service
          this.serviceOrderFormGroup.get('xservicio_adicional')?.setValue('');
        });
      }
    }
  }

  getProvider(){    
    const { cservicio, cservicio_adicional, xservicio, xservicio_adicional } = this.serviceOrderFormGroup.value;

    // Determina cuál servicio usar
    if (cservicio) {
      this.cservicio = cservicio;
      this.xservicio = xservicio;
    } else {
      this.cservicio = cservicio_adicional;
      this.xservicio = xservicio_adicional;
      // Remueve la validación de 'required' en cservicio si existe
      this.serviceOrderFormGroup.get('cservicio')?.clearValidators();
      this.serviceOrderFormGroup.get('cservicio')?.updateValueAndValidity();
    }

    let data = {
      cservicio: this.cservicio,
      cpais: this.currentUser.data.cpais,
      ccompania: this.contractFormGroup.get('ccompania')?.value
    };

    this.http.post(environment.apiUrl + `/api/v1/valrep/provider-service`, data).subscribe((response: any) => {
      if(response.status){
        this.providerList = [];
        this.providerList = response.data.list.map((item: any) => ({
          id: item.cproveedor,
          value: item.xnombre
        }));
        this.filteredProvider = this.providerControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterProvider(value || ''))
        );
      }
    });
  }

  private _filterProvider(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.providerList
      .map(provider => provider.value)
      .filter(provider => provider.toLowerCase().includes(filterValue));
  }

  onProviderSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedProvider = this.providerList.find(provider => provider.value === selectedValue);
    if (selectedProvider) {
      this.serviceOrderFormGroup.get('cproveedor')?.setValue(selectedProvider.id);
    }
  }

  getAllProvider(){
    let data = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.contractFormGroup.get('ccompania')?.value,
      cservicio: this.selectedServiceId
    };

    this.http.post(environment.apiUrl + `/api/v1/valrep/provider`, data).subscribe((response: any) => {
      if(response.status){
        this.providerAllList = [];
        this.providerAllList = response.data.list.map((item: any) => ({
          id: item.cproveedor,
          value: item.xnombre
        }));
        for (const element of this.providerAllList) {
          this.selectProvider(element)
        }
        console.log(this.providerAllList);
      }
    });
  }

  getCoin(){
    const ccompania = this.contractFormGroup.get('ccompania')?.value;

    this.http.get(environment.apiUrl + `/api/v1/valrep/coin/${ccompania}`).subscribe((response: any) => {
      if(response.status){
        this.coinList = [];
        this.coinList = response.data.map((item: any) => ({
          id: item.cmoneda,
          value: item.xmoneda
        }))
        this.filteredCoin = this.coinControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCoin(value || ''))
        );
      }
    })
  }

  private _filterCoin(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.coinList
      .map(coin => coin.value)
      .filter(coin => coin.toLowerCase().includes(filterValue));
  }

  onCoinSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedCoin = this.coinList.find(coin => coin.value === selectedValue);
    if (selectedCoin) {
      this.serviceOrderFormGroup.get('cmoneda')?.setValue(selectedCoin.id);
      this.serviceOrderFormGroup.get('xmoneda')?.setValue(selectedCoin.value);
    }
  }
  onCoinSelection2(event: any) {
    const selectedValue = event.option.value;
    const selectedCoin = this.coinList.find(coin => coin.value === selectedValue);
    if (selectedCoin) {
      this.gruaFormGroup.get('cmoneda')?.setValue(selectedCoin.id);
      this.gruaFormGroup.get('xmoneda')?.setValue(selectedCoin.value);
    }
  }

  getReplacementValrep(){
    let data = {
      cnotificacion: this.itemId,
    }
    this.http.post(environment.apiUrl + `/api/v1/valrep/replacement-events`, data).subscribe((response: any) => {
      if(response.status){
        this.replacementEventsList = [];
        this.replacementEventsList = response.data.list.map((item: any) => ({
          id: item.crepuesto,
          value: item.xrepuesto
        }))
        // const replacement = this._formBuilder.group({
        //   xservicio: [this.xservicio],
        //   cservicio: [this.cservicio],
        //   xobservacion: [this.serviceOrderFormGroup.get('xobservacion').value],
        //   fsolicitud: [this.serviceOrderFormGroup.get('fsolicitud').value],
        // });
        this.filteredReplacementEvents = this.replacementEventsControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterReplacementEvents(value || ''))
        );
      }
    })
  }
  private _filterReplacementEvents(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.replacementEventsList
      .map(replacement => replacement.value)
      .filter(replacement => replacement.toLowerCase().includes(filterValue));
  }

  onReplacementEventsSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedreplacement = this.replacementEventsList.find(replacement => replacement.value === selectedValue);
    if (selectedreplacement) {
      this.serviceOrderFormGroup.get('crepuesto')?.setValue(selectedreplacement.id);
      this.serviceOrderFormGroup.get('xrepuesto')?.setValue(selectedreplacement.value);
    }
  }

  editTrackingModal(event:any, item: any){
    this.notificationTypeControl.enable()
    this.claimCauseControl.enable()
    this.stateControl.enable()
    this.cityControl.enable()
    this.tracingMotiveControl.disable()
    this.tracingMotiveControl.setValue(item.xmotivoseguimiento)
    this.tracingTypeControl.disable()
    this.tracingTypeControl.setValue(item.xtiposeguimiento)
    this.claimFormGroup.disable()
    this.editTracking(item);
  }

  getStatusGeneral(){
    let data = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.contractFormGroup.get('ccompania')?.value
    };
    this.http.post(environment.apiUrl + `/api/v1/valrep/status`, data).subscribe((response: any) => {
      if(response.status){
        this.statusList = [];
        this.statusList = response.data.list.map((item: any) => ({
          id: item.cestatusgeneral,
          value: item.xestatusgeneral
        }));

        if(this.serviceOrderList[0]){
          this.statusList.sort((a, b) => a.value > b.value ? 1 : -1)
          const selectedState = this.statusList.find(state => state.id === this.serviceOrderFormGroup.get('cestatusgeneral')?.value);
          if (selectedState) {
              this.serviceOrderFormGroup.get('cestatusgeneral')?.setValue(selectedState.id);
          }
        }else{
          this.statusList.sort((a, b) => a.value > b.value ? 1 : -1)
          const selectedState = this.statusList.find(state => state.id === 13);
          if (selectedState) {
              this.serviceOrderFormGroup.get('cestatusgeneral')?.setValue(selectedState.id);
          } 
        }

      }
    });
  }

  addQuotes(){
    this.formType = 'create';
    this.providerAllList = [];
    this.selectedServiceId = null;
    this.providerSelectedList = [];
    let selectedIds = [];

    if(!this.selectedReplacement[0]){
      selectedIds = [
        { id: 228 },
        { id: 229 },
        { id: 230 },
        { id: 231 }
      ];
    }else{
      selectedIds = [
        { id: 228 },
        { id: 229 },
        { id: 230 },
        { id: 231 },
        { id: 282 },
        { id: 283 }
      ];
    }

    const selectedIdsObject = selectedIds.map((item: any) => ({
      servicio: this.findServiceByCode(item.id)
    }))

    this.serviceQuoteList = selectedIdsObject.map(item => item.servicio);

    if (this.contractFormGroup.get('ccompania')?.value == 1) {

    }
    this.dialogRef = this.dialog.open(this.newQuotes, {
      width: '90%', // Ancho del diálogo
      height: '90%', // Alto del diálogo
      maxWidth: '1400px'
    });
  }
  changeDataPage(event:any) {
    this.pageIndex = event.pageIndex
    this.http.post(environment.apiUrl + `/api/v1/contracts/searchByPage/${event.pageIndex}/${event.pageSize}`, {}).subscribe((response: any) => {
      if (response.data.contracts) {
        this.dataSource.data = response.data.contracts;
      }
    });
  }

  selectProvider(item: any) {
    this.providerSelectedList.push({ cproveedor: item.id, xproveedor: item.value });
    const index = this.providerAllList.findIndex(p => p.id === item.id);
    if (index !== -1) {
      this.providerAllList.splice(index, 1);
    }

    if(this.report !== 'G'){
      this.providerFinallyList = this.selectedReplacement.map((repuesto: any) => ({
        cproveedor: item.id,
        crepuesto: repuesto.crepuesto,
        cservicio: this.selectedServiceId
      }))
      const replacements = this.selectedReplacement
      this.formServicesQuotes.push({cproveedor: item.id, cservicio: this.selectedServiceId, repuestos: replacements})
    }else{
      this.providerFinallyList.push({
        cproveedor: item.id,
        cservicio: this.selectedServiceId,
      })
      
      this.formServicesQuotes.push({cproveedor: item.id, cservicio: this.selectedServiceId})
    }
    console.log(this.providerFinallyList);
  }

  deselectProvider(provider: any) {
    // Lógica para mover un proveedor de 'Proveedores Seleccionados' a 'Proveedores Disponibles'
    this.providerSelectedList = this.providerSelectedList.filter(item => item.id !== provider.id);
    this.providerAllList.push({
      id: provider.cproveedor,
      value: provider.xproveedor
    });
  }

  validateQuotes(){
    if(!this.providerSelectedList[0]){
      Swal.fire({
        title: "No se puede cotizar si no hay proveedores seleccionados.",
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#fcb203d1",
      });
    }else{
      if(!this.providerFinallyList[0]){
        Swal.fire({
          title: "Por favor seleccione los repuestos a cotizar",
          icon: "warning",
          confirmButtonText: "<strong>Aceptar</strong>",
          confirmButtonColor: "#fcb203d1",
        });
      }else{
        this.bottomSheet.open(this.quotesObservation);
      }
    }
  }

  anadirQuotes() {
    const observation = this.quotesFormGroup.get('xobservacion').value;
    // let newQuote = {}
    for (const quote of this.formServicesQuotes) {
      let newQuote = null
      const serviceSelected = this.serviceQuoteList.find(item => item.cservicio == quote.cservicio)
      const providerSelected = this.providerSelectedList.find(item => item.cproveedor == quote.cproveedor)
      if(serviceSelected) {
        newQuote = {
          ...quote,
          cnotificacion: this.itemId,
          xservicio: serviceSelected.xservicio,
          xproveedor: providerSelected.xproveedor,
          report: serviceSelected.report,
          xobservacion: observation,
          mtotalcotizacion: 0,
          mtotal: 0,
          cestatusgeneral: 13,
          fcreacion: new Date(),
          cusuariocreacion: this.currentUser.data.cusuario,
          type: 'create',
        }
      }

      this.filteredQuotesData.push(newQuote) 
    }
    this.formServicesQuotes = []

    this.dialogRef.close();
    this.bottomSheet.dismiss();
  }

  onServiceClick(serviceId: number, report: any) {
    this.selectedServiceId = serviceId;

    this.report = report;
    this.clearProviderLists()
    this.getAllProvider();
  }

  clearProviderLists() {
    this.providerSelectedList = [];
    this.providerFinallyList = []
    this.formServicesQuotes = []
  }

  quoteAcepted(quote: any) {
    this.report = quote.itiporeporte;
    this.quotesFinallyAceptedList = []
    this.replacementQuoteList = [];
    this.dialogRef = this.dialog.open(this.quoteAcep, {
      width: '90%', // Ancho del diálogo
      height: '90%', // Alto del diálogo
      maxWidth: '1200px'
    });

    this.ccotizacion = quote.ccotizacion;
    this.xservicioCotizacion = quote.xservicio;
    this.xproveedor = quote.xproveedor;
    this.xobservacion = quote.xobservacion;

    if(this.report !== 'G'){
      
      this.http.post(environment.apiUrl + `/api/v1/events/quotes-replacement/${this.ccotizacion}`, {}).subscribe((response: any) => {
        this.replacementQuoteList = response.data;
        for (const element of this.replacementQuoteList) {
          if (!element.bdisponible) {
            element.bdisponible = false
          }
        }
      })
    }else{
      this.getCoin();
      this.gruaFormGroup.get('xorigen_grua')?.setValue('')
      this.gruaFormGroup.get('xdestino_grua')?.setValue('')
      this.gruaFormGroup.get('xmoneda')?.setValue('')
      this.gruaFormGroup.get('cmoneda')?.setValue('')
      this.gruaFormGroup.get('mmonto')?.setValue('')
      // this.http.post(environment.apiUrl + `/api/v1/events/quote-delivery/${this.ccotizacion}`, {}).subscribe((response: any) => {
      //   this.replacementQuoteList = response.data;
      // })
    }
  }
  aceptQuote(quote: any) {
    console.log(quote)
  }
  rejectQuote(quote: any) {
    console.log(quote)
  }
  checkMoneda(event) {
    this.gruaFormGroup.get('cmoneda').value
  }
  addCotizacionGrua() {
  
    const cotizacionSelected = this.filteredQuotesData.find(item => item.ccotizacion == this.ccotizacion)
    if (cotizacionSelected) {
      this.montoConIva = 0
      const iva = this.gruaFormGroup.get('mmonto').value * 0.16
      this.montoConIva = this.gruaFormGroup.get('mmonto').value + iva
      const xmoneda = this.coinList.find(item => item.id == this.gruaFormGroup.get('cmoneda').value)
      cotizacionSelected.mmontototal = this.montoConIva;
      cotizacionSelected.cestatusgeneral = 14


      this.quotesFinallyAceptedList.push({
        ccotizacion: cotizacionSelected.ccotizacion,
        xorigen_grua: this.gruaFormGroup.get('xorigen_grua').value,
        xdestino_grua: this.gruaFormGroup.get('xdestino_grua').value,
        cmoneda: this.gruaFormGroup.get('cmoneda')?.value,
        pimpuesto: 16,
        itiporeporte: this.report,
        cestatusgeneral: 14,
        fmodificacion: new Date(),
        cusuariomodificacion: this.currentUser.data.cusuario,
        bdisponible: true,
        mtotal: this.gruaFormGroup.get('mmonto').value,
        mtotalcotizacion: this.montoConIva,
      })
      console.log(this.quotesFinallyAceptedList);
    }
    // console.log(this.filteredQuotesData);
    this.dialogRef.close();
  }


  openModalAvailable(item: any, event: any) {
    item.bdisponible = event.checked
    if(event.checked) {
      this.ncantidad = item.ncantidad;
      this.items = item;
      this.quotesFormGroup.get('ncantidad')?.setValue(this.ncantidad)
      this.getCoin();
      this.dialogRef = this.dialog.open(this.quoteAvailable, {
        width: '90%', // Ancho del diálogo
        height: '90%', // Alto del diálogo
        maxWidth: '500px'
      });
    } else {
      
      const itemCheckedIndex = this.quotesFinallyAceptedList.findIndex(itemR => itemR.crepuesto == item.crepuesto)
      this.quotesFinallyAceptedList.splice(itemCheckedIndex, 1)
      this.quotesAceptedList.splice(itemCheckedIndex, 1)
      delete this.quotesFinallyAceptedList[itemCheckedIndex]
      const mtotalcotizacion = this.quotesAceptedList.reduce((acc, item) => acc + item.mtotalrepuesto, 0);
      this.montoTotalRepuesto = mtotalcotizacion;
      this.montoConIva = mtotalcotizacion * 0.16 + mtotalcotizacion
      for (const replacement of this.quotesFinallyAceptedList) {
        replacement.mtotal = this.montoTotalRepuesto
        replacement.mtotalcotizacion = this.montoConIva
      }
      const epale = this.filteredQuotesData.find(prueba => prueba.ccotizacion === this.ccotizacion);
  
      if (epale) {
        epale.mmontototal = this.montoConIva;
      }
      
    }
  }

  validateQuantity(){
    const cantidad = this.quotesFormGroup.get('ncantidad')?.value
    if(cantidad > this.ncantidad){
      Swal.fire({
        icon: "warning",
        title: `Se excedió de la cantidad solicitada, por favor verifique.`,
        showConfirmButton: false,
        timer: 4000
      }).then((result) => {
        this.quotesFormGroup.get('ncantidad')?.setValue(this.ncantidad)
      });
    }else{
      this.calculateTotalReplacement();
    }
  }

  calculateTotalReplacement(){
    const montoTotal = this.quotesFormGroup.get('munitariorepuesto')?.value * this.quotesFormGroup.get('ncantidad')?.value;

    this.quotesFormGroup.get('mtotalrepuesto')?.setValue(montoTotal)
  }

  resultFinalQuotes(){
    this.onNextStepQuoteAcepted();

    if(this.validForm) {
      this.quotesAceptedList.push({
        ccotizacion: this.items.ccotizacion,
        crepuesto: this.items.crepuesto,
        xrepuesto: this.items.xrepuesto,
        ncantidad: this.quotesFormGroup.get('ncantidad')?.value,
        bdisponible: true,
        munitariorepuesto: this.quotesFormGroup.get('munitariorepuesto')?.value,
        mtotalrepuesto: this.quotesFormGroup.get('mtotalrepuesto')?.value,
      })
  
      const mtotalcotizacion = this.quotesAceptedList.reduce((acc, item) => acc + item.mtotalrepuesto, 0);
      
  
      this.quotesFinallyAceptedList = this.quotesAceptedList.map(item => {
        this.montoTotalRepuesto = mtotalcotizacion;
        this.montoConIva = mtotalcotizacion * 0.16 + mtotalcotizacion
        const moneda = this.coinList.find(id => id.id === this.quotesFormGroup.get('cmoneda')?.value);
        return {
          ccotizacion: item.ccotizacion,
          crepuesto: item.crepuesto,
          xrepuesto: item.xrepuesto,
          ncantidad: item.ncantidad,
          bdisponible: true,
          munitariorepuesto: item.munitariorepuesto,
          mtotalrepuesto: item.mtotalrepuesto,
          mtotal: mtotalcotizacion,
          itiporeporte: this.report,
          mtotalcotizacion: this.montoConIva,
          cmoneda: this.quotesFormGroup.get('cmoneda')?.value,
          pimpuesto: 16,
          cestatusgeneral: 14,
          fmodificacion: new Date(),
          cusuariomodificacion: this.currentUser.data.cusuario
        };
      });
  
      if(this.quotesAceptedList.length > 0){
        this.quotesFormGroup.patchValue({
          munitariorepuesto: '',
          cmoneda: '',
          mtotalrepuesto: ''
        });
      }

      
  
      const epale = this.filteredQuotesData.find(prueba => prueba.ccotizacion === this.ccotizacion);
  
      if (epale) {
        epale.mmontototal = this.montoConIva;
        epale.cestatusgeneral = 14
      }
    }
    console.log(this.quotesFinallyAceptedList);

    this.closeQuoteAcepted()

  }

  onSelectQuote(event) {
    console.log(this.serviceOrderFormGroup.get('ccotizacion')?.value);
    
    if(event.value) {
      const selectedQuote = this.aceptedQuotes.find(quote => quote.ccotizacion == event.value)
      this.serviceOrderFormGroup.get('xobservacion')?.setValue(selectedQuote.xobservacion)
      const selectedContractService = this.serviceList.find(item => item.value.toUpperCase() == selectedQuote.xservicio.toUpperCase())
      const selectedAditionalService = this.additionalServiceList.find(item => item.value.toUpperCase() == selectedQuote.xservicio.toUpperCase())
      this.serviceOrderFormGroup.get('xservicio')?.disable();
      this.serviceOrderFormGroup.get('xservicio_adicional')?.disable();
      if(selectedContractService) {
        this.serviceOrderFormGroup.get('xservicio')?.setValue(selectedQuote.xservicio)
        this.serviceOrderFormGroup.get('cservicio')?.setValue(selectedContractService.id);
        this.serviceOrderFormGroup.get('xservicio_adicional')?.setValue('');
        this.serviceOrderFormGroup.get('cservicio_adicional')?.setValue(null);
        this.cservicio = selectedContractService.id;
        this.xservicio = selectedQuote.xservicio;
      } if(selectedAditionalService) {
        this.serviceOrderFormGroup.get('xservicio_adicional')?.setValue(selectedQuote.xservicio)
        this.serviceOrderFormGroup.get('cservicio_adicional')?.setValue(selectedAditionalService.id);
        this.cservicio = selectedAditionalService.id;
        this.xservicio = selectedQuote.xservicio;
        this.serviceOrderFormGroup.get('xservicio')?.setValue('');
        this.serviceOrderFormGroup.get('cservicio')?.setValue(null);
        this.serviceOrderFormGroup.get('cservicio')?.clearValidators();
        this.serviceOrderFormGroup.get('cservicio')?.updateValueAndValidity();
      }
      this.serviceOrderFormGroup.get('xproveedor')?.disable()
      this.serviceOrderFormGroup.get('xproveedor')?.setValue(selectedQuote.xproveedor)
      this.serviceOrderFormGroup.get('cproveedor')?.setValue(selectedQuote.cproveedor)

      if(selectedQuote.itiporeporte != 'G') {
        this.http.post(environment.apiUrl + `/api/v1/events/quotes-replacement/detail/${selectedQuote.ccotizacion}`, {}).subscribe((response: any) => {
          this.quotesFinallyAceptedList = []
          this.quotesFinallyAceptedList = response.data.filter(quote => {
            if(quote.cestatusgeneral == 4) {
              return quote
            }
          });
          this.activaGrua = false
          this.activaReplacements = true
        })
      } else {
        this.quotesFinallyAceptedList = []
        this.activaGrua = true
        this.activaReplacements = false
        this.http.post(environment.apiUrl + `/api/v1/events/quote-delivery/detail/${selectedQuote.ccotizacion}`, {}).subscribe((response: any) => {
          const delivery = response.data[0]
          this.serviceOrderFormGroup.get('xorigen_grua').setValue(delivery.xorigen_grua)
          this.serviceOrderFormGroup.get('xdestino_grua').setValue(delivery.xdestino_grua)
          this.serviceOrderFormGroup.get('mmonto').setValue(delivery.mtotalcotizacion)
          this.serviceOrderFormGroup.get('xmoneda').setValue(delivery.xmoneda)
          this.serviceOrderFormGroup.get('cmoneda').setValue(delivery.cmoneda)
          this.serviceOrderFormGroup.get('xorigen_grua').disable()
          this.serviceOrderFormGroup.get('xdestino_grua').disable()
          this.serviceOrderFormGroup.get('mmonto').disable()
          this.serviceOrderFormGroup.get('xmoneda').disable()
          // this.quotesFinallyAceptedList = response.data.filter(quote => {
          //   if(quote.cestatusgeneral == 4) {
          //     return quote
          //   }
          // });
        })
      }


    } else {
      // this.quotesFinallyAceptedList = []
      this.activaReplacements = false
      this.activaGrua = false
      this.serviceOrderFormGroup.get('xobservacion')?.setValue('')
      this.serviceOrderFormGroup.get('xservicio_adicional')?.setValue('')
      this.serviceOrderFormGroup.get('xservicio')?.setValue('')
      this.serviceOrderFormGroup.get('cservicio')?.setValue(null)
      this.serviceOrderFormGroup.get('cservicio_adicional')?.setValue(null)
      this.serviceOrderFormGroup.get('xproveedor')?.setValue('')
      
      this.serviceOrderFormGroup.get('xservicio')?.enable()
      this.serviceOrderFormGroup.get('xservicio_adicional')?.enable()
      this.serviceOrderFormGroup.get('xproveedor')?.enable()

      this.serviceOrderFormGroup.get('xorigen_grua').setValue('')
        this.serviceOrderFormGroup.get('xdestino_grua').setValue('')
        this.serviceOrderFormGroup.get('mmonto').setValue('')
        this.serviceOrderFormGroup.get('xmoneda').setValue('')
        this.serviceOrderFormGroup.get('xorigen_grua').enable()
        this.serviceOrderFormGroup.get('xdestino_grua').enable()
        this.serviceOrderFormGroup.get('mmonto').enable()
        this.serviceOrderFormGroup.get('xmoneda').enable()

    }
  }

  quoteDetail(quote: any) {
    this.quotesFinallyAceptedList = []
    this.report = quote.itiporeporte;
    this.replacementQuoteList = [];
    this.selectAll = false
    this.formType = 'accept'
    this.dialogRef = this.dialog.open(this.quoteAcep2, {
      width: '90%', // Ancho del diálogo
      height: '90%', // Alto del diálogo
      maxWidth: '1200px'
    });

    this.ccotizacion = quote.ccotizacion;
    this.xservicioCotizacion = quote.xservicio;
    this.xproveedor = quote.xproveedor;
    this.xobservacion = quote.xobservacion;

    if(quote.cestatusgeneral == 4) {
      this.quoteDetailsDisable = true
    } else {
      this.quoteDetailsDisable = false
    }

    if(this.report !== 'G'){
      
      this.http.post(environment.apiUrl + `/api/v1/events/quotes-replacement/detail/${this.ccotizacion}`, {}).subscribe((response: any) => {
        this.quotesFinallyAceptedList = [];
        this.quotesFinallyAceptedList = response.data;
        this.quotesFinallyAceptedList.forEach(quote => {
          if(quote.cestatusgeneral == 4) {
            quote.selected = true
          } else {
            quote.selected = false
          }
        });
        this.selectAll = this.quotesFinallyAceptedList.every(item => item.selected);
        this.montoConIva = response.data[0].mtotalcotizacion
      })
    }else{
      this.http.post(environment.apiUrl + `/api/v1/events/quote-delivery/${this.ccotizacion}`, {}).subscribe((response: any) => {
        this.getCoin()
        
        this.quotesFinallyAceptedList = response.data;

        console.log(this.quotesFinallyAceptedList);
      })
    }
  }

  toggleAllSelections(event: any) {
    const checked = event.target.checked;
    this.quotesFinallyAceptedList.forEach(item => {
      item.selected = checked;
      this.updateSelectedItems(item);
    });
  }

  toggleSelection2(item: any) {
    item.selected = !item.selected;
    this.updateSelectedItems(item);
    this.selectAll = this.quotesFinallyAceptedList.every(item => item.selected);
    
  }

  updateSelectedItems(item: any) {
    if (item.selected) {
      if (!this.selectedItems.includes(item)) {
        this.selectedItems.push(item);
        item.mivaindividual = this.calculateIva(item.mtotalrepuesto);
        item.cestatusgeneral = 4;
        item.type = 'accept'
      }
    } else {
      this.selectedItems = this.selectedItems.filter(i => i !== item);
      item.mtotalrepuesto = item.munitariorepuesto * item.ncantidad;  // Restablece el monto total original
      item.mivaindividual = null;
      item.cestatusgeneral = 14;
    }
  }

  closeQuotesAcepted(){
    if(this.formType == 'accept'){
      let total = 0
      let code = this.quotesFinallyAceptedList[0].ccotizacion
      this.quotesFinallyAceptedList.forEach(element => {
        element.cestatusgeneral = 4
        if(element.selected){
          total += (element.mtotalrepuesto * 0.16) + element.mtotalrepuesto
        }
      });
      this.quotesFinallyAceptedList.forEach(element=> {
        element.mtotalcotizacion = total
      })
      const searchedQuote = this.filteredQuotesData.find(element => element.ccotizacion == code)
      if(searchedQuote) {
        searchedQuote.mmontototal = total
      }
    }
    this.dialogRef.close();

    console.log(this.quotesFinallyAceptedList)
  }
  closeQuotesDeliveryAcepted(){
    this.dialogRef.close();
    this.quotesFinallyAceptedList.forEach(element => {
      element.cestatusgeneral = 4
    });
    console.log(this.quotesFinallyAceptedList)
  }

  calculateIva(mtotalrepuesto: number): number {
    const iva = mtotalrepuesto * 0.16;
    return mtotalrepuesto + iva;
  }

  onSubmit(){
    let urlToSubmit = ''
    this.loading = true;
    this.information = false;

    let data = {
      cnotificacion: this.itemId,
      ccontratoflota: this.contractFormGroup.get('ccontratoflota')?.value,
      ctiponotificacion: this.claimFormGroup.get('ctiponotificacion')?.value,
      ccausasiniestro: this.claimFormGroup.get('ccausasiniestro')?.value,
      xnombre: this.claimFormGroup.get('xnombrecompleto')?.value,
      xtelefono: this.claimFormGroup.get('xtelefonosiniestro')?.value,
      xnombrealternativo: this.claimFormGroup.get('xnombrecompleto_al')?.value,
      xtelefonoalternativo: this.claimFormGroup.get('xtelefono_al')?.value,
      bdano: this.claimFormGroup.get('bdano')?.value,
      btransitar: this.claimFormGroup.get('btransitar')?.value,
      bdanootro: this.claimFormGroup.get('bdanootro')?.value,
      blesionado: this.claimFormGroup.get('blesionado')?.value,
      bpropietario: this.claimFormGroup.get('bpropietario')?.value,
      fevento: this.claimFormGroup.get('fevento')?.value,
      cestado: this.claimFormGroup.get('cestado')?.value,
      cciudad: this.claimFormGroup.get('cciudad')?.value,
      xdireccion: this.claimFormGroup.get('xdireccion')?.value,
      xdescripcion: this.claimFormGroup.get('xdescripcion')?.value,
      btransito: this.claimFormGroup.get('btransito')?.value,
      bcarga: this.claimFormGroup.get('bcarga')?.value,
      bpasajero: this.claimFormGroup.get('bpasajero')?.value,
      xobservacion: this.claimFormGroup.get('xobservacion')?.value,
      cpais: this.currentUser.data.cpais,
      ccompania: this.contractFormGroup.get('ccompania')?.value,
      bactivo: 1,
      fcreacion: new Date(),
      cusuariocreacion: this.currentUser.data.cusuario,
      seguimientos: this.seguimientosList,
      notas: this.notasList,
      repuestos: this.selectedReplacement.map(({ xrepuesto, ...rest }) => rest),
      serviceOrder: this.serviceOrderList.map(({ xservicio, xrepuesto, xmoneda, id, ...rest }) => rest),
      quotes: this.providerFinallyList,
      quotesAccepted: this.quotesFinallyAceptedList,
      quotesData: this.filteredQuotesData
    }

    if(this.mode == 'create') {
      urlToSubmit = '/api/v1/events/create'
    } else {
      urlToSubmit ='/api/v1/events/update'
    }

    this.http.post(environment.apiUrl + urlToSubmit, data).subscribe((response: any) => {
      if(response.status){
        this.loading = false;
        Swal.fire({
          icon: "success",
          title: `${response.message}`,
          showConfirmButton: false,
          timer: 4000
        }).then((result) => {
          if(this.mode == 'create'){
            if (result.dismiss === Swal.DismissReason.timer) {
              window.location.href = '/admin/events';
            }
          }else{
            if (result.dismiss === Swal.DismissReason.timer) {
              location.reload()
            }
          }

        });
      }
    },(err) => {
      Swal.fire({
        icon: "error",
        title: "Ha ocurrido un Error",
        text: "Estimado usuario, se ha presentado un error inesperado, por favor, contacta al equipo técnico para mayor información",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#fcb203d1",
      }).then((result) => {
          if (result.isConfirmed) {
              location.reload(); // Recarga la página si el usuario hizo clic en el botón de aceptar
          }
      });
    })
  }

  parseDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
  }
}
