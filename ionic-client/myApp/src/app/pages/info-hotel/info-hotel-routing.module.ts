import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoHotelPage } from './info-hotel.page';

const routes: Routes = [
  {
    path: '',
    component: InfoHotelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoHotelPageRoutingModule {}
