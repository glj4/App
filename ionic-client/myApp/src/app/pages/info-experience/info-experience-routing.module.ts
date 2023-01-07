import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoExperiencePage } from './info-experience.page';

const routes: Routes = [
  {
    path: '',
    component: InfoExperiencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoExperiencePageRoutingModule {}
