import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { RelojesMarcasService } from 'src/app/services/relojes-marcas.service';

@Component({
  selector: 'app-relojes-marcas',
  templateUrl: './relojes-marcas.component.html',
  styles: [
  ]
})
export class RelojesMarcasComponent implements OnInit {

  // Permisos de usuarios login
  public permisos = { all: false };

  // Modal
  public showModalMarca = false;

  // Estado formulario 
  public estadoFormulario = 'crear';

  // Marca
  public idMarca: number = 0;
  public marcas: any = [];
  public marcaSeleccionada: any;
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

  constructor(private relojesMarcasService: RelojesMarcasService,
    private authService: AuthService,
    private alertService: AlertService,
    private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Relojes - Marcas';
    // this.permisos.all = this.permisosUsuarioLogin();
    this.alertService.loading();
    this.listarMarcas();
  }

  // Asignar permisos de usuario login
  // permisosUsuarioLogin(): boolean {
  //   return this.authService.usuario.permisos.includes('CONFIGURACIONES_ALL') || this.authService.usuario.role === 'ADMIN_ROLE';
  // }

  // Abrir modal
  abrirModal(estado: string, marca: any = null): void {
    window.scrollTo(0, 0);
    this.reiniciarFormulario();
    this.descripcion = '';
    this.idMarca = 0;

    if (estado === 'editar') this.getMarca(marca);
    else this.showModalMarca = true;

    this.estadoFormulario = estado;
  }

  // Traer datos de marca
  getMarca(marca: any): void {
    this.alertService.loading();
    this.idMarca = marca.id;
    this.marcaSeleccionada = marca;
    this.relojesMarcasService.getMarca(marca.id).subscribe(({ marca }) => {
      this.descripcion = marca.descripcion;
      this.alertService.close();
      this.showModalMarca = true;
    }, ({ error }) => {
      this.alertService.errorApi(error);
    });
  }

  // Listar marcas
  listarMarcas(): void {
    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna
    }
    this.relojesMarcasService.listarMarcas(parametros)
      .subscribe(({ marcas }) => {
        this.marcas = marcas;
        this.showModalMarca = false;
        this.alertService.close();
      }, (({ error }) => {
        this.alertService.errorApi(error.msg);
      }));
  }

  // Nueva marca
  nuevaMarca(): void {

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

    this.relojesMarcasService.nuevaMarca(data).subscribe(() => {
      this.listarMarcas();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });

  }

  // Actualizar marca
  actualizarMarca(): void {

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

    this.relojesMarcasService.actualizarMarcas(this.idMarca, data).subscribe(() => {
      this.listarMarcas();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(marca: any): void {

    const { id, activo } = marca;

    if (!this.permisos.all) return this.alertService.info('Usted no tiene permiso para realizar esta acción');

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.relojesMarcasService.actualizarMarcas(id, { activo: !activo }).subscribe(() => {
            this.alertService.loading();
            this.listarMarcas();
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
    this.listarMarcas();
  }

}
