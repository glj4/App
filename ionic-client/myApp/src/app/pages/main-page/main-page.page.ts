import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonDatetime } from '@ionic/angular';
import { ExperiencesService } from '../../services/experiences.service';
import { HotelsService } from '../../services/hotels.service';
import { HousesService } from '../../services/houses.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.page.html',
  styleUrls: ['./main-page.page.scss'],
})
export class MainPagePage implements OnInit {

  experiences: any[] = [];
  hotels: any[] = [];
  houses: any[] = [];
  textoBuscar: '';
  numViajeros: number;
  myDate: string;
  followingDay: string;
  numbers: number[];
  showOutIcon: boolean;
  showInIcon: boolean;
  dateIn: string;
  dateOut: string;
  dateInSearch: string;
  dateOutSearch: string;

  constructor(
    public route:Router,
    public _usuario: UsersService,
    public alertController: AlertController,
    public _experiences: ExperiencesService,
    public _hotels: HotelsService,
    public _houses: HousesService,
  ) { }

  ngOnInit() {
    const today = new Date();
    this.myDate = today.toISOString();
    this.followingDay = new Date(today.getTime() + 86400000).toISOString();
    this.showInIcon = true;
    this.showOutIcon = true;
    this.numbers = [ ,1,2,3,4,5,6,7,8,9,10]
    this._experiences.getExperiences()
      .subscribe((experience:any) => {
        this.experiences = experience.docs;
      });
    this._hotels.getHotels()
      .subscribe((hotel:any) => {
        this.hotels = hotel.docs;
      });
    this._houses.getHouses()
      .subscribe((house:any) => {
        this.houses = house.docs;
      });
  }

  sortExperiences() {
    return this.experiences.sort((b, a) => b.finalPrice - a.finalPrice);
  }

  sortHotels() {
    return this.hotels.sort((b, a) => b.price - a.price);
  }

  sortHouses() {
    return this.houses.sort((b, a) => b.price - a.price);
  }

  routeExperience(id: string){
    this.route.navigate(['tabs/main-page/info-experience', id]);
  }

  routeHotel(id: string){
    this.route.navigate(['tabs/main-page/info-hotel', id]);
  }

  routeHouse(id: string){
    this.route.navigate(['tabs/main-page/info-house', id]);
  }

  buscar(event) {
    this.textoBuscar = event.detail.value;
  }

  buscarViajeros(event) {
    this.numViajeros = event.detail.value;
  }

  private formatDate(year: string, month: string, day: string) {
    const yearNumber = Number.parseInt(year);
    const monthNumber = Number.parseInt(month);
    const dayNumber = Number.parseInt(day);
    return new Date(yearNumber, monthNumber-1, dayNumber);
  }

  customPickerOptionDateIn = {
    buttons: [{
      text: 'Aceptar',
      handler: (data) => {
        let year: string = data.year.text;
        let month: string = data.month.value < 10 ? '0' + data.month.value.toString(): data.month.value.toString();
        let day: string = data.day.text;
        this.dateInSearch = year+'/'+month+'/'+day;

        this.showInIcon = false;
        const date = new Date(this.formatDate(year, month, day));
        this.dateIn = date.toLocaleDateString();
        this._hotels.setDateIn(this.dateIn);
        this._houses.setDateIn(this.dateIn);
        this.followingDay = new Date(date.getTime() + 90000000).toISOString();
        if (this.dateOut != undefined) {
          this.dateOut = undefined;
          this.dateOutSearch = undefined;
          this.showOutIcon = true;
        }
      }
    },
    {
      text: 'Borrar',
      handler: () =>  {
        this.showInIcon = true;
        this.dateInSearch = undefined;
        this.dateIn = undefined;
        this.showOutIcon = true;
        this.dateOutSearch = undefined;
        this.dateOut = undefined;
        this._hotels.setDateIn(undefined);
        this._houses.setDateIn(undefined);
        this._hotels.setDateOut(undefined);
        this._houses.setDateOut(undefined);
      }
    }]
  }

  customPickerOptionDateOut = {
    buttons: [{
      text: 'Aceptar',
      handler: (data) => {
        let year: string = data.year.text;
        let month: string = data.month.value < 10 ? '0' + data.month.value.toString(): data.month.value.toString();
        let day: string = data.day.text;
        this.dateOutSearch = year+'/'+month+'/'+day;

        this.showOutIcon = false;
        const date = new Date(this.formatDate(year, month, day));
        this.dateOut = date.toLocaleDateString();
        this._hotels.setDateOut(this.dateOut);
        this._houses.setDateOut(this.dateOut);
      }
    },
    {
      text: 'Borrar',
      handler: () =>  {
        this.showOutIcon = true;
        this.dateOutSearch = undefined;
        this.dateOut = undefined;
        this._hotels.setDateOut(undefined);
        this._houses.setDateOut(undefined);
      }
    }]
  }

  logout(){
    localStorage.removeItem('token');
    this.route.navigate(['']);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cerrar sesión',
      message: '¿Estás seguro que quieres cerrar la sesión?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.logout();
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
