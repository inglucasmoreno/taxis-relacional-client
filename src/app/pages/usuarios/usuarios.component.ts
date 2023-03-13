import { Component, OnInit } from '@angular/core';

import { UsuariosService } from '../../services/usuarios.service';
import { AlertService } from '../../services/alert.service';
import { DataService } from 'src/app/services/data.service';

import { Usuario } from '../../models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  // Permisos
  public permiso_escritura: string[] = ['USUARIOS_ALL'];

  // Usuarios Listados
  public usuarios: Usuario[];
  public total = 0;

  // Paginacion
  public paginaActual: number = 1;
  public cantidadItems: number = 10;

  // Filtrado
  public filtro = {
    activo: 'true',
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: 'ASC',  // Asc (1) | Desc (-1)
    columna: 'apellido'
  }

  // Para reportes
  public totalReporte = 0;
  public usuariosReporte = [];

  constructor(
              public authService: AuthService,
              private usuariosService: UsuariosService,
              private alertService: AlertService,
              private dataService: DataService
            ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Usuarios' 
    this.alertService.loading();
    this.listarUsuarios(); 
  }

  // Listar usuarios
  listarUsuarios(): void {
    this.usuariosService.listarUsuarios({ 
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna 
     })
    .subscribe( resp => {
      const { usuarios, total } = resp;
      this.usuarios = usuarios;
      this.total = total;
      this.alertService.close();
    }, (({error}) => {
      this.alertService.close();
      this.alertService.errorApi(error.message);
    }));
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(usuario: Usuario): void {
    const { id, activo } = usuario;
      this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
          .then(({isConfirmed}) => {  
            if (isConfirmed) {
              this.alertService.loading();
              this.usuariosService.actualizarUsuario(id, {activo: !activo}).subscribe(() => {
                this.alertService.loading();
                this.listarUsuarios();
              }, ({error}) => {
                this.alertService.close();
                this.alertService.errorApi(error.message);
              });
            }
          });
  }
  
  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.paginaActual = 1;
    this.filtro.activo = activo;
  }

  // Filtrar por Parametro
  filtrarParametro(parametro: string): void{
    this.paginaActual = 1;
    this.filtro.parametro = parametro;
  }
  
  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 'ASC' ? 'DESC' : 'ASC'; 
    this.alertService.loading();
    this.listarUsuarios();
  }

}
