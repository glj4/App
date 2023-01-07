import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // Creo una variable http de tipo HttpClient para poder usar las peticiones get, post, put y delete
  constructor(public http:HttpClient) { }

  // Llama al método getUsuarios de nuestra API, el cual muestra una lista de todos los usuarios que hay en la base de datos
  getUsuarios(){
    return this.http.get("http://localhost:3000/api/users/")
  }

  getUserByEmail(email: string){
    return this.http.get("http://localhost:3000/api/users/" + email);
  }

  deleteUser(id: any) {
    return this.http.delete("http://localhost:3000/api/users/" + id);
  }

  editUser(id: any, forma: any) {
    return this.http.put("http://localhost:3000/api/users/" + id, forma);
  }

  // Llama al método login de nuestra API, el cual comprueba que el email y la contraseña que introducimos
  // son iguales que los que tenemos en nuestra base de datos
  login(forma:any){
    return this.http.post("http://localhost:3000/api/login", forma)
  }

  register(forma:any) {
    return this.http.post("http://localhost:3000/api/register", forma)
  }

  forgotPassword(forma:any) {
    return this.http.put("http://localhost:3000/api/forgot-password", forma)
  }

  newPassword(forma:any) {
    return this.http.put("http://localhost:3000/api/new-password", forma)
  }

  // Método que comprueba si estamos logueados
  comprobarLogin(){
    if(localStorage.getItem('token')){
      return true;
    }
    else{
      return false;
    }
  }
}