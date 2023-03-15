import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from '../guards/auth.guard';
import { PermisosGuard } from '../guards/permisos.guard';

// Componentes
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';
import { EditarUsuarioComponent } from './usuarios/editar/editar-usuario.component';
import { EditarPasswordComponent } from './usuarios/editar/editar-password.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PersonasComponent } from './personas/personas.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { VehiculosColoresComponent } from './vehiculos/vehiculos-colores.component';
import { VehiculosMarcasComponent } from './vehiculos/vehiculos-marcas.component';
import { SegurosEmpresasComponent } from './seguros-empresas/seguros-empresas.component';
import { RelojesModelosComponent } from './relojes/relojes-modelos.component';
import { RelojesPrecintosMotivosComponent } from './relojes/relojes-precintos-motivos.component';
import { RelojesMarcasComponent } from './relojes/relojes-marcas.component';
import { VehiculosModelosComponent } from './vehiculos/vehiculos-modelos.component';
import { VehiculosSegurosComponent } from './vehiculos/vehiculos-seguros.component';
import { LicenciasComponent } from './licencias/licencias.component';
import { LicenciasDetallesComponent } from './licencias/licencias-detalles.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [ AuthGuard ],    // Guard - Se verifica si el usuario esta logueado
        children: [
            
            // Home
            { path: 'home', component: HomeComponent },

            // Perfil de usuarios
            { path: 'perfil', component: PerfilComponent },

            // Usuarios
            { path: 'usuarios', data: { permisos: 'USUARIOS_NAV' }, canActivate: [PermisosGuard], component: UsuariosComponent },
            { path: 'usuarios/nuevo', data: { permisos: 'USUARIOS_NAV' }, canActivate: [PermisosGuard], component: NuevoUsuarioComponent },
            { path: 'usuarios/editar/:id', data: { permisos: 'USUARIOS_NAV' }, canActivate: [PermisosGuard], component: EditarUsuarioComponent },
            { path: 'usuarios/password/:id', data: { permisos: 'USUARIOS_NAV' }, canActivate: [PermisosGuard], component: EditarPasswordComponent },
            
            // Personas
            { path: 'personas', data: { permisos: 'PERSONAS_NAV' }, canActivate: [PermisosGuard], component: PersonasComponent },

            // Vehiculos
            { path: 'vehiculos', data: { permisos: 'VEHICULOS_NAV' }, canActivate: [PermisosGuard], component: VehiculosComponent },

            { path: 'vehiculos-seguros/:id', data: { permisos: 'VEHICULOS_NAV' }, canActivate: [PermisosGuard], component: VehiculosSegurosComponent },

            { path: 'vehiculos-colores', data: { permisos: 'CONFIGURACIONES_NAV' }, canActivate: [PermisosGuard], component: VehiculosColoresComponent },

            { path: 'vehiculos-marcas', data: { permisos: 'CONFIGURACIONES_NAV' }, canActivate: [PermisosGuard], component: VehiculosMarcasComponent },

            { path: 'vehiculos-modelos/:marca', data: { permisos: 'CONFIGURACIONES_NAV' }, canActivate: [PermisosGuard], component: VehiculosModelosComponent }, 

            { path: 'seguros-empresas', data: { permisos: 'CONFIGURACIONES_NAV' }, canActivate: [PermisosGuard], component: SegurosEmpresasComponent }, 


            //Relojes
            { path: 'relojes-marcas', data: { permisos: 'CONFIGURACIONES_NAV' }, canActivate: [PermisosGuard], component: RelojesMarcasComponent }, 

            { path: 'relojes-modelos/:marca', data: { permisos: 'CONFIGURACIONES_NAV' }, canActivate: [PermisosGuard], component: RelojesModelosComponent }, 
            
            { path: 'relojes-precintos-motivos', data: { permisos: 'CONFIGURACIONES_NAV' }, canActivate: [PermisosGuard], component: RelojesPrecintosMotivosComponent}, 

            // Licencias
            { path: 'licencias', data: { permisos: 'LICENCIAS_NAV' }, canActivate: [PermisosGuard], component: LicenciasComponent}, 

            { path: 'licencias-detalles/:id', data: { permisos: 'LICENCIAS_NAV' }, canActivate: [PermisosGuard], component: LicenciasDetallesComponent}, 

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}