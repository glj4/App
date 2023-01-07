import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hotel } from '../models/hotel.interface';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {

  private Id: string;
  private hotels: Hotel[] = [];
  private dateIn: string = undefined;
  private dateOut: string = undefined;

  constructor(public http:HttpClient) { }

  getHotels(){
    return this.http.get("http://localhost:3000/api/hotels/")
  }

  getHotel(id:any){
    return this.http.get("http://localhost:3000/api/hotels/" + id)
  }

  createHotel(forma:any){
    return this.http.post("http://localhost:3000/api/hotels/", forma, {responseType: 'text'} );
  }

  updateHotel(id:any, forma:any){
    return this.http.put("http://localhost:3000/api/hotels/" + id, forma, {responseType: 'text'} );
  }

  deleteHotel(id:any){
    return this.http.delete("http://localhost:3000/api/hotels/" + id)
  }

  setHotelId(id: any) {
    this.Id = id;
  }

  getHotelId() {
    return this.Id;
  }

  addFavourite(hotel: Hotel) {
    this.hotels.push(hotel);
  }

  getFavourites() {
    return this.hotels;
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