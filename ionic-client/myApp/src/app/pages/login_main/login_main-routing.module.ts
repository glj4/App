import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginMainPage } from './login_main.page';

const routes: Routes = [
  {
    path: '',
    component: LoginMainPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginMainPageRoutingModule {}
