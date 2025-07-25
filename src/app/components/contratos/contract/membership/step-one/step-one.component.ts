import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from './../../../../../../environments/environment';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {

  @Input() pruebaValue?: any
  @Input() personsFormGroup?: any
  @Output() changePersonFormGroupValue: any = new EventEmitter();
  @Output() clearValidatorsPersonFormGroup: any = new EventEmitter();
  @Output() setValidatorsPersonFormGroup: any = new EventEmitter();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ){}

  activaSexoYEs: boolean = true;
  activaRepresentante: boolean = false;
  activaNombreYapellido: boolean = true;
  
  campoNombresV: { [key: string]: string } = {
    xplaca: 'Placa',
    xmarca: 'Marca',
    xmodelo: 'Modelo',
    xversion: 'Version',
    fano: 'Año',
    ccolor: 'Color',
    xserialcarroceria: 'Serial de Carroceria'
  };

  oneStepControls: any = {
    identControl: new FormControl(''),
    stateControl: new FormControl(''),
    cityControl: new FormControl('')
  }

  oneStepLists: any = {
    dataList: [],
    identList: ['V', 'P', 'E', 'J', 'C','G'],    
    stateList: [],
    cityList: [],
    stateTakerList: [],
    cityTakerList: [],
  }

  filteredIdent!: Observable<string[]>;
  filteredState!: Observable<string[]>;
  filteredCity!: Observable<string[]>;
  fechas!: any ;

  ngOnInit(): void {
    this.pruebaValue = 'esto ya no es una prueba'
    console.log(this.personsFormGroup);
    this.changePersonFormGroupValue.emit({key:'xnombre', value:'hola'});
  }

  checkPressEnter(event: any) {
    if(event.key == 'Enter') {
      event.preventDefault()
    }
  }

  onIdentSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedIdent = this.oneStepLists.identList.find(ident => ident === selectedValue);
    if (selectedIdent) {
      this.personsFormGroup.get('icedula')?.setValue(selectedIdent)
    }

    // Si selectedIdent es distinto de 'V', eliminar la validación de 'fnacimiento'
    if (selectedIdent !== 'V') {
      this.clearValidatorsPersonFormGroup.emit({key: 'fnacimiento'})
      this.clearValidatorsPersonFormGroup.emit({key: 'iestado_civil'})
      this.clearValidatorsPersonFormGroup.emit({key: 'isexo'})
      this.clearValidatorsPersonFormGroup.emit({key: 'xapellido'})
      this.fechas = 'Fecha de Registro';
    } else { // Si selectedIdent es 'V', establecer la validación de 'fnacimiento'
      this.setValidatorsPersonFormGroup.emit({key: 'fnacimiento'})
      this.setValidatorsPersonFormGroup.emit({key: 'iestado_civil'})
      this.setValidatorsPersonFormGroup.emit({key: 'isexo'})
      this.setValidatorsPersonFormGroup.emit({key: 'xapellido'})
      // this.personsFormGroup.get('fnacimiento')?.setValidators([Validators.required]);
      // this.personsFormGroup.get('iestado_civil')?.setValidators([Validators.required]);
      // this.personsFormGroup.get('isexo')?.setValidators([Validators.required]);
      // this.personsFormGroup.get('xapellido')?.setValidators([Validators.required]);
      this.fechas = 'Fecha de Nacimiento';
    }

    // Actualizar los controles después de cambiar las validaciones
    this.personsFormGroup.get('fnacimiento')?.updateValueAndValidity();
    this.personsFormGroup.get('iestado_civil')?.updateValueAndValidity();
    this.personsFormGroup.get('isexo')?.updateValueAndValidity();
    this.personsFormGroup.get('xapellido')?.updateValueAndValidity();
  }
  checkPress(event: any) {
    if(event.key == 'Enter' || event.key == 'Tab') {
      console.log('searching...')
      this.searchPropietary()
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
            // this.getState()
            this.personsFormGroup.get('cciudad')?.setValue(response.data.cciudad)
            // this.getCity();
            this.personsFormGroup.get('xdireccion')?.setValue(response.data.xdireccion)
          }
        }
      }
    });
  }

}
