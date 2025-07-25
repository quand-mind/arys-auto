import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-tracking-form',
  templateUrl: './tracking-form.component.html',
  styleUrls: ['./tracking-form.component.scss'],
})
export class TrackingFormComponent implements OnInit {

  @ViewChild('allStepper') allStepper!: MatStepper;
  
  steps:any[] = [
    {
      name: 'Usuario', id: 'usuarioStep', edit: false, values: [
        { 
          name: 'Vehiculo', id: 'contractStep', data: [
            {key: 'xmarca', text: 'Marca', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xmodelo', text: 'Modelo', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xplaca', text: 'Placa', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xcolor', text: 'Color', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'fano', text: 'Año', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xserialcarroceria', text: 'Serial de la carrocería', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xserialmotor', text: 'Serial del motor', controlValue: '', class: 'col-md-4', type: 'text'},
          ],
        },
        { 
          name: 'Información del Contrato', id: 'contractStep', data: [
            {key: 'xcliente', text: 'Cliente', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'fdesde_pol', text: 'Incio del Contrato', controlValue: '', class: 'col-md-4', type: 'date'},
            {key: 'fhasta_pol', text: 'Fin del Contrato', controlValue: '', class: 'col-md-4', type: 'date'},
            {key: 'xestatusgeneral', text: 'Estatus General', controlValue: '', class: 'col-md-4', type: 'text'},
          ],
        },
        { 
          name: 'Información del Propietario', id: 'ownerStep', data: [
            {key: 'xnombrepropietario', text: 'Nombre', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xapellidopropietario', text: 'Apellido', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xdocidentidadpropietario', text: 'Documento de Identificacion', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xdireccionpropietario', text: 'Dirección', controlValue: '', class: 'col-md-4', type: 'textarea'},
            {key: 'xtelefonocelularpropietario', text: 'Teléfono', controlValue: '', class: 'col-md-4', type: 'tel'},
            {key: 'xemailpropietario', text: 'Email', controlValue: '', class: 'col-md-4', type: 'email'},
          ],
        },
        
      ],
      data: []
    },
    {
      name: 'Evento', id: 'eventStep', edit: false, values: [
        { 
          name: 'Notificación', id: 'notificationStep', data: [
            {key: 'cnotificacion', text: 'Código', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xtiponotificacion', text: 'Tipo de Notificación', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xrecaudo', text: 'Tipo de Recaudos', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xcausasiniestro', text: 'Causa del Evento', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xnombre', text: 'Nombre', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xapellido', text: 'Apellido', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xtelefono', text: 'Teléfono', controlValue: '', class: 'col-md-4', type: 'tel'},
            {key: 'xnombrealternativo', text: 'Nombre Alternativo', controlValue: '', class: 'col-md-4', type: 'tel'},
            {key: 'xapellidoalternativo', text: 'Apellido Alternativo', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xtelefonoalternativo', text: 'Teléfono Alternativo', controlValue: '', class: 'col-md-4', type: 'tel'},
            {key: 'bdano', text: '¿El vehículo sufrió daños?', controlValue: false, class: 'col-md-4', type: 'slide'},
            {key: 'btransitar', text: '¿El vehículo puede transitar?', controlValue: false, class: ' col-md-4', type: 'slide'},
            {key: 'bdanootro', text: '¿Su vehículo le ocasionó daño a otro vehículo u objeto?', controlValue: false, class: 'col-md-4', type: 'slide'},
            {key: 'blesionado', text: '¿Hubo algún lesionado?', controlValue: false, class: 'col-md-4', type: 'slide'},
            {key: 'bpropietario', text: '¿El propietario del vehículo estaba manejando?', controlValue: false, class: 'col-md-4', type: 'slide'},
          ],
        },
        { 
          name: 'Información del Evento', id: 'notificationStep', data: [
            {key: 'fdiaevento', text: 'Dia del Evento', controlValue: '', class: 'col-md-4', type: 'date'},
            {key: 'fhoraevento', text: 'Hora del Evento', controlValue: '', class: 'col-md-4', type: 'time'},
            {key: 'xestado', text: 'Estado', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xciudad', text: 'Ciudad', controlValue: '', class: 'col-md-4', type: 'text'},
            {key: 'xdireccion', text: 'Dirección', controlValue: '', class: 'col-md-4', type: 'textarea'},
            {key: 'xdescripcion', text: 'Descripción', controlValue: '', class: 'col-md-4', type: 'textarea'},
            {key: 'btransito', text: '¿Transito estuvo involucrado?', controlValue: false, class: 'col-md-4', type: 'slide'},
            {key: 'bcarga', text: '¿El vehículo tenía cargamento?', controlValue: false, class: 'col-md-4', type: 'slide'},
            {key: 'bpasajero', text: '¿El vehículo tenía pasajeros?', controlValue: false, class: 'col-md-4', type: 'slide'},
          ],
        },
      ],
      data: []
    },
  ]

  title: any = ''
  mode: any = ''
  mainUrl: any = ''
  itemId: any = ''
  editUrl: any = ''
  formId: any = ''
  disableUrl: any = ''

  sub = new Subscription()


  // firstFormGroup = this._formBuilder.group({
  //   firstCtrl: ['qqqq', Validators.required],
  // });
  // secondFormGroup = this._formBuilder.group({
  //   secondCtrl: ['', Validators.required],
  // });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe( v => {
      console.log(v[2].path);
      this.itemId = v[2].path
      console.log(this.steps);

    })
    this.route.data.subscribe( v => {
      this.title = v.title + ' ' + this.itemId
      this.mode = v.mode
      this.mainUrl = v.mainUrl
      this.editUrl = v.editUrl
      this.formId = v.formId
      this.disableUrl = v.disableUrl
      
    })
  }

}
