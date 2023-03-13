import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaPipe } from './fecha.pipe';
import { RolPipe } from './rol.pipe';
import { MonedaPipe } from './moneda.pipe';
import { FiltroUsuariosPipe } from './filtro-usuarios.pipe';
import { FiltroChoferesPipe } from './filtro-choferes.pipe';
import { FiltroColoresPipe } from './filtro-colores.pipe';
import { FiltroLicenciasPipe } from './filtro-licencias.pipe';
import { FiltroMarcasPipe } from './filtro-marcas.pipe';
import { FiltroModelosPipe } from './filtro-modelos.pipe';
import { FiltroPermisionariosPipe } from './filtro-permisionarios.pipe';
import { FiltroPrecintosMotivosPipe } from './filtro-precintos-motivos.pipe';
import { FiltroRelojesMarcasPipe } from './filtro-relojes-marcas.pipe';
import { FiltroRelojesModelosPipe } from './filtro-relojes-modelos.pipe';
import { FiltroSegurosEmpresasPipe } from './filtro-seguros-empresas.pipe';
import { FiltroSegurosPipe } from './filtro-seguros.pipe';
import { FiltroVehiculosPipe } from './filtro-vehiculos.pipe';
import { FiltroPersonasPipe } from './filtro-personas.pipe';

@NgModule({
  declarations: [
    FechaPipe,
    RolPipe,
    MonedaPipe,
    FiltroUsuariosPipe,
    FiltroChoferesPipe,
    FiltroColoresPipe,
    FiltroLicenciasPipe,
    FiltroMarcasPipe,
    FiltroModelosPipe,
    FiltroPermisionariosPipe,
    FiltroPrecintosMotivosPipe,
    FiltroRelojesMarcasPipe,
    FiltroRelojesModelosPipe,
    FiltroSegurosEmpresasPipe,
    FiltroSegurosPipe,
    FiltroVehiculosPipe,
    FiltroPersonasPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FechaPipe,
    RolPipe,
    MonedaPipe,
    FiltroUsuariosPipe,
    FiltroChoferesPipe,
    FiltroColoresPipe,
    FiltroLicenciasPipe,
    FiltroMarcasPipe,
    FiltroModelosPipe,
    FiltroPermisionariosPipe,
    FiltroPrecintosMotivosPipe,
    FiltroRelojesMarcasPipe,
    FiltroRelojesModelosPipe,
    FiltroSegurosEmpresasPipe,
    FiltroSegurosPipe,
    FiltroVehiculosPipe,
    FiltroPersonasPipe,
  ]
})
export class PipesModule { }
