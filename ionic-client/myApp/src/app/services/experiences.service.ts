import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExperiencesService {

  constructor(public http:HttpClient) { }

  getExperiences(){
    return this.http.get("http://localhost:3000/api/experiences/")
  }

  getExperience(id:any){
    return this.http.get("http://localhost:3000/api/experiences/" + id)
  }

  createExperience(forma:any){
    return this.http.post("http://localhost:3000/api/experiences/", forma, {responseType: 'text'} );
  }

  updateExperience(id:any, forma:any){
    return this.http.put("http://localhost:3000/api/experiences/" + id, forma, {responseType: 'text'} );
  }

  deleteExperience(id:any){
    return this.http.delete("http://localhost:3000/api/experiences/" + id)
  }
}
