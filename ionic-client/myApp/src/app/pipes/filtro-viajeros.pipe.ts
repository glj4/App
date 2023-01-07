import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroViajeros'
})
export class FiltroViajerosPipe implements PipeTransform {

  transform(arreglo: any[], numero: number, columna: string): any[] {
    if (numero == undefined) {
      return arreglo;
    }

    return arreglo.filter(item => {
      return item[columna] >= numero;
    });
  }
}
