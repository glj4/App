import { Component, ContentChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonInput } from '@ionic/angular';
import { Photo } from 'src/app/models/photo.interface';
import { PhotoService } from 'src/app/services/photo.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  orderForm: FormGroup;
  photos: any[] = [];
  photo: string;
  user: any;
  modifyName: boolean = false;
  modifySurname: boolean;
  modifyPhone: boolean;
  modifyPassword: boolean = false;
  passwordType1: string = 'password';
  passwordIcon1: string = 'eye-off-outline';
  passwordType2: string = 'password';
  passwordIcon2: string = 'eye-off-outline';
  isModified: boolean = false;

  @ContentChild(IonInput) input: IonInput;
  
  constructor(
    public route: Router,
    private photoSvc: PhotoService,
    public userSvc: UsersService,
    private formBuilder: FormBuilder,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    this.orderForm = this.formBuilder.group({
      name: [''],
      surname: [''],
      phone: ['', [Validators.pattern('^[0-9]+$'), Validators.minLength(9), Validators.maxLength(9)]],
      email: ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: [''],
      repeatPassword: ['']
    },
    {'validator': this.isMatching});
    const email = localStorage.getItem('email');
    this.photos = await this.photoSvc.loadSaved();
    for (let photo of this.photos) {
      if (photo.user === email) {
        this.photo = photo;
      }
    }
    this.userSvc.getUserByEmail(email)
      .subscribe((user) => {
        this.user = user;
        if (this.user.surname != undefined) {
          this.modifySurname = false;
        }
        if (this.user.phone != undefined) {
          this.modifyPhone = false;
        }
      });
  }

  isMatching(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('repeatPassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  updateProfile() {
    this.isModified = true;
    if (this.user.name != undefined && this.user.name != '' && !this.modifyName) {
      this.orderForm.value.name = this.user.name;
    }
    if (this.user.surname != undefined && this.user.surname != '' && !this.modifySurname) {
      this.orderForm.value.surname = this.user.surname;
    }
    if (this.user.phone != undefined && this.user.phone != '' && !this.modifyPhone) {
      this.orderForm.value.phone = this.user.phone;
    }
    if (this.user.password != undefined && this.user.password != '' && !this.modifyPassword) {
      this.orderForm.value.password = this.user.password;
    }
    if (this.orderForm.value.name === '' && this.orderForm.value.surname === '' && this.orderForm.value.phone === '' && this.orderForm.value.password === '') {
      this.presentAlertNotModified();
    } else {
      if (this.orderForm.valid) {
        console.log(this.orderForm.value);
        this.userSvc.editUser(this.user._id, {name: this.orderForm.value.name,
                                              surname: this.orderForm.value.surname,
                                              phone: this.orderForm.value.phone,
                                              email: this.orderForm.value.email,
                                              password: this.orderForm.value.password})
          .subscribe(() => {
          this.presentAlertModified();
          }, (error) => {
          console.log(error);
          });
      }
    }
  }

  deleteProfile(id: any){
    const email = localStorage.getItem('email');
    for (let photo of this.photos) {
      if (photo.user === email) {
        const index = this.photos.indexOf(photo);
        this.photos.splice(index, 1);
      }
    }
    localStorage.removeItem('email');
    this.userSvc.deleteUser(id)
    .subscribe(() => {});
    localStorage.removeItem('token');
    this.route.navigate(['']);
  }

  async presentAlert(id: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar cuenta',
      message: '¿Estás seguro que quieres eliminar la cuenta?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteProfile(id);
          }
        },
        {
          text: 'Cancelar'
        }
      ]
    });
    await alert.present();
  }

  async presentAlertModified() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'El usuario ha sido modificado',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            window.location.reload();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertNotModified() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'No se ha modificado ningún dato del usuario',
      buttons: [
        {
          text: 'Aceptar'
        }
      ]
    });
    await alert.present();
  }

  editName() {
    this.modifyName = true;
  }

  editSurname() {
    this.modifySurname = true;
  }

  editPhone() {
    this.modifyPhone = true;
  }

  editPassword() {
    this.modifyPassword = true;
  }

  hideShowPassword1() {
    this.passwordType1 = this.passwordType1 === 'text' ? 'password' : 'text';
    this.passwordIcon1 = this.passwordIcon1 === 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
  }

  hideShowPassword2() {
    this.passwordType2 = this.passwordType2 === 'text' ? 'password' : 'text';
    this.passwordIcon2 = this.passwordIcon2 === 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
  }

  get errorControl() {
    return this.orderForm.controls;
  }

  public async changePhoto() {
    let index: any = undefined;
    const email = localStorage.getItem('email');
    this.photos = await this.photoSvc.loadSaved();
    for (let photo of this.photos) {
      if (photo.user === email) {
        index = this.photos.indexOf(photo);
      }
    }
    if (index != undefined) {
      this.photos.splice(index, 1);
    }
    console.log(this.photos);
    this.photoSvc.addNewToGallery(email);
  }

  public getPhotos(): Photo[] {
    this.photos = this.photoSvc.getPhotos();
    return this.photos;
  }
}
