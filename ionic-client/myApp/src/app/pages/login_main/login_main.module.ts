import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginMainPage } from './login_main.page';

import { LoginMainPageRoutingModule } from './login_main-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LoginMainPageRoutingModule
  ],
  declarations: [LoginMainPage]
})
export class LoginMainPageModule {}
