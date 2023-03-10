import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { $ } from 'protractor';
import { GooglemapsService } from 'src/app/services/googlemaps.service';
import { UsersService } from 'src/app/services/users.service';
import { House } from '../../models/house.interface';
import { HousesService } from '../../services/houses.service';

declare var google: any;

@Component({
  selector: 'app-info-house',
  templateUrl: './info-house.page.html',
  styleUrls: ['./info-house.page.scss'],
})
export class InfoHousePage implements OnInit {

  map: any;
  marker: any;
  infowindow: any;

  @ViewChild('map') divMap: ElementRef;

  houseId: any;
  house: House;
  fechaIn: Date;
  fechaOut: Date;
  heartIcon: string;
  houses: House[] = [];
  dateIn: string;
  dateOut: string;
  favorites: any[] = [];
  showModalAvailable: boolean = false;
  dateInSearch: string;
  dateOutSearch: string;
  followingDay: string;
  checkAvailable: boolean = false;
  myDate: string;
  available: boolean = false;
  doBooking: boolean = false;
  points: number = 0;
  noches: number;
  precioNoches: number;
  pointsToDiscount: number;
  totalPriceWithDiscount: number;

  constructor(
    private houseSvc: HousesService,
    private userSvc: UsersService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document,
    private googlemapsSvc: GooglemapsService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => this.houseId = params['id']);
    this.houseSvc.getHouse(this.houseId)
    .subscribe((hou: any) => {
      this.house = hou as House;
      let exists: boolean = false;
      const email = localStorage.getItem('email');
      this.userSvc.getUserByEmail(email)
        .subscribe((user) => {
          if (user['favorites'] != undefined) {
            for (let favorite of user['favorites']) {
              if (favorite['_id'] === this.house._id) {
                exists = true;
              }
            }
          }
          if (exists) {
            this.heartIcon = 'heart';
          } else {
            this.heartIcon = 'heart-outline';
          }
          if (user['points'] != undefined) {
            this.points = user['points'];
          }
        });
    });
    this.dateIn = this.houseSvc.getDateIn();
    this.dateOut = this.houseSvc.getDateOut();
    if (this.dateIn == undefined && this.dateOut == undefined) {
      this.showModalAvailable = false;
    }
    this.init();
  }

  async init() {
    this.googlemapsSvc.init(this.renderer, this.document).then( () => {
      this.initMap();
    }).catch((err) => {
      console.log(err);
    });
  }

  initMap() {
    const position = this.house.ubication;

    let latLng = new google.maps.LatLng(position.lat, position.lng);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      disableDefaultUI: true,
      clickableIcons: false
    };

    this.map = new google.maps.Map(this.divMap.nativeElement, mapOptions);
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: false
    });
    this.infowindow = new google.maps.InfoWindow();
    this.addMarker(position);
    this.setInfoWindow(this.marker, 'Ubicaci??n', this.house.name);
  }

  addMarker(position: any): void {
    let latLng = new google.maps.LatLng(position.lat, position.lng);
    this.marker.setPosition(latLng);
  }

  setInfoWindow(marker: any, titulo: string, subtitulo: string) {
    const contentString = '<div id="contentInsideMap">' +
                          '<div>' +
                          '</div>' +
                          '<p style="font-weight: bold; margin-bottom: 5px;">' + titulo + '</p>' +
                          '<div id="bodyContent">' +
                          '<p class="normal m-0">' + 
                          subtitulo + '</p>' +
                          '</div>' +
                          '</div>';
    this.infowindow.setContent(contentString);
    this.infowindow.open(this.map, marker);
  }

  addFavourite() {
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
              if (favorite['_id'] === this.house._id) {
                repetido = true;
                break;
              }
            }
            if (!repetido) {
              this.favorites.push(this.house);
            }
          } else {
            this.favorites.push(this.house);
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
            if (favorite['_id'] === this.house._id) {
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
    }
    this.presentAlertDeleteFavourite();
  }

  async presentAlertAddFavourite() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '??FAVORITO!',
      message: 'Has a??adido esta casa como favorita',
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
      message: 'Has eliminado esta casa como favorita',
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

  async isAvailable() {
    this.showModalAvailable = true;
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

        const date = new Date(this.formatDate(year, month, day));
        this.dateIn = date.toLocaleDateString();
        this.houseSvc.setDateIn(this.dateIn);
        this.followingDay = new Date(date.getTime() + 90000000).toISOString();
        if (this.dateOut != undefined) {
          this.dateOut = undefined;
          this.dateOutSearch = undefined;
        }
      }
    },
    {
      text: 'Borrar',
      handler: () =>  {
        this.dateInSearch = undefined;
        this.dateIn = undefined;
        this.dateOutSearch = undefined;
        this.dateOut = undefined;
        this.houseSvc.setDateIn(undefined);
        this.houseSvc.setDateOut(undefined);
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

        const date = new Date(this.formatDate(year, month, day));
        this.dateOut = date.toLocaleDateString();
        this.houseSvc.setDateOut(this.dateOut);
      }
    },
    {
      text: 'Borrar',
      handler: () =>  {
        this.dateOutSearch = undefined;
        this.dateOut = undefined;
        this.houseSvc.setDateOut(undefined);
      }
    }]
  }

  comprobarDisponibilidad(id: string) {
    this.checkAvailable = true;
    this.houseSvc.getHouse(id)
    .subscribe((house: House) => {
      if (house.bookings.length == 0) {
        this.available = true;
      }
      else {
        for (let booking of house.bookings) {
          const bookingDateInString = booking['startDatetime'];
          const bookingDateOutString = booking['endDatetime'];
          let bookingDateIn = undefined;
          if (bookingDateInString != undefined) {
            const day = bookingDateInString.split('/')[0];
            const month = bookingDateInString.split('/')[1];
            const year = bookingDateInString.split('/')[2];
            bookingDateIn = new Date(year, month-1, day);
          }
          let bookingDateOut = undefined;
          if (bookingDateOutString != undefined) {
            const day = bookingDateOutString.split('/')[0];
            const month = bookingDateOutString.split('/')[1];
            const year = bookingDateOutString.split('/')[2];
            bookingDateOut = new Date(year, month-1, day);
          }
          let dateInFormat = undefined;
          if (this.dateIn != undefined) {
            const day = Number.parseInt(this.dateIn.split('/')[0]);
            const month = Number.parseInt(this.dateIn.split('/')[1]);
            const year = Number.parseInt(this.dateIn.split('/')[2]);
            dateInFormat = new Date(year, month-1, day);
          }
          let dateOutFormat = undefined;
          if (this.dateOut != undefined) {
            const day = Number.parseInt(this.dateOut.split('/')[0]);
            const month = Number.parseInt(this.dateOut.split('/')[1]);
            const year = Number.parseInt(this.dateOut.split('/')[2]);
            dateOutFormat = new Date(year, month-1, day);
          }
          
          if (bookingDateIn == undefined || bookingDateOut == undefined) {
            this.available = true;
          }

          if ((dateInFormat.getTime() < bookingDateIn.getTime() && dateOutFormat.getTime() < bookingDateIn.getTime()) ||
              (dateInFormat.getTime() > bookingDateOut.getTime() && dateOutFormat.getTime() > bookingDateOut.getTime())) {
                this.available = true;
              }
        }
      }
    });
  }

  gestionarReserva() {
    this.doBooking = true;
    this.noches = this.calcularNoches();
    this.precioNoches = this.calcularPrecio();
  }

  calcularNoches() {
    const dayIn = Number.parseInt(this.dateIn.split('/')[0]);
    const monthIn = Number.parseInt(this.dateIn.split('/')[1]);
    const yearIn = Number.parseInt(this.dateIn.split('/')[2]);
    var dateInFormat = new Date(yearIn, monthIn-1, dayIn);
    const dayOut = Number.parseInt(this.dateOut.split('/')[0]);
    const monthOut = Number.parseInt(this.dateOut.split('/')[1]);
    const yearOut = Number.parseInt(this.dateOut.split('/')[2]);
    var dateOutFormat = new Date(yearOut, monthOut-1, dayOut);
    var diff = dateOutFormat.getTime() - dateInFormat.getTime();
    return diff/(1000*60*60*24);
  }

  calcularPrecio() {
    return this.noches*this.house.price;
  }

  realizarReserva(id: string) {
    var formaHouse = {
      startDatetime: this.dateIn,
      endDatetime: this.dateOut
    }
    var bookings: any[] = [];
    if (this.house.bookings != undefined) {
      for (let booking of this.house.bookings) {
        bookings.push(booking);
      }
    }
    bookings.push(formaHouse);
    this.houseSvc.updateHouse(id, {bookings:bookings})
    .subscribe(() => {
      console.log('Reserva guardada en hotel');
    });
    const email = localStorage.getItem('email');
    var bookingsUser: any[] = [];
    var formaUser = {
      startDatetime: this.dateIn,
      endDatetime: this.dateOut,
      _id: this.house._id,
      images: this.house.images,
      name: this.house.name,
      location: this.house.location
    }
    this.userSvc.getUserByEmail(email)
      .subscribe((user) => {
        if (user['bookings'] != undefined) {
          for (let booking of user['bookings']) {
            bookingsUser.push(booking);
          }
        }
        bookingsUser.push(formaUser);
        if (this.pointsToDiscount != undefined) {
          var points = user['points'] - this.pointsToDiscount;
          this.userSvc.editUser(user['_id'], {bookings:bookingsUser, points:points})
          .subscribe(() => {
            console.log('Reserva guardada en usuario');
          });
        } else {
          this.userSvc.editUser(user['_id'], {bookings:bookingsUser})
          .subscribe(() => {
            console.log('Reserva guardada en usuario');
          });
        }
      });
    this.presentAlertBooking();
  }

  addPoints(points: any, data: any) {
    this.pointsToDiscount = data;
    if (data > points) {
      this.pointsToDiscount = points;
    }
    this.calcularPrecioConDescuento();
  }

  calcularPrecioConDescuento() {
    this.totalPriceWithDiscount = this.noches*this.house.price - this.pointsToDiscount*0.5;
  }

  async presentAlert(points: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Tiene ' + points + ' puntos',
      message: 'Inserte los puntos que desea gastar para obtener un descuento',
      inputs: [{
        cssClass: 'textbox-class',
        type: 'number',
        min: 0,
        max: points
      }],
      buttons: [
        {
          text: 'Aceptar',
          handler: (data) => {
            this.addPoints(points, data[0]);
          }
        },
        {
          text: 'Cancelar'
        }
      ]
    });
    await alert.present();
  }

  async presentAlertBooking() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Su reserva se ha realizado correctamente',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.router.navigate(['/tabs/main-page']);
            this.doBooking = false;
            this.checkAvailable = false;
            this.showModalAvailable = false;
            this.dateIn = undefined;
            this.dateOut = undefined;
            this.dateInSearch = undefined;
            this.dateOutSearch = undefined;
          }
        }
      ]
    });
    await alert.present();
  }

  goBack() {
    this.showModalAvailable = false;
    this.checkAvailable = false;
    this.router.navigate(['/tabs/main-page']);
  }

  seguirExplorando() {
    this.doBooking = false;
    this.checkAvailable = false;
    this.showModalAvailable = false;
    this.dateIn = undefined;
    this.dateOut = undefined;
    this.dateInSearch = undefined;
    this.dateOutSearch = undefined;
    this.router.navigate(['tabs/main-page']);
  }
}
