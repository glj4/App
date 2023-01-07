import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExperiencesService } from 'src/app/services/experiences.service';
import { HotelsService } from 'src/app/services/hotels.service';
import { HousesService } from 'src/app/services/houses.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

  favorites: any[] = [];
  user: any;

  constructor(
    private route: Router,
    private experienceSvc: ExperiencesService,
    private hotelSvc: HotelsService,
    private houseSvc: HousesService,
    private userSvc: UsersService
  ) { }

  ngOnInit() {
    const email = localStorage.getItem('email');
    this.userSvc.getUserByEmail(email)
    .subscribe((user) => {
      this.favorites = user['favorites'];
    }, (error) => {
      console.log(error);
    });
  }

  routeById(id: string){
    this.experienceSvc.getExperience(id)
    .subscribe((exp) => {
      if (exp) {
        this.route.navigate(['tabs/main-page/info-experience', id]);
      }
    });
    this.hotelSvc.getHotel(id)
    .subscribe((hotel) => {
      if (hotel) {
        this.route.navigate(['tabs/main-page/info-hotel', id]);
      }
    });
    this.houseSvc.getHouse(id)
    .subscribe((house) => {
      if (house) {
        this.route.navigate(['tabs/main-page/info-house', id]);
      }
    });
  }
}
