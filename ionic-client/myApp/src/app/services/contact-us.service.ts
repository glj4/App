import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(public http:HttpClient) { }

  contactUs(email:any, phone:any, textarea:any) {
    return this.http.put("http://localhost:3000/api/contact-us/", {email, phone, textarea});
  }
}
