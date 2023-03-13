import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { RelojesMarcasService } from 'src/app/services/relojes-marcas.service';
import { RelojesModelosService } from 'src/app/services/relojes-modelos.service';

@Component({
  selector: 'app-relojes-modelos',
  templateUrl: './relojes-modelos.component.html',
  styles: [
  ]
})
export class RelojesModelosComponent implements OnInit {

  // Marca
  public marca: any;
  public idMarca: number = 0;

  // Permisos de usuarios login
  public permisos = { all: false };

  // Modal
  public showModalModelo = false;

  // Estado formulario 
  public estadoFormulario = 'crear';

  // Modelo
  public idModelo: number = 0;
  public modelos: any = [];
  public modeloSeleccionado: any;
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

  constructor(
    private relojesModelosService: RelojesModelosService,
    private marcasService: RelojesMarcasService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Relojes - Modelos';
    // this.permisos.all = this.permisosUsuarioLogin();
    this.alertService.loading();
    this.activatedRoute.params.subscribe(({ marca }) => {
      this.idMarca = marca;
      this.marcasService.getMarca(marca).subscribe({
        next: ({ marca }) => {
          this.marca = marca;
          this.listarModelos();
        }, error: ({ error }) => this.alertService.errorApi(error.message)
      })
    });

  }

  // Asignar permisos de usuario login
  // permisosUsuarioLogin(): boolean {
  //   return this.authService.usuario.permisos.includes('CONFIGURACIONES_ALL') || this.authService.usuario.role === 'ADMIN_ROLE';
  // }

  // Abrir modal
  abrirModal(estado: string, modelo: any = null): void {
    window.scrollTo(0, 0);
    this.reiniciarFormulario();
    this.descripcion = '';
    this.idModelo = 0;

    if (estado === 'editar') this.getModelo(modelo);
    else this.showModalModelo = true;

    this.estadoFormulario = estado;
  }

  // Traer datos de modelo
  getModelo(modelo: any): void {
    this.alertService.loading();
    this.idModelo = modelo.id;
    this.modeloSeleccionado = modelo;
    this.relojesModelosService.getModelo(modelo.id).subscribe(({ modelo }) => {
      this.descripcion = modelo.descripcion;
      this.alertService.close();
      this.showModalModelo = true;
    }, ({ error }) => {
      this.alertService.errorApi(error);
    });
  }

  // Listar modelos
  listarModelos(): void {
    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna,
      marca: this.marca.id
    }
    this.relojesModelosService.listarModelos(parametros)
      .subscribe(({ modelos }) => {
        this.modelos = modelos;
        this.showModalModelo = false;
        this.alertService.close();
      }, (({ error }) => {
        this.alertService.errorApi(error.msg);
      }));
  }

  // Nuevo modelo
  nuevoModelo(): void {

    // Verificacion: Descripción vacia
    if (this.descripcion.trim() === "") {
      this.alertService.info('Debes colocar una descripción');
      return;
    }

    this.alertService.loading();

    const data = {
      descripcion: this.descripcion,
      marca: this.idMarca,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.relojesModelosService.nuevoModelo(data).subscribe(() => {
      this.listarModelos();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });

  }

  // Actualizar modelo
  actualizarModelo(): void {

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

    this.relojesModelosService.actualizarModelos(this.idModelo, data).subscribe(() => {
      this.listarModelos();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(modelo: any): void {

    const { id, activo } = modelo;

    if (!this.permisos.all) return this.alertService.info('Usted no tiene permiso para realizar esta acción');

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.relojesModelosService.actualizarModelos(id, { activo: !activo }).subscribe(() => {
            this.alertService.loading();
            this.listarModelos();
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
    this.listarModelos();
  }

}
