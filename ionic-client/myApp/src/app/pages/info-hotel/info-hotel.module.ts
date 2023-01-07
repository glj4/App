import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoHotelPageRoutingModule } from './info-hotel-routing.module';

import { InfoHotelPage } from './info-hotel.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoHotelPageRoutingModule
  ],
  declarations: [InfoHotelPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InfoHotelPageModule {}
