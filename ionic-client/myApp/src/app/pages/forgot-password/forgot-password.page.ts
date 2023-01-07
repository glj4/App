import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  orderForm: FormGroup;
  isRecover = false;
  userNotExists = false;
  emailSend = false;
  emailValid = false;

  constructor(
    public route: Router,
    private formBuilder: FormBuilder,
    private userSvc: UsersService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]]
    });
  }

  forgotPassword(){
    this.isRecover = true;
    if (this.orderForm.valid) {
        this.userSvc.forgotPassword(this.orderForm.value)
        .subscribe(() => {
          this.emailValid = true;
          this.emailSend = true;
          this.presentAlert();
          this.orderForm.reset();
        }, () => {
          this.userNotExists = true;
        });
    }
  }

  get errorControl() {
    return this.orderForm.controls;
  }

  public clearForm() {
    this.userNotExists = false;
    this.emailSend = false;
    this.isRecover = false;
    this.orderForm.reset();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¡Enviado!',
      message: 'Se ha enviado un email para establecer una nueva contraseña. Revise la carpeta de Spam.',
      buttons: [
        {
          text: 'Aceptar'
        }
      ]
    });
    await alert.present();
  }
}
