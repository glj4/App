import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    public _usuario: UsersService,
    public router: Router
  ) { }

  async canActivate() {
    if(this._usuario.comprobarLogin()){
      return true;
    }
    else{
      this.router.navigate(['/login']);
      return false;
    }
  }
}