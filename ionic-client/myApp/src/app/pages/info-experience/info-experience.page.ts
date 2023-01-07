import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user.interface';
import { UsersService } from 'src/app/services/users.service';
import { Experience } from '../../models/experience.interface';
import { ExperiencesService } from '../../services/experiences.service';

@Component({
  selector: 'app-info-experience',
  templateUrl: './info-experience.page.html',
  styleUrls: ['./info-experience.page.scss'],
})
export class InfoExperiencePage implements OnInit {

  experienceId: any;
  experience: Experience;
  heartIcon: string;
  favorites: any[] = [];
  likes: any[] = [];
  liked: boolean;
  
  constructor(
    private experienceSvc: ExperiencesService,
    private userSvc: UsersService,
    private alertController: AlertController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => this.experienceId = params['id']);
    this.experienceSvc.getExperience(this.experienceId)
    .subscribe((exp: any) => {
      this.experience = exp as Experience;
      let exists: boolean = false;
      let likeIt: boolean = false;
      const email = localStorage.getItem('email');
      this.userSvc.getUserByEmail(email)
        .subscribe((user) => {
          if (user['favorites'] != undefined) {
            for (let favorite of user['favorites']) {
              if (favorite['_id'] === this.experience._id) {
                exists = true;
              }
            }
          }
          if (user['likes'] != undefined) {
            for (let like of user['likes']) {
              if (like['_id'] === this.experience._id) {
                likeIt = true;
              }
            }
          }
          if (exists) {
            this.heartIcon = 'heart';
          } else {
            this.heartIcon = 'heart-outline';
          }
          if (likeIt) {
            this.liked = true;
          } else {
            this.liked = false;
          }
        });
    });
  }

  addOrDeleteFavourite() {
    if (this.heartIcon === 'heart-outline') {
      let repetido: boolean = false;
      const email = localStorage.getItem('email');
      this.userSvc.getUserByEmail(email)
        .subscribe((user) => {
          if (user['favorites'] != undefined) {
            for (let favorite of user['favorites']) {
              this.favorites.push(favorite);
            }
          }
          if (this.favorites.length > 0) {
            for (let favorite of this.favorites) {
              if (favorite['_id'] === this.experience._id) {
                repetido = true;
                break;
              }
            }
            if (!repetido) {
              this.favorites.push(this.experience);
            }
          } else {
            this.favorites.push(this.experience);
          }
          this.userSvc.editUser(user['_id'], {favorites: this.favorites})
              .subscribe(() => {});
        });
        this.presentAlertAddFavourite();
    }
    else {
      let index: any = undefined;
      const email = localStorage.getItem('email');
      this.userSvc.getUserByEmail(email)
        .subscribe((user) => {
          for (let favorite of user['favorites']) {
            if (favorite['_id'] === this.experience._id) {
              index = user['favorites'].indexOf(favorite);
            }
            this.favorites.push(favorite);
          }
          if (index != undefined) {
            user['favorites'].splice(index, 1)
            this.favorites.splice(index, 1);
            this.userSvc.editUser(user['_id'], {favorites: this.favorites})
            .subscribe(() => {});
          }
        });
      this.presentAlertDeleteFavourite();
    }
  }

  async presentAlertAddFavourite() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¡FAVORITO!',
      message: 'Has añadido esta experiencia como favorita',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            window.location.reload();
            this.heartIcon = 'heart';
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertDeleteFavourite() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Has eliminado esta experiencia como favorita',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            window.location.reload();
            this.heartIcon = 'heart-outline';
          }
        }
      ]
    });
    await alert.present();
  }

  like(email: string) {
    let points = 0;
    const emailLogin = localStorage.getItem('email');
    if (email === emailLogin) {
      this.presentAlertUser();
    } else {
      if (!this.liked) {
        this.userSvc.getUserByEmail(emailLogin)
        .subscribe((user) => {
          if (user['likes'] != undefined) {
            for (let like of user['likes']) {
              this.likes.push(like);
            }
          }
          this.likes.push(this.experience);
          this.liked = true;
          this.userSvc.editUser(user['_id'], {likes: this.likes})
              .subscribe(() => {});
        });
        this.userSvc.getUserByEmail(email)
        .subscribe((user) => {
          if (user['points'] != undefined) {
            points = user['points'];
          }
          points += 5;
          this.userSvc.editUser(user['_id'], {points: points})
              .subscribe(() => {
                this.presentAlertPoints(email);
              });
        });
      }
    }
  }

  async presentAlertPoints(user: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¡TE GUSTA!',
      message: 'El usuario '+user+' ha recibido 5 puntos de tu parte. ¡¡Gracias!!',
      buttons: [
        {
          text: 'Aceptar'
        }
      ]
    });
    await alert.present();
  }

  async presentAlertUser() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Esta experiencia la has creado tú mismo',
      buttons: [
        {
          text: 'Aceptar'
        }
      ]
    });
    await alert.present();
  }
}
