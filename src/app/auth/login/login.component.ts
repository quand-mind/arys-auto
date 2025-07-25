import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
// import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FormBuilder, Validators, FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../../src/app/_services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading : boolean = false;
  submitted : boolean = false;
  xlogin = ''
  xcontrasena = ''

  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  constructor(public AuthService: AuthService, 
              public router: Router, 
              private formBuilder: FormBuilder, 
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private authenticationService: AuthenticationService) { 
                this.createForm();
                  // redirect to home if already logged in
                const token = this.AuthService.getToken()
                if (token) {
                  if (this.tokenExpired(token)) {
                    console.log('vencido');
                    this.AuthService.deleteToken()
                    return
                  }
                  const getSistema = this.AuthService.getTipoSistema()
                  if (getSistema == '1'){
                    console.log('redirect to club...')
                    this.router.navigate(['/club/userDetails']);
                  } else if(getSistema == '2') {
                    console.log('redirect to admin...')
                    this.router.navigate(['/admin/dashboard']);
                  }
                } else {}
              }

  SingIn!: FormGroup
  error = '';
  autentification =  false
  public showPassword: boolean = false;

  get f(): { [key: string]: AbstractControl } {
    return this.SingIn.controls;
  }

  openSnackBarLoading() {
    this.snackBar.open('Validando los datos...', '');
  }
  openActionSnackBar(message: any, url: any, duration: any, action: any) {
    const snackBarRef = this.snackBar.open(message, action, {duration: duration});
    snackBarRef.afterDismissed().subscribe(info => {
      if(duration == 1000) {
        this.router.navigate([url]);
      }
        // your code for handling this goes here
    });;
    
  }


  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private createForm() {
    this.SingIn = this.formBuilder.group(
      {
        xlogin: new FormControl ('', [Validators.required,Validators.minLength(2)]),
        xcontrasena: new FormControl('', Validators.required),
      }
    );
  }

  onSubmit(): void {
    console.log('empieza');
    this.openSnackBarLoading()
    if (this.SingIn.invalid) {
      this.submitted = true;
      return;
    }
    this.submitted = false;
    this.error = '';
    this.loading = true;
    this.authenticationService.login(this.f['xlogin'].value, this.f['xcontrasena'].value)
        .pipe(first())
        .subscribe({
            next: () => {
                // get return url from route parameters or default to '/'
                const getSistema = this.AuthService.getTipoSistema()
                let returnUrl = ''
                if(getSistema == '2') {
                  returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
                } else if (getSistema == '1') {
                  returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/club/userDetails';
                }
                this.openActionSnackBar('Usuario Autenticado con éxito', returnUrl, 1000, 'Aceptar')
            },
            error: (err) => {
              console.log(err);
              if(err.status == '401') {
                this.openActionSnackBar('Error en el ingreso, verifica los datos.', '', 2000, 'Cerrar')
              } else {
                this.openActionSnackBar('Error en el servidor, por favor intenta mas tarde.', '', 2000, 'Cerrar')
              }
            },
            
        });
    
  }

  onReset(): void {
    this.submitted = false;
    this.SingIn.reset();
  }

  ShowModal(){
    this.autentification = false
    
}
    
  ngOnInit(): void {
  }

}
