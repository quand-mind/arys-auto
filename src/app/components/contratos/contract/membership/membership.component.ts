import {Component, OnInit, ViewChild, TemplateRef, Input, Output } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl , FormArray} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {from, Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatStepper } from '@angular/material/stepper';
import { PdfGenerationService } from './../../../../_services/ServicePDF'
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDatepicker } from '@angular/material/datepicker';
import { ChangeDetectorRef } from '@angular/core';
// import { format, addYears } from 'date-fns';
import { environment } from './../../../../../environments/environment';
import Swal from 'sweetalert2'

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
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss'],
})
export class MembershipComponent implements OnInit {

  
  @ViewChild('stepper') stepper!: MatStepper;

  type: any = ''
  sub = new Subscription()

  prueba: any = 'esto es una prueba'

  campoNombres: { [key: string]: string } = { // Mapa de nombres de campo
    icedula: 'Tipo de Documento de Identidad',
    xrif_cliente: 'RIF o Cédula',
    xnombre: 'Nombre',
    xapellido: 'Apellido',
    xtelefono_emp: 'Teléfono',
    email: 'Correo',
    cestado: 'Estado',
    cciudad: 'Ciudad',
    xdireccion: 'Dirección',
  };

  campoNombresV: { [key: string]: string } = {
    xplaca: 'Placa',
    xmarca: 'Marca',
    xmodelo: 'Modelo',
    xversion: 'Version',
    fano: 'Año',
    ccolor: 'Color',
    xserialcarroceria: 'Serial de Carroceria'
  };

  currentUser!: any
  oneStepLists: any = {
    dataList: [],
    identList: ['V', 'P', 'E', 'J', 'C','G'],    
    stateList: [],
    cityList: [],
    stateTakerList: [],
    cityTakerList: [],
  }
  twoStepLists: any = {
    brandList: [],
    modelList: [],
    versionList: [],
    colorList: [],
    ratesList: [],
    typeVehicleList: [],
    utilityVehicleList: [],
    utilityList: []
  }
  threeStepLists: any = {
    classList: [],
    companiaList: [],
    planList: [],
    methodOfPaymentList: []
  }
  
  brokerList:  any[] = [];
  accesoriesList: any[] = [];
  takersList: any[] = [];
  accessorySelected: any[] = [];
  typeOfPayList: any[] = [];
  bankList: any[] = [];
  targetBankList: any[] = [];
  // groupList: any[] = [];
  // parsedData: any[] = [];

  oneStepControls: any = {
    identControl: new FormControl(''),
    stateControl: new FormControl(''),
    cityControl: new FormControl('')
  }

  twoStepControls: any = {
    brandControl: new FormControl(''),
    modelControl: new FormControl(''),
    versionControl: new FormControl(''),
    colorControl: new FormControl(''),
    ratesControl: new FormControl(''),
    typeVehicleControl: new FormControl(''),
    utilityVehicleControl: new FormControl(''),
    utilityControl: new FormControl('')
  }
  threeStepControls: any = {
    classControl: new FormControl(''),
    planControl: new FormControl(''),
    companiaControl: new FormControl(''),
    methodOfPaymentControl: new FormControl(''),
  }
  brokerControl = new FormControl('');
  accesories = new FormControl('');
  takersControl = new FormControl('');

  filteredIdent!: Observable<string[]>;
  filteredState!: Observable<string[]>;
  filteredCity!: Observable<string[]>;

  filteredBrand!: Observable<string[]>;
  filteredModel!: Observable<string[]>;
  filteredVersion!: Observable<string[]>;
  filteredColor!: Observable<string[]>;
  filteredRates!: Observable<string[]>;
  filteredTypeVehicle!: Observable<string[]>;
  filteredUtilityVehicle!: Observable<string[]>;
  filteredUtility!: Observable<string[]>;

  filteredClass!: Observable<string[]>;
  filteredCompania!: Observable<string[]>;
  filteredPlan!: Observable<string[]>;
  filteredMethodOfPayment!: Observable<string[]>;

  filteredBroker!: Observable<string[]>;
  filteredTakers!: Observable<string[]>;

  bcv!: any ;
  check = false;
  helmet: boolean = false;
  trans: boolean = true;
  submit: boolean = true;
  discount: boolean = false;
  enableInfo: boolean = false;
  amountTotalRcv: boolean = false;
  amountTotalCasco: boolean = false;
  buttonEmissions: boolean = false;
  loadingEmissions: boolean = false;
  activateInspection: boolean = false;
  activateUtility: boolean = false;
  loadingPdf: boolean = false;
  activateAttachment: boolean = false;
  firstTime: boolean = true;
  detail: boolean = false;
  takersInfo: boolean = false;
  activateTypeVehicle: boolean = false;
  isModalActive: boolean = false; 
  activateRate: boolean = false;
  methodOfPayment: boolean = false;
  bpagarubii: boolean = false;
  amountDollar: boolean = false;
  amountBs: boolean = false;
  userBroker: boolean = false;
  paymentButtons: boolean = true;
  paymentButtonManual: boolean = true;
  activateGroup: boolean = false;
  activateBrandList: boolean = true;
  activateBrandText: boolean = false;
  casco: boolean = false;
  activaSexoYEs: boolean = true;
  activaRepresentante: boolean = false;
  activaNombreYapellido: boolean = true;
  loading: boolean = false;
  primaBruta!: any;
  descuento!: any;
  sumaAsegurada!: any;
  sumaAseguradaBase!: any;
  sumaAseguradaMax!: any;
  sumaAseguradaMin!: any;
  montoTotal!: any;
  montoDollar!: any;
  montoBs!: any;
  ccontratoflota!: any;
  token!: any
  today!: Date;
  xmetodologia!: any;
  xprimaAccesorio!: any;
  ubii!: any;
  itipo!: any ;
  tasaCascoInicial!: any ;
  primaCascoInicial!: any ;
  xprimaTotalCasco!: any ;
  pmotin!: any ;  
  primaMotin!: any ;  
  primaRiesgo!: any ; 
  primaRobo!: any ; 
  primaFinal!: any ; 
  ccotizacion!: any ; 
  fano!: any ; 
  xcompania!: any ; 
  ccompania!: any ; 
  cplan!: any ; 
  ctarifa!: any ;
  suma_aseg!: any ;
  prima!: any ;
  messageCoti: boolean = false;
  fechas!: any ;
  recargaInicial!: any ;
  ocultarRecarga: boolean = true;
  activateCard: boolean = false;
  xnombrePlan!: any
  serviceList: any[] = [];
  activateCardService: boolean = false;
  message

  constructor(private _formBuilder: FormBuilder,
              private http: HttpClient,
              private modalService: NgbModal,
              private dateAdapter: DateAdapter<Date>,
              private pdfGenerationService: PdfGenerationService,
              private snackBar: MatSnackBar,
              private cdr: ChangeDetectorRef,
              private route: ActivatedRoute,

              private router: Router,
              ) { dateAdapter.setLocale('es');}

  personsFormGroup = this._formBuilder.group({
    icedula: ['', Validators.required],
    xrif_cliente: ['', Validators.required],
    xnombre: ['', Validators.required],
    xapellido: ['', Validators.required],
    xtelefono_emp: ['', Validators.required],
    email: ['', Validators.required],
    cestado: ['', Validators.required],
    xestado: [''],
    cciudad: ['', Validators.required],
    xciudad: [''],
    xdireccion: [''],
  });

  vehicleFormGroup = this._formBuilder.group({
    ccotizacion: [{ value: '', disabled: false }],
    cinspeccion: [{ value: '', disabled: false }],
    xplaca: ['',[Validators.required, Validators.maxLength(7)]],
    xmarca: ['', [Validators.required, Validators.maxLength(50)]],
    xmodelo: ['', [Validators.required, Validators.maxLength(50)]],
    xversion: ['', [Validators.required, Validators.maxLength(50)]],
    fano: ['',[Validators.required, Validators.maxLength(4)]],
    npasajeros: [{ value: '', disabled: true }],
    cclasificacion: [''], 
    xtipovehiculo: [''],
    ccolor: ['', Validators.required],
    xserialcarroceria: ['', [Validators.required, Validators.maxLength(17)]],
    xserialmotor: ['', [Validators.maxLength(17)]],
    xcobertura: [{ value: 'Rcv', disabled: true}, Validators.required],
    cuso: [''],
    cusoVeh: [''],
    xuso: [''],
    precargo: [''],
    ctipovehiculo: [''],
    cclase: [''],
    id_inma: [''],
    npesovacio: [''],
    ncapcarga: [''],
  });

  planFormGroup = this._formBuilder.group({
    cplan: ['', Validators.required],
    xplan: [{ value: '', disabled: true }],
    xpago: [''],
    femision: [''],
    fdesde: ['', Validators.required],
    fhasta: ['', Validators.required],
    cmetodologiapago: ['', Validators.required],
    ctipopago: [''],
    cbanco: [''],
    cbanco_destino: [''],
    fcobro: [''],
    xreferencia: [''],
    mprima_pagada: [''],
    mpagado: [''],
    xmoneda: [''],
    mprima_accesorio: [''],
    irecibo: ['']
  });


  isLinear = true;

  ngOnInit(){
    this.sub = this.route
    .data
    .subscribe(v => {
      this.type = v.type
      if (this.type == 'corporate') {
        this.planFormGroup.addControl('ccompania', new FormControl('', Validators.required))
        this.planFormGroup.addControl('xcompania', new FormControl({ value: '', disabled: true }))
      }
    });
    const storedSession = localStorage.getItem('user');
    this.currentUser = JSON.parse(storedSession);
    if(this.currentUser){
      this.getState();
      this.getColor();
      this.getRates();
      this.getTypeVehicles();
      this.getUtilityVehicle();
      this.getClass();
      this.getPlan();
      if (this.type == 'corporate') {
        this.getCompania();
      } else if(this.type == 'membership') {
        
      }
      this.getMethodOfPayment();
      // this.setDefaultDates();
      this.getTypeOfPay();
      this.getUtility();
      this.fechas = 'Fecha de Nacimiento';
      fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv')
      .then((response) => response.json())
      .then(data => {
        this.bcv = data.monitors.usd.price
      })
        
      this.planFormGroup.get('fdesde')?.setValue(new Date());
      
      const fdesdeString = this.planFormGroup.get('fdesde')?.value;
      
      if (fdesdeString) {
        const fdesde = new Date(fdesdeString);
        const fhasta = new Date(fdesde);
      
        fhasta.setFullYear(fhasta.getFullYear() + 1);
      
        const formattedFhasta = fhasta.toISOString().split('T')[0]; // Obtener solo la parte de la fecha sin la hora
        this.planFormGroup.get('fhasta')?.setValue(fhasta);
  
      }
  
      this.filteredIdent = this.oneStepControls.identControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    }

  }

  formatCurrency(value: any): string {
    const formatter = new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
    });
    return formatter.format(value);
  }

  changePersonFormGroupValue(event: any) {
    console.log(event)
  }
  clearValidatorsPersonFormGroup (event: any) {
    this.personsFormGroup.get(event.key)?.clearValidators();
  }

  calculateYears(event: any) {
    const selectedDate = new Date(event.value);
    const currentDate = new Date();
    const eighteenYearsAgo = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
    if (selectedDate > eighteenYearsAgo) {
      this.snackBar.open('Usted es menor de edad, por ende no se puede generar un Contrato', '', {
        duration: 5000,
      });

      this.personsFormGroup.get('fnacimiento')?.setValue('')

      return
    }
  }

  searchPropietary(){
    let data = {
      xrif_cliente: this.personsFormGroup.get('xrif_cliente')?.value
    };
    this.http.post(environment.apiUrl + '/api/v1/contracts/search-propietary', data).subscribe(async (response: any) => {
      if (response.status) {
        if(response.data) {
          if(response.data.xnombre) {

            this.personsFormGroup.get('xnombre')?.setValue(response.data.xnombre)
            this.personsFormGroup.get('xapellido')?.setValue(response.data.xapellido)
            this.personsFormGroup.get('xtelefono_emp')?.setValue(response.data.xtelefono)
            this.personsFormGroup.get('email')?.setValue(response.data.xcorreo)
            this.personsFormGroup.get('cestado')?.setValue(response.data.cestado)
            this.getState()
            this.personsFormGroup.get('cciudad')?.setValue(response.data.cciudad)
            this.getCity();
            this.personsFormGroup.get('xdireccion')?.setValue(response.data.xdireccion)
          }
        }
      }
    });
  }

  onNextStep() {
    if (this.personsFormGroup.valid) {
      this.stepper.next();
      // Si el formulario es válido, permite pasar al siguiente paso
      // Puedes poner aquí cualquier lógica adicional que necesites
    } else {
 // Si el formulario es inválido, construir mensaje de campos faltantes
      let camposFaltantes = '';
      camposFaltantes += '<br>- ';
      Object.keys(this.personsFormGroup.controls).forEach(key => {
        const control = this.personsFormGroup.get(key);
         // Usar el mapa de nombres de campo
        if(key == 'xestado' || key == 'xciudad'){} else {
          if (control && control.invalid) { // Agregar verificación de nulidad
            camposFaltantes += this.campoNombres[key] + '<br>-'; // Usar el mapa de nombres de campo
          }
        }
      });
      camposFaltantes = camposFaltantes.slice(0, -2); // Eliminar la coma y el espacio extra al final
      Swal.fire({
        title: "Por favor, complete los siguientes campos: <br>",
        html: `${camposFaltantes}`, // Usar html en lugar de text
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#fcb203d1",
      });
    }
  }

  onNextStepV() {
    if (this.vehicleFormGroup.valid) {
      this.stepper.next();
      // Si el formulario es válido, permite pasar al siguiente paso
      // Puedes poner aquí cualquier lógica adicional que necesites
    } else {
      let camposFaltantes = '';
      camposFaltantes += '<br>- ';
      Object.keys(this.vehicleFormGroup.controls).forEach(key => {
        const control = this.vehicleFormGroup.get(key);
        if (control && control.invalid) {
          const nombreCampo = this.campoNombresV[key] || key;
          camposFaltantes += nombreCampo + '<br>-';
        }
      });
      camposFaltantes = camposFaltantes.slice(0, -2); // Eliminar la coma y el espacio extra al final
      Swal.fire({
        title: "Por favor, complete los siguientes campos: <br>",
        html: `${camposFaltantes}`, // Usar html en lugar de text
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#fcb203d1",
      });
    }
  }

  checkPressEnter(event: any) {
    if(event.key == 'Enter') {
      event.preventDefault()
    }
  }

  checkPress(event: any) {
    if(event.key == 'Enter' || event.key == 'Tab') {
      console.log('searching...')
      this.searchPropietary()
    }
  }

  onNextStepP() {
    if (this.planFormGroup.valid) {
      this.stepper.next();
      // Si el formulario es válido, permite pasar al siguiente paso
      // Puedes poner aquí cualquier lógica adicional que necesites
    } else {
      window.alert('Por favor, seleccione un plan para poder continuar con la autogestión vehicular');
    }
  }

  valueplate(value: any){
    var ExpRegSoloLetras="^[A-Za-z0-9\s]+$";
    if(value.data.match(ExpRegSoloLetras)==null){
 

      const formulario = this.vehicleFormGroup.get('xplaca')?.value  || ''
      const newValue = formulario.replace(new RegExp(`[^A-Za-z0-9\\s]`, 'g'), '');
    
      // Actualiza el valor en el formulario
      this.vehicleFormGroup.get('xplaca')?.setValue(newValue);

    }
  }

  valueSerial(value: any){
    var ExpRegSoloLetras="^[A-Za-z0-9\s]+$";
    if(value.data.match(ExpRegSoloLetras)==null){

      const formulario = this.vehicleFormGroup.get('xserialcarroceria')?.value  || ''
      const newValue = formulario.replace(new RegExp(`[^A-Za-z0-9\\s]`, 'g'), '');
    
      // Actualiza el valor en el formulario
      this.vehicleFormGroup.get('xserialcarroceria')?.setValue(newValue);

    }
  }

  valueSerialMotor(value: any){
    var ExpRegSoloLetras="^[A-Za-z0-9\s]+$";
    if(value.data.match(ExpRegSoloLetras)==null){
      const formulario = this.vehicleFormGroup.get('xserialmotor')?.value  || ''
      const newValue = formulario.replace(new RegExp(`[^A-Za-z0-9\\s]`, 'g'), '');
    
      // Actualiza el valor en el formulario
      this.vehicleFormGroup.get('xserialmotor')?.setValue(newValue);

    }
  }

  searchVehicle(){
    let data = {
      xplaca: this.vehicleFormGroup.get('xplaca')?.value
    };

    this.http.post(environment.apiUrl + '/api/v1/contracts/vehicle', data).subscribe((response: any) => {
      if (response.status) {
        this.snackBar.open(`${response.message}`, '', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.vehicleFormGroup.get('xplaca')?.setValue('')
      }
    });
  }

  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();

    return this.oneStepLists.identList.filter(ident => ident.toLowerCase().includes(filterValue));
  }

  onIdentSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedIdent = this.oneStepLists.identList.find(ident => ident === selectedValue);
    if (selectedIdent) {
      this.personsFormGroup.get('icedula')?.setValue(selectedIdent)
    }

    // Si selectedIdent es distinto de 'V', eliminar la validación de 'fnacimiento'
    if (selectedIdent !== 'V') {
      this.personsFormGroup.get('fnacimiento')?.clearValidators();
      this.personsFormGroup.get('iestado_civil')?.clearValidators();
      this.personsFormGroup.get('isexo')?.clearValidators();
      this.personsFormGroup.get('xapellido')?.clearValidators();
      this.fechas = 'Fecha de Registro';
    } else { // Si selectedIdent es 'V', establecer la validación de 'fnacimiento'
      this.personsFormGroup.get('fnacimiento')?.setValidators([Validators.required]);
      this.personsFormGroup.get('iestado_civil')?.setValidators([Validators.required]);
      this.personsFormGroup.get('isexo')?.setValidators([Validators.required]);
      this.personsFormGroup.get('xapellido')?.setValidators([Validators.required]);
      this.fechas = 'Fecha de Nacimiento';
    }

    // Actualizar los controles después de cambiar las validaciones
    this.personsFormGroup.get('fnacimiento')?.updateValueAndValidity();
    this.personsFormGroup.get('iestado_civil')?.updateValueAndValidity();
    this.personsFormGroup.get('isexo')?.updateValueAndValidity();
    this.personsFormGroup.get('xapellido')?.updateValueAndValidity();
  }

  getState(){
    let data = {
      cpais: this.currentUser.data.cpais
    };
    this.http.post(environment.apiUrl + '/api/v1/valrep/state', data).subscribe((response: any) => {
      this.oneStepLists.stateList = []
      if (response.data.state) {

        for (let i = 0; i < response.data.state.length; i++) {
          this.oneStepLists.stateList.push({
            id: response.data.state[i].cestado,
            value: response.data.state[i].xdescripcion_l
          });

          if(this.personsFormGroup.get('cestado')?.value){
            const estadoSeleccionado = this.oneStepLists.stateList.find(state => state.id === this.personsFormGroup.get('cestado')?.value);
            if (estadoSeleccionado) {
                this.personsFormGroup.get('cestado')?.setValue(estadoSeleccionado.id)
                this.personsFormGroup.get('xestado')?.setValue(estadoSeleccionado.value)
            }
          }
        }

        

        this.filteredState = this.oneStepControls.stateControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterState(value || ''))
        );
      }
    });
  }

  private _filterState(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.oneStepLists.stateList
      .map(state => state.value)
      .filter(state => state.toLowerCase().includes(filterValue));
  }

  onStateSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedState = this.oneStepLists.stateList.find(state => state.value === selectedValue);
    if (selectedState) {
      this.personsFormGroup.get('cestado')?.setValue(selectedState.id);
      this.personsFormGroup.get('xestado')?.setValue(selectedState.value);
      this.getCity();
    }
  }

  getCity(){
    let data = {
      cpais: this.currentUser.data.cpais,
      cestado: this.personsFormGroup.get('cestado')?.value
    };
    this.http.post(environment.apiUrl + '/api/v1/valrep/city', data).subscribe((response: any) => {
      if (response.data.city) {
        this.oneStepLists.cityList = []
        for (let i = 0; i < response.data.city.length; i++) {
          this.oneStepLists.cityList.push({
            id: response.data.city[i].cciudad,
            value: response.data.city[i].xdescripcion_l
          });

          if(this.personsFormGroup.get('cciudad')?.value){
            const ciudadSeleccionado = this.oneStepLists.cityList.find(city => city.id === this.personsFormGroup.get('cciudad')?.value);
            if (ciudadSeleccionado) {
                this.personsFormGroup.get('cciudad')?.setValue(ciudadSeleccionado.id)
                this.personsFormGroup.get('xciudad')?.setValue(ciudadSeleccionado.value)
              } else {
                this.personsFormGroup.get('cciudad')?.setValue('')
                this.personsFormGroup.get('xciudad')?.setValue('')

            }
          }
        }


        this.filteredCity = this.oneStepControls.cityControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCity(value || ''))
        );
      }
    });
  }

  private _filterCity(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.oneStepLists.cityList
      .map(city => city.value)
      .filter(city => city.toLowerCase().includes(filterValue));
  }

  onCitySelection(event: any) {
    const selectedValue = event.option.value;
    const selectedCity = this.oneStepLists.cityList.find(city => city.value === selectedValue);
    if (selectedCity) {
      this.personsFormGroup.get('cciudad')?.setValue(selectedCity.id);
      this.personsFormGroup.get('xciudad')?.setValue(selectedCity.value);
    }
  }

  changeYears() {
    this.getBrand() 
  }

  getBrand(){
    let data = {
      qano: this.vehicleFormGroup.get('fano')?.value
    };
    this.http.post(environment.apiUrl + '/api/v1/valrep/brand', data).subscribe((response: any) => {
      if (response.data.brand) {
        this.twoStepLists.brandList = [];
        for (let i = 0; i < response.data.brand.length; i++) {
          this.twoStepLists.brandList.push({
            id: i,
            value: response.data.brand[i].xmarca,
          });
        }
        this.twoStepLists.brandList.sort((a, b) => a.value > b.value ? 1 : -1);

        if(!this.twoStepLists.brandList[0]){
          window.alert(`No existe una Marca para el año ${data.qano}`)
          this.vehicleFormGroup.get('fano')?.setValue('')
        }

        this.filteredBrand = this.twoStepControls.brandControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterBrand(value || ''))
        );

        const brandSelected = this.twoStepLists.brandList.find(brand => brand.value === this.vehicleFormGroup.get('xmarca')?.value);
        if (!brandSelected) {
          this.twoStepControls.brandControl.setValue('')
          this.vehicleFormGroup.get('xmarca')?.setValue('')
        }
        this.getModel();
      }
    });
  }

  private _filterBrand(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.twoStepLists.brandList
      .map(brand => brand.value)
      .filter(brand => brand.toLowerCase().includes(filterValue));
  }

  onBrandSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedBrand = this.twoStepLists.brandList.find(brand => brand.value === selectedValue);
    if (selectedBrand) {
      this.vehicleFormGroup.get('xmarca')?.setValue(selectedBrand.value);
      this.getModel();
    }else if(this.ccotizacion){
      this.vehicleFormGroup.get('xmarca')?.setValue(selectedValue);
      this.getModel();
    }
  }

  getModel(){
    let data = {
      qano: this.vehicleFormGroup.get('fano')?.value,
      xmarca: this.vehicleFormGroup.get('xmarca')?.value,
    };
    this.http.post(environment.apiUrl + '/api/v1/valrep/model', data).subscribe((response: any) => {
      if (response.data.model) {
        this.twoStepLists.modelList = [];
        for (let i = 0; i < response.data.model.length; i++) {
          this.twoStepLists.modelList.push({
            id: i,
            value: response.data.model[i].xmodelo,
          });
        }
        this.twoStepLists.modelList.sort((a, b) => a.value > b.value ? 1 : -1);

        this.filteredModel = this.twoStepControls.modelControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterModel(value || ''))
        );

        const modelSelected = this.twoStepLists.modelList.find(model => model.value === this.vehicleFormGroup.get('xmodelo')?.value);
        if (!modelSelected) {
          this.twoStepControls.modelControl.setValue('')
          this.vehicleFormGroup.get('xmodelo')?.setValue('')
        }

        this.getVersion()
      }
    });
  }

  private _filterModel(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.twoStepLists.modelList
      .map(model => model.value)
      .filter(model => model.toLowerCase().includes(filterValue));
  }

  onModelSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedModel = this.twoStepLists.modelList.find(model => model.value === selectedValue);
    if (selectedModel) {
      this.vehicleFormGroup.get('xmodelo')?.setValue(selectedModel.value);
      this.getVersion();
    }else if(this.ccotizacion){
      this.vehicleFormGroup.get('xmodelo')?.setValue(selectedValue);
      this.getVersion();
    }
  }

  getVersion(){
    let data = {
      qano: this.vehicleFormGroup.get('fano')?.value,
      xmarca: this.vehicleFormGroup.get('xmarca')?.value,
      xmodelo: this.vehicleFormGroup.get('xmodelo')?.value,
    };
    this.http.post(environment.apiUrl + '/api/v1/valrep/version', data).subscribe((response: any) => {
      if (response.data.version) {
        this.twoStepLists.versionList = [];
        for (let i = 0; i < response.data.version.length; i++) {
          this.twoStepLists.versionList.push({
            id: i,
            value: response.data.version[i].xversion,
            npasajero: response.data.version[i].npasajero,
            cclasificacion: response.data.version[i].xclasificacion,
            id_inma: response.data.version[i].id,
            msum: response.data.version[i].msum,
            xtipovehiculo: response.data.version[i].xclase_rcv,
            xuso: response.data.version[i].xuso,
            npesovacio: response.data.version[i].npesovacio,
            ncapcarga: response.data.version[i].ncapcarga,
          });
        }
        this.twoStepLists.versionList.sort((a, b) => a.value > b.value ? 1 : -1);

        if(this.ccotizacion){
          const selectedValue = this.vehicleFormGroup.get('xversion')?.value;
          const selectedVersion = this.twoStepLists.versionList.find(version => version.value === selectedValue);
          if (selectedVersion) {
            this.vehicleFormGroup.get('xversion')?.setValue(selectedVersion.value);
            this.vehicleFormGroup.get('npasajeros')?.setValue(selectedVersion.npasajero);
            this.vehicleFormGroup.get('cclasificacion')?.setValue(selectedVersion.cclasificacion);
            this.vehicleFormGroup.get('id_inma')?.setValue(selectedVersion.id_inma);
            this.vehicleFormGroup.get('xtipovehiculo')?.setValue(selectedVersion.xtipovehiculo);
            this.vehicleFormGroup.get('xuso')?.setValue(selectedVersion.xuso);
      
            if(!this.vehicleFormGroup.get('xtipovehiculo')?.value){
              this.activateTypeVehicle = true;
            }else{
              this.activateTypeVehicle = false;
            }
      
            if(this.vehicleFormGroup.get('xtipovehiculo')?.value == 'CARGA' || this.vehicleFormGroup.get('xtipovehiculo')?.value == 'Carga'){
              this.activateAttachment = true;
            }else{
              this.activateAttachment = false;
            }
      
            if(!this.vehicleFormGroup.get('xuso')?.value){
              this.activateUtility = true;
            }else{
              this.activateUtility = false;
            }
          } else {
            this.twoStepControls.versionControl.setValue('')
            this.vehicleFormGroup.get('xversion')?.setValue('');
            this.vehicleFormGroup.get('npasajeros')?.setValue('');
            this.vehicleFormGroup.get('cclasificacion')?.setValue('');
            this.vehicleFormGroup.get('id_inma')?.setValue('');
            this.vehicleFormGroup.get('xtipovehiculo')?.setValue('');
            this.vehicleFormGroup.get('xuso')?.setValue('');
            this.activateUtility = false;
            this.activateAttachment = false;
            this.activateTypeVehicle = false;
          }
        } else {
          const selectedVersion = this.twoStepLists.versionList.find(version => version.value === this.vehicleFormGroup.get('xversion')?.value);
          if(!selectedVersion) {
            this.twoStepControls.versionControl.setValue('')
            this.vehicleFormGroup.get('xversion')?.setValue('');
            this.vehicleFormGroup.get('npasajeros')?.setValue('');
            this.vehicleFormGroup.get('cclasificacion')?.setValue('');
            this.vehicleFormGroup.get('id_inma')?.setValue('');
            this.vehicleFormGroup.get('xtipovehiculo')?.setValue('');
            this.vehicleFormGroup.get('xuso')?.setValue('');
            this.activateUtility = false;
            this.activateAttachment = false;
            this.activateTypeVehicle = false;
          }
        }

        this.filteredVersion = this.twoStepControls.versionControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterVersion(value || ''))
        );
      }
    });
  }

  private _filterVersion(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.twoStepLists.versionList
      .map(version => version.value)
      .filter(version => version.toLowerCase().includes(filterValue));
  }

  onVersionSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedVersion = this.twoStepLists.versionList.find(version => version.value === selectedValue);
    if (selectedVersion) {
      this.vehicleFormGroup.get('xversion')?.setValue(selectedVersion.value);
      this.vehicleFormGroup.get('npasajeros')?.setValue(selectedVersion.npasajero);
      this.vehicleFormGroup.get('id_inma')?.setValue(selectedVersion.id_inma);
      this.vehicleFormGroup.get('xtipovehiculo')?.setValue(selectedVersion.xtipovehiculo);
      this.vehicleFormGroup.get('xuso')?.setValue(selectedVersion.xuso);


      if(!this.vehicleFormGroup.get('xtipovehiculo')?.value){
        this.activateTypeVehicle = true;
      }else{
        this.activateTypeVehicle = false;
      }

      if(!this.vehicleFormGroup.get('xuso')?.value){
        this.activateUtility = true;
      }else{
        this.activateUtility = false;
      }
    }
  }

  getColor(){
    let data = {
      cpais: this.currentUser.data.cpais
    }
    this.http.post(environment.apiUrl + '/api/v1/valrep/color', data).subscribe((response: any) => {
      if (response.data.color) {
        for (let i = 0; i < response.data.color.length; i++) {
          this.twoStepLists.colorList.push({
            id: response.data.color[i].ccolor,
            value: response.data.color[i].xcolor,
          });
        }
        this.filteredColor = this.twoStepControls.colorControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterColor(value || ''))
        );
      }
    });
  }

  private _filterColor(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.twoStepLists.colorList
      .map(color => color.value)
      .filter(color => color.toLowerCase().includes(filterValue));
  }

  onColorSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedColor = this.twoStepLists.colorList.find(color => color.value === selectedValue);
    if (selectedColor) {
      this.vehicleFormGroup.get('ccolor')?.setValue(selectedColor.id);
    }
  }

  getRates(){
    let data = {
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(environment.apiUrl + '/api/v1/valrep/rates', data).subscribe((response: any) => {
      if (response.data.rates) {
        for (let i = 0; i < response.data.rates.length; i++) {
          this.twoStepLists.ratesList.push({
            id: response.data.rates[i].ctarifa_exceso,
            value: response.data.rates[i].xgrupo,
          });
        }
        this.filteredRates = this.twoStepControls.ratesControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterRates(value || ''))
        );
      }
    });
  }

  private _filterRates(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.twoStepLists.ratesList
      .map(rates => rates.value)
      .filter(rates => rates.toLowerCase().includes(filterValue));
  }

  onRatesSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedRates = this.twoStepLists.ratesList.find(rates => rates.value === selectedValue);
    if (selectedRates) {
      // this.vehicleFormGroup.get('ctarifa_exceso')?.setValue(selectedRates.id);
    }
  }

  calcularFechaHasta(event: any) {
    const fechaDesde = new Date(event.value);
    const fechaHasta = new Date(fechaDesde.getFullYear() + 1, fechaDesde.getMonth(), fechaDesde.getDate() + 1);
    const fechaHastaISO = fechaHasta.toISOString().split('T')[0]; // Obtener la fecha en formato 'YYYY-MM-DD'
    this.planFormGroup.get('fhasta')?.setValue(fechaHastaISO);
    console.log(this.planFormGroup.get('fhasta').value)
  }

  getTypeVehicles(){
    let data = {
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(environment.apiUrl + '/api/v1/valrep/type-vehicle', data).subscribe((response: any) => {
      if (response.data.type) {
        for (let i = 0; i < response.data.type.length; i++) {
          this.twoStepLists.typeVehicleList.push({
            id: response.data.type[i].cclase,
            value: response.data.type[i].xclase,
          });
        }
        this.filteredTypeVehicle = this.twoStepControls.typeVehicleControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterTypeVehicle(value || ''))
        );
      }
    });
  }

  private _filterTypeVehicle(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.twoStepLists.typeVehicleList
      .map(type => type.value)
      .filter(type => type.toLowerCase().includes(filterValue));
  }

  onTypeVehicleSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedTypeVehicle = this.twoStepLists.typeVehicleList.find(typeVehicle => typeVehicle.value === selectedValue);
    if (selectedTypeVehicle) {
      this.vehicleFormGroup.get('xtipovehiculo')?.setValue(selectedTypeVehicle.value);
    }
  }

  getUtilityVehicle(){
    let data = {
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(environment.apiUrl + '/api/v1/valrep/utility-rechange', data).subscribe((response: any) => {
      if (response.data.utilityR) {
        for (let i = 0; i < response.data.utilityR.length; i++) {
          this.twoStepLists.utilityVehicleList.push({
            id: response.data.utilityR[i].cuso,
            value: response.data.utilityR[i].xuso,
            precargo: response.data.utilityR[i].precargo,
          });
        }
        this.filteredUtilityVehicle = this.twoStepControls.utilityVehicleControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterUtilityVehicle(value || ''))
        );
      }
    });
  }

  private _filterUtilityVehicle(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.twoStepLists.utilityVehicleList
      .map(utility => utility.value)
      .filter(utility => utility.toLowerCase().includes(filterValue));
  }

  onUtilityVehicleSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedUtilityVehicle = this.twoStepLists.utilityVehicleList.find(utility => utility.value === selectedValue);
    if (selectedUtilityVehicle) {
      this.vehicleFormGroup.get('cuso')?.setValue(selectedUtilityVehicle.id);
      this.vehicleFormGroup.get('precargo')?.setValue(selectedUtilityVehicle.precargo);
    }
  }

  getUtility(){
    let data = {
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(environment.apiUrl + '/api/v1/valrep/utility', data).subscribe((response: any) => {
      if (response.data.utility) {
        for (let i = 0; i < response.data.utility.length; i++) {
          this.twoStepLists.utilityList.push({
            value: response.data.utility[i].xclase,
          });
        }
        this.filteredUtility = this.twoStepControls.utilityControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterUtility(value || ''))
        );
      }
    });
  }

  private _filterUtility(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.twoStepLists.utilityList
      .map(utility => utility.value)
      .filter(utility => utility.toLowerCase().includes(filterValue));
  }

  onUtilitySelection(event: any) {
    const selectedValue = event.option.value;
    const selectedUtility = this.twoStepLists.utilityList.find(utility => utility.value === selectedValue);
    this.vehicleFormGroup.get('xuso')?.setValue(selectedUtility.value);
  }

  getClass(){
    let data = {
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(environment.apiUrl + '/api/v1/valrep/class', data).subscribe((response: any) => {
      if (response.data.class) {
        for (let i = 0; i < response.data.class.length; i++) {
          this.threeStepLists.classList.push({
            id: response.data.class[i].cclase,
            value: response.data.class[i].xclase,
          });
        }
        this.filteredClass = this.threeStepControls.classControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterClass(value || ''))
        );
      }
    });
  }

  private _filterClass(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.threeStepLists.classList
      .map(classL => classL.value)
      .filter(classL => classL.toLowerCase().includes(filterValue));
  }

  onClassSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedClass = this.threeStepLists.classList.find(classL => classL.value === selectedValue);
    if (selectedClass) {
      this.vehicleFormGroup.get('cclase')?.setValue(selectedClass.id);
    }
  }

  getCompania(){
    this.http.get(environment.apiUrl + '/api/v1/maestros/companias').subscribe((response: any) => {
      if (response.data) {
        for (let i = 0; i < response.data.length; i++) {
          this.threeStepLists.companiaList.push({
            id: response.data[i].value,
            value: response.data[i].text
          });
        }
        this.filteredCompania = this.threeStepControls.companiaControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            return this._filterCompania(value || '')
          })
        );
      }
    });
  }

  private _filterCompania(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.threeStepLists. companiaList
      .map(compania => compania.value)
      .filter(compania => compania.toLowerCase().includes(filterValue));
  }

  onCompaniaSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedCompania = this.threeStepLists. companiaList.find(compania => compania.value === selectedValue);
    if (selectedCompania) {
      this.planFormGroup.get('ccompania')?.setValue(selectedCompania.id);
      this.xcompania = selectedCompania.value;
    }
    this.getPlan()
  }
  getPlan(){
    let data = {
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(environment.apiUrl + '/api/v1/valrep/plan', data).subscribe((response: any) => {
      console.log(response.data.plan)
      if (response.data.plan) {
        this.threeStepLists.planList = []
        for (let i = 0; i < response.data.plan.length; i++) {
          this.threeStepLists.planList.push({
            id: response.data.plan[i].id,
            value: response.data.plan[i].xplan,
            mmonto: response.data.plan[i].mcosto,
          });
        }

        const selectedPlan = this.threeStepLists.planList.find(version => version.value === this.planFormGroup.get('xplan')?.value);
          if(!selectedPlan) {
            this.threeStepControls.planControl.setValue('')
            this.planFormGroup.get('cplan')?.setValue('');
            this.planFormGroup.get('xplan')?.setValue('');
          }

        this.filteredPlan = this.threeStepControls.planControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterPlan(value || ''))
        );
      } else {
        console.log('Fail')
      }
    }, error => console.log('oops', error));
  }

  private _filterPlan(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.threeStepLists.planList
      .map(plan => plan.value)
      .filter(plan => plan.toLowerCase().includes(filterValue));
  }

  onPlanSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedPlan = this.threeStepLists.planList.find(plan => plan.value === selectedValue);
    if (selectedPlan) {
      this.planFormGroup.get('cplan')?.setValue(selectedPlan.id);
      this.montoTotal = selectedPlan.mmonto
      console.log(this.planFormGroup.get('cplan')?.value);
      
      let plan = {
        cplan: selectedPlan.id
      }
      console.log(plan);
      
      this.http.post(environment.apiUrl + '/api/v1/contracts/type-service', plan).subscribe((response: any) => {
        this.activateCardService = true
        this.serviceList = response.data.type.map((item: any) => {
          return {
            name: item.xtiposervicio 
          };
        });
      })
      this.xnombrePlan = selectedPlan.value;
    }
  }

  validationBank(){
    if(this.planFormGroup.get('xmoneda')?.value == 'Bs'){
      this.itipo = 'V';
      this.amountDollar = false;
      this.amountBs = true;

      let cambio = this.montoTotal * this.bcv;
      this.montoBs = cambio.toFixed(2) 

      this.getBank();
      this.getTypeOfPay()
    }else{
      this.itipo = 'E';
      this.amountDollar = true;
      this.amountBs = false;

      let igtf = this.montoTotal * 0.03
      let total = this.montoTotal + igtf;

      this.montoDollar = total.toFixed(2)

      this.getBank();
      this.getTypeOfPay()
    }
  }

  getTypeOfPay(){
    let data = {
      itipo: this.itipo,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(environment.apiUrl + '/api/v1/valrep/type-of-payment', data).subscribe((response: any) => {
      if (response.data.typePayment) {
        this.typeOfPayList = [];
        for (let i = 0; i < response.data.typePayment.length; i++) {
          this.typeOfPayList.push({
            id: response.data.typePayment[i].ctipopago,
            value: response.data.typePayment[i].xtipopago,
          });
        }
      }
    });
  }

  getBank(){
    let data = {
      itipo: this.itipo,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(environment.apiUrl + '/api/v1/valrep/bank', data).subscribe((response: any) => {
      if (response.data.bank) {
        this.bankList = [];
        for (let i = 0; i < response.data.bank.length; i++) {
          this.bankList.push({
            id: response.data.bank[i].cbanco,
            value: response.data.bank[i].xbanco,
          });
        }
      }
    });
  }

  getTargetBank(){
    if(this.planFormGroup.get('ctipopago')?.value == '5' || this.planFormGroup.get('ctipopago')?.value == '6'){
      this.planFormGroup.get('cbanco_destino')?.disable();
      this.planFormGroup.get('cbanco')?.disable();
    }else{
      this.planFormGroup.get('cbanco_destino')?.enable();
      this.planFormGroup.get('cbanco')?.enable();
      let data = {
        ctipopago: this.planFormGroup.get('ctipopago')?.value
      }
      this.http.post(environment.apiUrl + '/api/v1/valrep/target-bank', data).subscribe((response: any) => {
        if (response.data.targetBank) {
          for (let i = 0; i < response.data.targetBank.length; i++) {
            this.targetBankList.push({
              id: response.data.targetBank[i].cbanco_destino,
              value: response.data.targetBank[i].xbanco,
            });
          }
        }
      });
    }
  }

  getMethodOfPayment(){
    let data = {
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(environment.apiUrl + '/api/v1/valrep/method-of-payment', data).subscribe((response: any) => {
      if (response.data.payment) {
        for (let i = 0; i < response.data.payment.length; i++) {
          this.threeStepLists.methodOfPaymentList.push({
            id: response.data.payment[i].cmetodologiapago,
            value: response.data.payment[i].xmetodologiapago,
          });
        }
        this.filteredMethodOfPayment = this.threeStepControls.methodOfPaymentControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterMethodOfPayment(value || ''))
        );
      }
    });
  }

  private _filterMethodOfPayment(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.threeStepLists.methodOfPaymentList
      .map(payment => payment.value)
      .filter(payment => payment.toLowerCase().includes(filterValue));
  }

  onMethodOfPaymentSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedMet = this.threeStepLists.methodOfPaymentList.find(met => met.value === selectedValue);
    if (selectedMet) {
      this.planFormGroup.get('cmetodologiapago')?.setValue(selectedMet.id);
    }
  }

  getFormControl(name: string) {
    return this.planFormGroup.get(name);
  }

  validateAmount(){
    if(this.planFormGroup.get('xmoneda')?.value == 'Bs'){
      const bs = this.montoBs;
      const montoControl = this.planFormGroup.get('mpagado');

      if (montoControl) {
        const monto = montoControl.value;
  
        if (monto !== null && monto !== undefined) {
          if (monto < bs) {
            window.alert('El monto que colocó es menor al monto a pagar.');
            montoControl.setValue('');
          }
        }
      }
    }else{
      const ds = this.montoDollar;
      const montoControl = this.planFormGroup.get('mpagado');

      if (montoControl) {
        const monto = montoControl.value;
  
        if (monto !== null && monto !== undefined) {
          if (monto < ds) {
            window.alert('El monto que colocó es menor al monto a pagar.');
            montoControl.setValue('');
          }
        }
      }
    }
  }

  onSubmit(){
    this.submit = false;
    this.loading = true
    let data = {
      icedula: this.personsFormGroup.get('icedula')?.value,
      xcedula: this.personsFormGroup.get('xrif_cliente')?.value,
      xnombre: this.personsFormGroup.get('xnombre')?.value?.toUpperCase(),
      xapellido: this.personsFormGroup.get('xapellido')?.value?.toUpperCase(),
      xtelefono_emp: this.personsFormGroup.get('xtelefono_emp')?.value,
      email: this.personsFormGroup.get('email')?.value?.toUpperCase(),
      cestado: this.personsFormGroup.get('cestado')?.value,
      cciudad: this.personsFormGroup.get('cciudad')?.value,
      xdireccion: this.personsFormGroup.get('xdireccion')?.value?.toUpperCase(),
      xplaca: this.vehicleFormGroup.get('xplaca')?.value?.toUpperCase(),
      id_inma: this.vehicleFormGroup.get('id_inma')?.value,
      fano: this.vehicleFormGroup.get('fano')?.value,
      ccolor: this.vehicleFormGroup.get('ccolor')?.value,
      xserialcarroceria: this.vehicleFormGroup.get('xserialcarroceria')?.value?.toUpperCase(),
      xserialmotor: this.vehicleFormGroup.get('xserialmotor')?.value?.toUpperCase(),
      fdesde: this.planFormGroup.get('fdesde')?.value,
      fhasta: this.planFormGroup.get('fhasta')?.value,
      cplan: this.planFormGroup.get('cplan')?.value,
      cmetodologiapago: this.planFormGroup.get('cmetodologiapago')?.value,
      cuso: this.vehicleFormGroup.get('cuso')?.value,
      icontrato: 'I',
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais,
      cusuario: this.currentUser.data.cusuario
    }

    this.http.post(environment.apiUrl + '/api/v1/contracts/create', data).subscribe((response: any) => {
      if(response.status){
        this.check = true;
        this.loading = false;
        this.message = response.message;
        this.ccontratoflota = response.data.ccontratoflota;
        let dataN = {
          ccontratoflota: this.ccontratoflota,
          cpais: this.currentUser.data.cpais,
          ccompania: this.currentUser.data.ccompania
        }
        const observable = from(this.pdfGenerationService.LoadDataCertifiqued(dataN));

        observable.subscribe(
          (data) => {
            this.check = true;
            this.loadingPdf = false
          },
          (error) => {
          }
        );
      }
    },(error) => { 
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

}
