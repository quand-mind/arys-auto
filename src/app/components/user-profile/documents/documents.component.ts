import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject, throwError } from 'rxjs';
import { environment } from './../../../../../src/environments/environment';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  @Input() userData:any 
  @Output() uploadedFile = new EventEmitter<any>();
  @Output() uploadedFiles = new EventEmitter<any>();
  
  status: any; // Variable to store file status
  cedulaFile:any = null 
  licenciaFile:any = null
  otherFiles: any[] = []; // Variable to store file
  environment = environment
  
  @ViewChild('viewer') viewer!: ElementRef;
  

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.cedulaFile = this.userData.documents.find(document => document.xtipodocumento == 'docidentidad')
    this.http.post(this.environment.apiUrl + this.cedulaFile.xrutadocumento, {}).subscribe( data => {
      this.cedulaFile.name = data['name']
    })
    this.licenciaFile = this.userData.documents.find(document => document.xtipodocumento == 'doclicencia')
    this.http.post(this.environment.apiUrl + this.licenciaFile.xrutadocumento, {}).subscribe( data => {
      this.licenciaFile.name = data['name']
    })

    this.otherFiles = this.userData.documents.filter(document => document.xtipodocumento == 'otrodocumento')
    for (const file of this.otherFiles) {
      this.http.post(this.environment.apiUrl + file.xrutadocumento, {}).subscribe( data => {
        file.name = data['name']
      })
    }
    console.log(this.environment.apiUrl + this.cedulaFile.xrutadocumento);
    
  }
  ngAfterViewInit(){
  }
  openFile(file){
    window.open(environment.apiUrl + file.xrutadocumento)
  }

  addFile(id:any) {
    const input = <HTMLInputElement> document.getElementById(id)
    input.click()
  }

  // On file Select
  handleUploaderFileEvent(event: any, dbName:any, name?: any ) {
    const file: File = event.target.files[0];
    
    const fileSplitted = file.name.split('.')
    const extFinded = fileSplitted.find(word => word.includes('pdf'))
    const ext = '.'+fileSplitted[fileSplitted.length-1]
    this.uploadedFile.emit({file: file, name: name, dbName: dbName, ext: ext});
  }
  handleUploaderEvent(event: any, name?: any) {
    const file: File = event.target.files[0];
    
    const fileSplitted = file.name.split('.')
    const extFinded = fileSplitted.find(word => word.includes('pdf'))
    const ext = '.'+fileSplitted[fileSplitted.length-1]
    this.uploadedFile.emit({file: file, name: name, dbName: name, ext: ext});
  }
  handleUploadersEvent(event: any, name?: any) {
    const filesS: [File] = event.target.files;
    const files: any = [];

    let x = this.otherFiles.length + 1

    for (const file of filesS) {
      
      const fileSplitted = file.name.split('.')
      const ext = '.'+fileSplitted[fileSplitted.length-1]
      const newFile = new File([file], name+x+ext, {type: file.type});
      files.push(newFile)
      x++
      // this.uploadedFile.emit({file: files, name: name, ext: ext});
    }

    this.uploadedFiles.emit({files: files, dbName: name});
  }

}
