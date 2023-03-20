import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import gsap from 'gsap';
import { SegurosEmpresasService } from 'src/app/services/seguros-empresas.service';
import { VehiculosSegurosService } from 'src/app/services/vehiculos-seguros.service';

@Component({
  selector: 'app-vehiculos-seguros',
  templateUrl: './vehiculos-seguros.component.html',
  styles: [
  ]
})
export class VehiculosSegurosComponent implements OnInit {

  // Permisos de usuarios login
  public permisos = { all: false };

  // Modal
  public showModalSeguro = false;

  // Estado formulario 
  public estadoFormulario = 'crear';

  // Seguro
  public idSeguro: number = 0;
  public seguros: any = [];
  public seguroActivo: any;
  public seguroSeleccionado: any;

  // Data
  public empresa: string = '';
  public nro_poliza: string = '';
  public fecha_desde: string = '';
  public fecha_hasta: string = '';

  // Paginacion
  public totalItems: number;
  public desde: number = 0;
  public paginaActual: number = 1;
  public cantidadItems: number = 10;
  // Empresas de seguro
  public empresas: any[] = [];

  // Vehiculo
  public idVehiculo: number;

  // Filtrado
  public filtro = {
    activo: 'true',
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }

  constructor(private vehiculosSegurosService: VehiculosSegurosService,
    private segurosEmpresasService: SegurosEmpresasService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService,
    private dataService: DataService) { }

  ngOnInit(): void {
    gsap.from('.gsap-contenido', { y: 100, opacity: 0, duration: .2 });
    this.dataService.ubicacionActual = 'Dashboard - Vehiculos - Seguros';
    // this.permisos.all = this.permisosUsuarioLogin();
    this.alertService.loading();
    this.cargaInicial();
    // this.listarSeguros(); 
  }

  // Carga inicial
  cargaInicial(): void {

    // Obtencion de IP
    this.activatedRoute.params.subscribe(({ id }) => {

      this.idVehiculo = id;

      const parametros = {
        direccion: -1,
        columna: 'createdAt',
        vehiculo: this.idVehiculo
      }

      // Listado de seguros    
      this.vehiculosSegurosService.listarSeguros(parametros).subscribe({
        next: ({ seguros, totalItems, seguroActivo }) => {
          this.seguros = seguros;
          this.totalItems = totalItems;
          this.seguroActivo = seguroActivo;
          this.alertService.close();
        }, error: ({ error }) => this.alertService.errorApi(error.message)
      });
    });

  }

  // Asignar permisos de usuario login
  // permisosUsuarioLogin(): boolean {
  //   return this.authService.usuario.permisos.includes('VEHICULOS_SEGUROS_ALL') || this.authService.usuario.role === 'ADMIN_ROLE';
  // }

  // Abrir modal
  abrirModal(estado: string): void {

    this.alertService.loading();

    // Se listan las empresas de seguros
    this.segurosEmpresasService.listarEmpresas().subscribe({
      next: ({ empresas }) => {
        this.empresas = empresas;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

    window.scrollTo(0, 0);
    this.reiniciarFormulario();
    this.empresa = '';
    this.nro_poliza = '';
    this.fecha_desde = '';
    this.fecha_hasta = '';
    this.nro_poliza = '';
    this.idSeguro = 0;

    if (estado === 'editar') this.getSeguro();
    else this.showModalSeguro = true;

    this.estadoFormulario = estado;
  }

  // Traer datos de seguro
  getSeguro(): void {
    this.alertService.loading();
    this.seguroSeleccionado = this.seguroActivo;
    this.vehiculosSegurosService.getSeguro(this.seguroSeleccionado.id).subscribe(({ seguro }) => {
      this.empresa = seguro.empresa.id;
      this.nro_poliza = seguro.nro_poliza;
      this.fecha_desde = format(new Date(seguro.fecha_desde), 'yyyy-MM-dd');
      this.fecha_hasta = format(new Date(seguro.fecha_hasta), 'yyyy-MM-dd');
      this.alertService.close();
      this.showModalSeguro = true;
    }, ({ error }) => {
      this.alertService.errorApi(error);
    });
  }

  // Listar seguros
  listarSeguros(): void {
    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna,
      vehiculo: this.idVehiculo,
      parametro: this.filtro.parametro,
      desde: this.desde,
      cantidadItems: this.cantidadItems
    }
    this.vehiculosSegurosService.listarSeguros(parametros)
      .subscribe(({ seguros, totalItems,seguroActivo }) => {
        this.seguros = seguros;
        this.totalItems = totalItems;
        this.seguroActivo = seguroActivo;
        this.showModalSeguro = false;
        this.alertService.close();
      }, (({ error }) => {
        this.alertService.errorApi(error.msg);
      }));
  }

  // Nuevo seguro
  nuevoSeguro(): void {

    // Verificacion: Empresa
    if (this.empresa.trim() === "") {
      this.alertService.info('Debes colocar una empresa');
      return;
    }

    // Verificacion: Número de poliza vacia
    if (this.nro_poliza.trim() === "") {
      this.alertService.info('Debes colocar un número de poliza');
      return;
    }

    // Verificacion: fecha desde
    if (this.fecha_desde.trim() === "") {
      this.alertService.info('Debes colocar una fecha inicial');
      return;
    }

    // Verificacion: fecha hasta
    if (this.fecha_hasta.trim() === "") {
      this.alertService.info('Debes colocar una fecha final');
      return;
    }

    this.alertService.loading();

    const data = {
      empresa: this.empresa,
      vehiculo: this.idVehiculo,
      nro_poliza: this.nro_poliza,
      fecha_desde: this.fecha_desde,
      fecha_hasta: this.fecha_hasta,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.vehiculosSegurosService.nuevoSeguro(data).subscribe(() => {
      this.listarSeguros();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });

  }

  // Actualizar seguro
  actualizarSeguro(): void {

    // Verificacion: Empresa
    if (this.empresa.toString().trim() === "") {
      this.alertService.info('Debes colocar una empresa');
      return;
    }

    // Verificacion: Número de poliza vacia
    if (this.nro_poliza.trim() === "") {
      this.alertService.info('Debes colocar un número de poliza');
      return;
    }

    // Verificacion: fecha desde
    if (this.fecha_desde.trim() === "") {
      this.alertService.info('Debes colocar una fecha inicial');
      return;
    }

    // Verificacion: fecha hasta
    if (this.fecha_hasta.trim() === "") {
      this.alertService.info('Debes colocar una fecha final');
      return;
    }

    this.alertService.loading();

    const data = {
      empresa: this.empresa,
      nro_poliza: this.nro_poliza,
      fecha_desde: this.fecha_desde,
      fecha_hasta: this.fecha_hasta,
      updatorUser: this.authService.usuario.userId,
    }

    this.vehiculosSegurosService.actualizarSeguro(this.seguroActivo.id, data).subscribe(() => {
      this.listarSeguros();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(seguro: any): void {

    const { id, activo } = seguro;

    if (!this.permisos.all) return this.alertService.info('Usted no tiene permiso para realizar esta acción');

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.vehiculosSegurosService.actualizarSeguro(id, { activo: !activo }).subscribe(() => {
            this.alertService.loading();
            this.listarSeguros();
          }, ({ error }) => {
            this.alertService.close();
            this.alertService.errorApi(error.message);
          });
        }
      });

  }

  // Reiniciando formulario
  reiniciarFormulario(): void {
    this.empresa = '',
      this.nro_poliza = '',
      this.fecha_desde = '',
      this.fecha_hasta = ''
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
    this.listarSeguros();
  }

  // Cambiar cantidad de items
  cambiarCantidadItems(): void {
    this.paginaActual = 1
    this.cambiarPagina(1);
  }

  // Paginacion - Cambiar pagina
  cambiarPagina(nroPagina): void {
    this.paginaActual = nroPagina;
    this.desde = (this.paginaActual - 1) * this.cantidadItems;
    this.alertService.loading();
    this.listarSeguros();
  }

}
