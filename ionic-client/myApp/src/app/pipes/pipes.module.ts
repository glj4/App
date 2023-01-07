import { NgModule } from '@angular/core';
import { FiltroPipe } from './filtro.pipe';
import { FiltroFechasPipe } from './filtro-fechas.pipe';
import { FiltroViajerosPipe } from './filtro-viajeros.pipe';
import { FiltroFechasCasaPipe } from './filtro-fechas-casa.pipe';

@NgModule({
  declarations: [FiltroPipe, FiltroFechasPipe, FiltroViajerosPipe, FiltroFechasCasaPipe],
  exports: [FiltroPipe, FiltroFechasPipe, FiltroViajerosPipe, FiltroFechasCasaPipe]
})
export class PipesModule { }
