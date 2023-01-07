import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PhotoService } from 'src/app/services/photo.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  photos: any[] = [];
  photo: string;
  user: any;
  show: boolean = false;
  reload: boolean = true;

  constructor(
    private photoSvc: PhotoService,
    private userSvc: UsersService,
    private route: Router,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
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
    });
  }

  showOptions() {
    if (this.show) {
      this.show = false;
    } else {
      this.show = true;
    }
  }

  editarPerfil(id: any) {
    this.route.navigate(['tabs/profile/edit-profile']);
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
}
