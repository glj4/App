import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroFechas'
})
export class FiltroFechasPipe implements PipeTransform {

  transform(arreglo: any[], dateInString: string, dateOutString: string): any[] {
    if (dateInString === '' || dateInString == undefined || dateOutString === '' || dateOutString == undefined) {
      return arreglo;
    }

    return arreglo.filter(item => {
      if (item.bookings.length == 0) {
        return arreglo;
      }
      else {
        let cont = 0;
        for (let booking of item.bookings) {
          const bookingDateInString = booking['startDatetime'];
          const bookingDateOutString = booking['endDatetime'];
          let bookingDateIn = undefined;
          if (bookingDateInString != undefined) {
            const day = bookingDateInString.split('/')[0];
            const month = bookingDateInString.split('/')[1];
            const year = bookingDateInString.split('/')[2];
            bookingDateIn = new Date(year, month-1, day);
          }
          let bookingDateOut = undefined;
          if (bookingDateOutString != undefined) {
            const day = bookingDateOutString.split('/')[0];
            const month = bookingDateOutString.split('/')[1];
            const year = bookingDateOutString.split('/')[2];
            bookingDateOut = new Date(year, month-1, day);
          }
          let dateIn = undefined;
          if (dateInString != undefined) {
            const day = Number.parseInt(dateInString.split('/')[0]);
            const month = Number.parseInt(dateInString.split('/')[1]);
            const year = Number.parseInt(dateInString.split('/')[2]);
            dateIn = new Date(year, month-1, day);
          }
          let dateOut = undefined;
          if (dateOutString != undefined) {
            const day = Number.parseInt(dateOutString.split('/')[0]);
            const month = Number.parseInt(dateOutString.split('/')[1]);
            const year = Number.parseInt(dateOutString.split('/')[2]);
            dateOut = new Date(year, month-1, day);
          }
          
          if (bookingDateIn == undefined || bookingDateOut == undefined) {
            return arreglo;
          }

          if ((dateIn.getTime() < bookingDateIn.getTime() && dateOut.getTime() < bookingDateIn.getTime()) ||
              (dateIn.getTime() > bookingDateOut.getTime() && dateOut.getTime() > bookingDateOut.getTime())) {
                if (cont < item.rooms) {
                  return arreglo;
                }
              }
              else {
                cont++;
              }
        }
      }
    });
  }

}
