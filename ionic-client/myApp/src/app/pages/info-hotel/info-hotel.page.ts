import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { GooglemapsService } from 'src/app/services/googlemaps.service';
import { UsersService } from 'src/app/services/users.service';
import { Hotel } from '../../models/hotel.interface';
import { HotelsService } from '../../services/hotels.service';

declare var google: any;

@Component({
  selector: 'app-info-hotel',
  templateUrl: './info-hotel.page.html',
  styleUrls: ['./info-hotel.page.scss'],
})
export class InfoHotelPage implements OnInit {

  map: any;
  marker: any;
  infowindow: any;

  @ViewChild('map') divMap: ElementRef;

  hotelId: any;
  hotel: Hotel;
  fechaIn: Date;
  fechaOut: Date;
  heartIcon: string;
  hotels: Hotel[] = [];
  dateIn: string;
  dateOut: string;
  favorites: any[] = [];
  showModalAvailable: boolean = false;
  dateInSearch: string;
  dateOutSearch: string;
  followingDay: string;
  checkAvailable: boolean = false;
  myDate: string;
  roomsAvailable: number = 0;
  doBooking: boolean = false;
  points: number = 0;

  constructor(
    private hotelSvc: HotelsService,
    private userSvc: UsersService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document,
    private googlemapsSvc: GooglemapsService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const today = new Date();
    this.myDate = today.toISOString();
    this.followingDay = new Date(today.getTime() + 86400000).toISOString();
    this.route.params.subscribe((params: Params) => this.hotelId = params['id']);
    this.hotelSvc.getHotel(this.hotelId)
    .subscribe((hot: any) => {
      this.hotel = hot as Hotel;
      let exists: boolean = false;
      const email = localStorage.getItem('email');
      this.userSvc.getUserByEmail(email)
        .subscribe((user) => {
          if (user['favorites'] != undefined) {
            for (let favorite of user['favorites']) {
              if (favorite['_id'] === this.hotel._id) {
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
    this.dateIn = this.hotelSvc.getDateIn();
    this.dateOut = this.hotelSvc.getDateOut();
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
    const position = this.hotel.ubication;

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
    this.setInfoWindow(this.marker, 'Ubicación', this.hotel.name);
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
              if (favorite['_id'] === this.hotel._id) {
                repetido = true;
                break;
              }
            }
            if (!repetido) {
              this.favorites.push(this.hotel);
            }
          } else {
            this.favorites.push(this.hotel);
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
            if (favorite['_id'] === this.hotel._id) {
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
      message: 'Has añadido este hotel como favorito',
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
      message: 'Has eliminado este hotel como favorito',
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
        this.hotelSvc.setDateIn(this.dateIn);
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
        this.hotelSvc.setDateIn(undefined);
        this.hotelSvc.setDateOut(undefined);
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
        this.hotelSvc.setDateOut(this.dateOut);
      }
    },
    {
      text: 'Borrar',
      handler: () =>  {
        this.dateOutSearch = undefined;
        this.dateOut = undefined;
        this.hotelSvc.setDateOut(undefined);
      }
    }]
  }

  comprobarDisponibilidad(id: string) {
    this.checkAvailable = true;
    this.hotelSvc.getHotel(id)
    .subscribe((hotel: Hotel) => {
      if (hotel.bookings == undefined || hotel.bookings.length == 0) {
        this.roomsAvailable = hotel.rooms;
      }
      else {
        let cont = 0;
        for (let booking of hotel.bookings) {
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
            this.roomsAvailable++;
          }
          
          if ((dateInFormat.getTime() < bookingDateIn.getTime() && dateOutFormat.getTime() < bookingDateIn.getTime()) ||
              (dateInFormat.getTime() > bookingDateOut.getTime() && dateOutFormat.getTime() > bookingDateOut.getTime())) {
                if (cont < hotel.rooms) {
                  this.roomsAvailable++;
                }
              }
              else {
                cont++;
              }
        }
      }
    });
  }

  realizarReserva(id: string) {
    this.doBooking = true;
    console.log(id);
  }

  goBack() {
    this.showModalAvailable = false;
    this.checkAvailable = false;
    this.doBooking = false;
    this.router.navigate(['/tabs/main-page']);
  }
}
