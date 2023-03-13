import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { VehiculosColoresService } from 'src/app/services/vehiculos-colores.service';

@Component({
  selector: 'app-vehiculos-colores',
  templateUrl: './vehiculos-colores.component.html',
  styles: [
  ]
})
export class VehiculosColoresComponent implements OnInit {

  // Permisos de usuarios login
  public permisos = { all: false };

  // Modal
  public showModalColor = false;

  // Estado formulario 
  public estadoFormulario = 'crear';

  // Color
  public idColor: number = 0;
  public colores: any = [];
  public colorSeleccionado: any;
  public descripcion: string = '';

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
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'descripcion'
  }

  constructor(private vehiculosColoresService: VehiculosColoresService,
    private authService: AuthService,
    private alertService: AlertService,
    private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Vehiculos - Colores';
    // this.permisos.all = this.permisosUsuarioLogin();
    this.alertService.loading();
    this.listarColores();
  }

  // Asignar permisos de usuario login
  // permisosUsuarioLogin(): boolean {
  //   return this.authService.usuario.permisos.includes('CONFIGURACIONES_ALL') || this.authService.usuario.role === 'ADMIN_ROLE';
  // }

  // Abrir modal
  abrirModal(estado: string, color: any = null): void {
    window.scrollTo(0, 0);
    this.reiniciarFormulario();
    this.descripcion = '';
    this.idColor = 0;

    if (estado === 'editar') this.getColor(color);
    else this.showModalColor = true;

    this.estadoFormulario = estado;
  }

  // Traer datos de color
  getColor(color: any): void {
    this.alertService.loading();
    this.idColor = color.id;
    this.colorSeleccionado = color;
    this.vehiculosColoresService.getColor(color.id).subscribe(({ color }) => {
      console.log(color);
      this.descripcion = color.descripcion;
      this.alertService.close();
      this.showModalColor = true;
    }, ({ error }) => {
      this.alertService.errorApi(error);
    });
  }

  // Listar colores
  listarColores(): void {
    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna
    }
    this.vehiculosColoresService.listarColores(parametros)
      .subscribe(({ colores }) => {
        this.colores = colores;
        this.showModalColor = false;
        this.alertService.close();
      }, (({ error }) => {
        this.alertService.errorApi(error.msg);
      }));
  }

  // Nuevo color
  nuevoColor(): void {

    // Verificacion: Descripción vacia
    if (this.descripcion.trim() === "") {
      this.alertService.info('Debes colocar una descripción');
      return;
    }

    this.alertService.loading();

    const data = {
      descripcion: this.descripcion,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.vehiculosColoresService.nuevoColor(data).subscribe(() => {
      this.listarColores();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });

  }

  // Actualizar color
  actualizarColor(): void {

    // Verificacion: Descripción vacia
    if (this.descripcion.trim() === "") {
      this.alertService.info('Debes colocar una descripción');
      return;
    }

    this.alertService.loading();

    const data = {
      descripcion: this.descripcion,
      updatorUser: this.authService.usuario.userId,
    }

    this.vehiculosColoresService.actualizarColores(this.idColor, data).subscribe(() => {
      this.listarColores();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(color: any): void {

    const { id, activo } = color;

    if (!this.permisos.all) return this.alertService.info('Usted no tiene permiso para realizar esta acción');

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.vehiculosColoresService.actualizarColores(id, { activo: !activo }).subscribe(() => {
            this.alertService.loading();
            this.listarColores();
          }, ({ error }) => {
            this.alertService.close();
            this.alertService.errorApi(error.message);
          });
        }
      });

  }

  // Reiniciando formulario
  reiniciarFormulario(): void {
    this.descripcion = '';
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void {
    this.paginaActual = 1;
    this.filtro.activo = activo;
  }

  // Filtrar por Parametro
  filtrarParametro(parametro: string): void {
    this.paginaActual = 1;
    this.filtro.parametro = parametro;
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string) {
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1;
    this.alertService.loading();
    this.listarColores();
  }

}
