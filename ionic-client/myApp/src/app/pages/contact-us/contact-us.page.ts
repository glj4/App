import { Component, ContentChild, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonInput } from '@ionic/angular';
import { ContactUsService } from '../../services/contact-us.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  orderForm: FormGroup;
  isContact = false;
  email: string;

  @ContentChild(IonInput) input: IonInput;

  constructor(
    public userSvc: UsersService,
    public route: Router,
    private formBuilder: FormBuilder,
    private contactSvc: ContactUsService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phone: ['', [Validators.pattern('^[0-9]+$'), Validators.minLength(9), Validators.maxLength(9)]],
      textarea: ['', [Validators.required]]
    });
    if (this.userSvc.comprobarLogin()) {
      this.email = localStorage.getItem('email');
    }
  }

  contactUs() {
    this.isContact = true;
    if (this.email != undefined) {
      this.orderForm.value.email = this.email;
    }
    if (this.email != undefined || this.orderForm.valid) {
      if (this.email != undefined) {
        this.contactSvc.contactUs(this.email, this.orderForm.value.phone, this.orderForm.value.textarea)
        .subscribe(() => {
          this.presentAlert();
          this.clearForm();
        }, error => {
          console.log(error)
        });
      } else {
        this.contactSvc.contactUs(this.orderForm.value.email, this.orderForm.value.phone, this.orderForm.value.textarea)
        .subscribe(() => {
          this.presentAlert();
          this.clearForm();
        }, error => {
          console.log(error)
        });
      }
    }
  }

  get errorControl() {
    return this.orderForm.controls;
  }

  public clearForm() {
    this.isContact = false;
    this.orderForm.reset();
  }

  public clearBooleans() {
    this.isContact = false;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¡Enviado!',
      message: 'Su email se ha enviado. Recibirá una respuesta en un máximo de 48 horas.',
      buttons: [
        {
          text: 'Aceptar'
        }
      ]
    });
    await alert.present();
  }
}
