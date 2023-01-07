import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { House } from '../models/house.interface';

@Injectable({
  providedIn: 'root'
})
export class HousesService {

  private Id: string;
  private houses: House[] = [];
  private dateIn: string;
  private dateOut: string;
  
  constructor(public http:HttpClient) { }

  getHouses(){
    return this.http.get("http://localhost:3000/api/houses/")
  }

  getHouse(id:any){
    return this.http.get("http://localhost:3000/api/houses/" + id)
  }

  createHouse(forma:any){
    return this.http.post("http://localhost:3000/api/houses/", forma, {responseType: 'text'} );
  }

  updateHouse(id:any, forma:any){
    return this.http.put("http://localhost:3000/api/houses/" + id, forma, {responseType: 'text'} );
  }

  deleteHouse(id:any){
    return this.http.delete("http://localhost:3000/api/houses/" + id)
  }

  setHouseId(id: any) {
    this.Id = id;
  }

  getHouseId() {
    return this.Id;
  }
  
  addFavourite(house: House) {
    this.houses.push(house);
  }

  getFavourites() {
    return this.houses;
  }

  setDateIn(date: string) {
    this.dateIn = date;
  }

  getDateIn() {
    return this.dateIn;
  }

  setDateOut(date: string) {
    this.dateOut = date;
  }

  getDateOut() {
    return this.dateOut;
  }
}
