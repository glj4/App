import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-login_main',
  templateUrl: 'login_main.page.html',
  styleUrls: ['login_main.page.scss']
})

export class LoginMainPage implements OnInit {


  constructor(
    public route: Router,
    public _usuario: UsersService,
    public alertController: AlertController
  ) { }

  ngOnInit(): void {
    if (this._usuario.comprobarLogin()) {
      this.logout();
    }
  }

  logout(){
    localStorage.removeItem('token');
    this.route.navigate(['']);
  }
}