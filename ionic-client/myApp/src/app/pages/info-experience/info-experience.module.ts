import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoExperiencePageRoutingModule } from './info-experience-routing.module';

import { InfoExperiencePage } from './info-experience.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoExperiencePageRoutingModule
  ],
  declarations: [InfoExperiencePage]
})
export class InfoExperiencePageModule {}
