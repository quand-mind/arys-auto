import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItemFormService } from './../../components/item-form/item-form.service';
import { AuthService } from './../../auth/auth.service';
import { HttpClient } from "@angular/common/http";
import {MatSnackBar} from '@angular/material/snack-bar';
import { environment } from './.././../../environments/environment';
import * as bootstrap from "bootstrap";
import * as $ from 'jquery';
// import {fs}  from 'fs';

export type CropperDialogData = {
  image: File,
  width: number,
  height: number
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  paisesValues: any[] = []
  estadosValues: any[] = []
  ciudadesValues: any[] = []
  environmentV = environment
  xcompania: string = ''
  imageFile: any
  aspectRatio: any
  imageFileCropped: any
  imageName: any
  dbName: any
  imageType: any
  imageUrl: any
  imageContent: any
  urlNew: any
  changePassword: any = ''
  passwordVisible:any = false
  changePasswordVisible:any = false

  imageData: any = {}

  disabledPassword:any = true

  selectedPais:any = ''
  selectedEstado:any = ''
  selectedCiudad:any = ''

  infoCar: any = null

  userData: any = {}

  sub = new Subscription()
  constructor(private route: ActivatedRoute, public ItemFormService: ItemFormService, public AuthService: AuthService, private http: HttpClient, private _snackBar: MatSnackBar) {}

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {duration: 2000});
  }
  openSnackBarLoading() {
    this._snackBar.open('Cargando datos...', '');
  }
  closeSnackBar() {
    this._snackBar.dismiss();
  }

  async ngOnInit() {
    this.sub = this.route
      .data
      .subscribe(v => {
      });
    const userId = this.AuthService.getUsuario()
    let gettedUserData: any = {}
    this.ItemFormService.getItemInfo('/api/v1/user/club/getUser/' + userId).subscribe(async (data) => {
      this.userData = await data.data
      this.userData.cpais = this.userData.cpais.toString()
      this.userData.cestado = this.userData.cestado.toString()
      this.userData.cciudad = this.userData.cciudad.toString()

      this.ItemFormService.getItemInfo('/api/v1/maestros/compania/' + this.userData.ccompania).subscribe(async (data) => {
        if(data.data[0].text) {
          this.xcompania = data.data[0].text
        } else {
          this.xcompania = 'No existe compañía'
        }
      })
      this.getPaises()
      this.getEstados(this.userData.cpais)
      this.getCiudades(this.userData.cpais, this.userData.cestado)
    })
  }
  ngAfterViewInit(){
  }
  saveInfo() {
    this.http.post(environment.apiUrl + '/api/v1/user/edit/'+ this.userData.cusuario, this.userData).subscribe(response=>{
      console.log(response);
      this.openSnackBar(response['message'])
      setTimeout(()=>{
        window.location.reload()
      },1500)
    })
  }
  getPaises() {
    this.ItemFormService.getItemInfo('/api/v1/maestros/paises').subscribe(async (data) => {
      this.paisesValues = data.data 
    })
  }
  getEstados(cpais) {
    this.ItemFormService.getItemInfo('/api/v1/maestros/estados/'+ cpais).subscribe(async (data) => {
      this.estadosValues = data.data
    })
  }
  getCiudades(cpais, cestado) {
    this.ItemFormService.getItemInfo('/api/v1/maestros/ciudades/'+ cestado).subscribe(async (data) => {
      this.ciudadesValues = data.data 
    })
  }
  checkPassword(){
    if(this.userData.xcontrasena == this.changePassword) {
      const closeModalButtonClose = <HTMLButtonElement> document.getElementById('closeModalButtonClose')
      this.disabledPassword = false
      closeModalButtonClose.click()
    } else {
      this.openSnackBar('Las contraseñas no coinciden')
    }
  }

  uploadedFile(event:any) {
    const file = event.file
    const dbName = event.dbName
    const name = event.name
    const ext = event.ext
    const form = new FormData()

    form.append( "file", file, `${name+ext}`)  
    form.append( "url", `user_${this.userData.cusuario}`)
    form.append( "fileName", `${name+ext}`)
    form.append( "dbName", `${dbName}`)
    for (const pair of form.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = this.http.post(environment.apiUrl + '/api/upload/document/' + this.userData.cusuario + '/user', form)
    response.subscribe( data => {

      // this.userData[this.dbName] = data['uploadedFile']
      this.openSnackBar('Documento Guardado')
      setTimeout(()=>{
        window.location.reload()
      },1500)
      
    });
  }
  uploadedFiles(event:any) {
    const files = event.files
    let filesArray:any = []
    const dbName = event.dbName
    console.log(files);
    const form = new FormData()
    let x = 1
    for (const file of files) {
      form.append( "files", file, file.name)
      filesArray.push(`${file.name}`)
    }
    form.append( "filesArray", JSON.stringify(filesArray))
    form.append( "dbName", dbName)
    form.append( "url", `user_${this.userData.cusuario}`)
    for (const pair of form.entries()) {
      console.log(pair[0], pair[1]);
    }
    const response = this.http.post(environment.apiUrl + '/api/upload/documents/' + this.userData.cusuario + '/user', form)
    response.subscribe( data => {

      // this.userData[this.dbName] = data['uploadedFile']
      console.log(data);
      this.openSnackBar('Documentos Guardados')
      setTimeout(()=>{
        window.location.reload()
      },1500)
      
    });
  }

  async onFileSelected(event:any, fileName:any, dbName: any, aspectRatio) {
    
    const _file = URL.createObjectURL(event.target.files[0]);
    this.imageFile = event.target.files[0]
    const file:File = event.target.files[0]
    this.imageName = ''
    this.aspectRatio = 0
    this.aspectRatio = aspectRatio
    this.imageName = fileName
    this.dbName = ''
    this.dbName = dbName
    this.imageType = file.type
    this.imageContent = await file.text()
    console.log(file);
    
    var extn = this.imageName.split(".").pop();

    let valid = [
      "tif", "tiff", "jpg", "jpeg", "gif", "png"
    ];

    const cropButton = <HTMLButtonElement> document.getElementById('cropButtonModalHidden')
    cropButton.click()

  }

  imageCropped(event:any){
    this.imageFileCropped = event.base64;
  }
  cropImage() {
    fetch(this.imageFileCropped)
    .then(res => res.blob())
    .then( blob => {
      const file = new File([blob], this.imageName,{ type: "image/png" })

      const form = new FormData()
      form.append( "image", file, `${this.imageName}.jpg`)  
      form.append( "url", `user_${this.userData.cusuario}`)
      form.append( "fileName", `${this.imageName}.jpg`)
      form.append( "dbName", this.dbName)

      const response = this.http.post(environment.apiUrl + '/api/upload/image/' + this.userData.cusuario + '/user', form)
      response.subscribe( data => {

        this.userData[this.dbName] = data['uploadedFile']
        console.log(this.userData);
        this.openSnackBar('Foto Guardada')
        setTimeout(()=>{
          window.location.reload()
        },1500)
        
      });
    })
  }

}
