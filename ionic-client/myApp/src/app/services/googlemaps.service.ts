import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GooglemapsService {

  apiKey = environment.mapsKey;
  mapsLoaded = false;

  constructor() {}

  init(renderer: any, document: any): Promise<any> {
    return new Promise((resolve) => {
      if (this.mapsLoaded) {
        console.log('google estaba previamente cargado');
        resolve(true);
        return;
      }

      const script = renderer.createElement('script');
      script.id = 'googleMaps';

      window['mapInit'] = () => {
        this.mapsLoaded = true;
        if (google) {
          console.log('google está cargado');
        } else {
          console.log('google no está definido');
        }
        resolve(true);
        return;
      }

      if (this.apiKey) {
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
      } else {
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=mapInit';
      }

      renderer.appendChild(document.body, script);
    });
  }

  finish(renderer: any, document: any): Promise<any> {
    return new Promise((resolve) => {
      this.mapsLoaded = false;
      renderer = undefined;
      document = undefined;
      resolve(true);
    });
  }
}
