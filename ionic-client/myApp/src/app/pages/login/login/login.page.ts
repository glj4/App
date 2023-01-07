import { Component, ContentChild, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  orderForm: FormGroup;
  isLogged: boolean;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';
  isSignin = false;
  userNotExists = false;
  error: string;

  @ContentChild(IonInput) input: IonInput;

  constructor(
    public userSvc: UsersService,
    public route: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', Validators.required]
    });
  }

  signIn(){
    this.isSignin = true;
    if (this.orderForm.valid) {
      this.userSvc.login(this.orderForm.value)
      .subscribe((respuesta:any) => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('email', this.orderForm.value.email);
        this.route.navigate(['tabs/main-page']);
        this.clearForm();
      }, () =>{
        this.userNotExists = true;
      });
    }
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
  }

  get errorControl() {
    return this.orderForm.controls;
  }

  public clearForm() {
    this.userNotExists = false;
    this.isSignin = false;
    this.orderForm.reset();
  }

  public clearBooleans() {
    this.userNotExists = false;
    this.isSignin = false;
  }
}
 