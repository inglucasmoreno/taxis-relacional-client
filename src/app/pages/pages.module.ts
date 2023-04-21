import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';
import { PipesModule } from '../pipes/pipes.module';
import { ComponentsModule } from '../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditarUsuarioComponent } from './usuarios/editar/editar-usuario.component';
import { EditarPasswordComponent } from './usuarios/editar/editar-password.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DirectivesModule } from '../directives/directives.module';
import { PerfilComponent } from './perfil/perfil.component';
import { PersonasComponent } from './personas/personas.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { VehiculosColoresComponent } from './vehiculos/vehiculos-colores.component';
import { VehiculosMarcasComponent } from './vehiculos/vehiculos-marcas.component';
import { SegurosEmpresasComponent } from './seguros-empresas/seguros-empresas.component';
import { RelojesComponent } from './relojes/relojes.component';
import { RelojesPrecintosMotivosComponent } from './relojes/relojes-precintos-motivos.component';
import { RelojesMarcasComponent } from './relojes/relojes-marcas.component';
import { RelojesModelosComponent } from './relojes/relojes-modelos.component';
import { VehiculosModelosComponent } from './vehiculos/vehiculos-modelos.component';
import { VehiculosSegurosComponent } from './vehiculos/vehiculos-seguros.component';
import { LicenciasComponent } from './licencias/licencias.component';
import { LicenciasDetallesComponent } from './licencias/licencias-detalles.component';
import { VehiculosTitularesComponent } from './vehiculos/vehiculos-titulares.component';
import { CambioUnidadComponent } from './licencias/cambio-unidad.component';
import { TransferenciaContinuandoComponent } from './licencias/transferencia-continuando.component';
import { TransferenciaCambioUnidadComponent } from './licencias/transferencia-cambio-unidad.component';
import { TiposServiciosComponent } from './tipos-servicios/tipos-servicios.component';


@NgModule({
  declarations: [
    HomeComponent,
    PagesComponent,
    UsuariosComponent,
    NuevoUsuarioComponent,
    EditarUsuarioComponent,
    EditarPasswordComponent,
    PerfilComponent,
    PersonasComponent,
    VehiculosComponent,
    VehiculosColoresComponent,
    VehiculosMarcasComponent,
    SegurosEmpresasComponent,
    RelojesComponent,
    RelojesPrecintosMotivosComponent,
    RelojesMarcasComponent,
    RelojesModelosComponent,
    VehiculosModelosComponent,
    VehiculosSegurosComponent,
    LicenciasComponent,
    LicenciasDetallesComponent,
    VehiculosTitularesComponent,
    CambioUnidadComponent,
    TransferenciaContinuandoComponent,
    TransferenciaCambioUnidadComponent,
    TiposServiciosComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    DirectivesModule,
    SharedModule,
    PipesModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FormsModule,
    DirectivesModule
  ]
})
export class PagesModule { }
