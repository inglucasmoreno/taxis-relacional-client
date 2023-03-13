import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SegurosEmpresasService } from 'src/app/services/seguros-empresas.service';

@Component({
  selector: 'app-seguros-empresas',
  templateUrl: './seguros-empresas.component.html',
  styles: [
  ]
})
export class SegurosEmpresasComponent implements OnInit {

  // Permisos de usuarios login
  public permisos = { all: false };

  // Modal
  public showModalEmpresa = false;

  // Estado formulario 
  public estadoFormulario = 'crear';

  // Empresa
  public idEmpresa: number = 0;
  public empresas: any = [];
  public empresaSeleccionada: any;
  public descripcion: string = '';
  public direccion: string = '';
  public telefono: string = '';

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

  constructor(private segurosEmpresasService: SegurosEmpresasService,
    private authService: AuthService,
    private alertService: AlertService,
    private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Empresas de seguros';
    // this.permisos.all = this.permisosUsuarioLogin();
    this.alertService.loading();
    this.listarEmpresas();
  }

  // Asignar permisos de usuario login
  // permisosUsuarioLogin(): boolean {
  //   return this.authService.usuario.permisos.includes('SEGUROS_EMPRESAS_ALL') || this.authService.usuario.role === 'ADMIN_ROLE';
  // }

  // Abrir modal
  abrirModal(estado: string, empresa: any = null): void {
    window.scrollTo(0, 0);
    this.reiniciarFormulario();
    this.descripcion = '';
    this.telefono = '';
    this.direccion = '';
    this.idEmpresa = 0;

    if (estado === 'editar') this.getEmpresa(empresa);
    else this.showModalEmpresa = true;

    this.estadoFormulario = estado;
  }

  // Traer datos de empresa
  getEmpresa(empresa: any): void {
    this.alertService.loading();
    this.idEmpresa = empresa.id;
    this.empresaSeleccionada = empresa;
    this.segurosEmpresasService.getEmpresa(empresa.id).subscribe(({ empresa }) => {
      this.descripcion = empresa.descripcion;
      this.direccion = empresa.direccion;
      this.telefono = empresa.telefono;
      this.alertService.close();
      this.showModalEmpresa = true;
    }, ({ error }) => {
      this.alertService.errorApi(error);
    });
  }

  // Listar empresas
  listarEmpresas(): void {
    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna
    }
    this.segurosEmpresasService.listarEmpresas(parametros)
      .subscribe(({ empresas }) => {
        this.empresas = empresas;
        this.showModalEmpresa = false;
        this.alertService.close();
      }, (({ error }) => {
        this.alertService.errorApi(error.msg);
      }));
  }

  // Nueva empresa
  nuevaEmpresa(): void {

    // Verificacion: Descripción vacia
    if (this.descripcion.trim() === "") {
      this.alertService.info('Debes colocar una razón social');
      return;
    }

    // Verificacion: Direccion vacia
    if (this.direccion.trim() === "") {
      this.alertService.info('Debes colocar una dirección');
      return;
    }

    // Verificacion: Telefono vacio
    if (this.telefono.trim() === "") {
      this.alertService.info('Debes colocar un número de teléfono');
      return;
    }

    this.alertService.loading();

    const data = {
      descripcion: this.descripcion,
      direccion: this.direccion,
      telefono: this.telefono,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.segurosEmpresasService.nuevaEmpresa(data).subscribe(() => {
      this.listarEmpresas();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });

  }

  // Actualizar empresa
  actualizarEmpresa(): void {

    // Verificacion: Descripción vacia
    if (this.descripcion.trim() === "") {
      this.alertService.info('Debes colocar una razón social');
      return;
    }

    // Verificacion: Direccion vacia
    if (this.direccion.trim() === "") {
      this.alertService.info('Debes colocar una dirección');
      return;
    }

    // Verificacion: Telefono vacio
    if (this.telefono.trim() === "") {
      this.alertService.info('Debes colocar un número de telefono');
      return;
    }

    this.alertService.loading();

    const data = {
      descripcion: this.descripcion,
      direccion: this.direccion,
      telefono: this.telefono,
      updatorUser: this.authService.usuario.userId,
    }

    this.segurosEmpresasService.actualizarEmpresa(this.idEmpresa, data).subscribe(() => {
      this.listarEmpresas();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(empresa: any): void {

    const { id, activo } = empresa;

    if (!this.permisos.all) return this.alertService.info('Usted no tiene permiso para realizar esta acción');

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.segurosEmpresasService.actualizarEmpresa(id, { activo: !activo }).subscribe(() => {
            this.alertService.loading();
            this.listarEmpresas();
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
    this.listarEmpresas();
  }

}
