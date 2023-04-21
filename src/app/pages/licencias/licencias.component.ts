import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { LicenciasService } from 'src/app/services/licencias.service';
import { TiposServiciosService } from 'src/app/services/tipos-servicios.service';

@Component({
  selector: 'app-licencias',
  templateUrl: './licencias.component.html',
  styles: [
  ]
})
export class LicenciasComponent implements OnInit {

  // Modal
  public showModalLicencia = false;

  // Estado formulario 
  public estadoFormulario = 'crear';

  // Licencia
  public nro_licencia: string = '';
  public tipo_servicio: string = '';
  public idLicencia: number = 0;
  public licencias: any = [];

  // Licencia seleccionada
  public licenciaSeleccionada: any;

  // Paginacion
  public totalItems: number;
  public desde: number = 0;
  public paginaActual: number = 1;
  public cantidadItems: number = 10;

  // Tipos de servicios
  public tipos_servicios: any[] = [];

  // Filtrado
  public filtro = {
    estado: 'Habilitada',
    tipo_servicio: '',
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'nro_licencia'
  }

  constructor(
    private licenciasService: LicenciasService,
    private tiposServiciosService: TiposServiciosService,
    public authService: AuthService,
    private alertService: AlertService,
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Licencias';
    this.valoresIniciales();
  }

  // Valores iniciales
  valoresIniciales(): void {
    this.alertService.loading();
    this.tiposServiciosService.listarTipos().subscribe({
      next: ({tipos}) => {
        this.tipos_servicios = tipos;
        this.listarLicencias();
      }, error: ({error}) => this.alertService.errorApi(error.message)
    })
  }

  // Abrir modal
  abrirModal(estado: string, licencia: any = null): void {

    this.nro_licencia = '';
    this.tipo_servicio = '';
    this.idLicencia = 0;
    this.reiniciarFormulario();
    
    if (estado === 'editar') this.getLicencia(licencia);
    else this.showModalLicencia = true;
    
    this.estadoFormulario = estado;
    window.scrollTo(0, 0);

  }

  // Traer datos de licencia
  getLicencia(licencia: any): void {
    this.alertService.loading();
    this.idLicencia = licencia.id;
    this.licenciaSeleccionada = licencia;
    this.licenciasService.getLicencia(licencia.id).subscribe(({ licencia }) => {
      this.nro_licencia = licencia.nro_licencia;
      this.tipo_servicio = licencia.tipo_servicio.id;
      this.alertService.close();
      this.showModalLicencia = true;
    }, ({ error }) => {
      this.alertService.errorApi(error);
    });
  }

  // Listar licencias
  listarLicencias(): void {
    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna,
      tipo_servicio: this.filtro.tipo_servicio,
      parametro: this.filtro.parametro,
      estado: this.filtro.estado
    }
    this.licenciasService.listarLicencias(parametros)
      .subscribe(({ licencias, totalItems }) => {
        this.licencias = licencias;
        this.totalItems = totalItems;
        this.showModalLicencia = false;
        this.alertService.close();
      }, (({ error }) => {
        this.alertService.errorApi(error.msg);
      }));
  }

  // Nueva licencia
  nuevaLicencia(): void {

    // Verificacion: Numero de licencia vacia
    if (this.nro_licencia.trim() === "") {
      this.alertService.info('Debes colocar un número de licencia');
      return;
    }

    // Verificacion: Tipo de servicio
    if (this.tipo_servicio === "") {
      this.alertService.info('Debes seleccionar un tipo de servicio');
      return;
    }

    this.alertService.loading();

    const data = {
      nro_licencia: this.nro_licencia,
      tipo_servicio: this.tipo_servicio,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.licenciasService.nuevaLicencia(data).subscribe(({ licencia }) => {
      this.router.navigateByUrl(`dashboard/licencias/detalles/${licencia.id}`);
      this.alertService.close();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });

  }

  // Actualizar licencia
  actualizarLicencia(): void {

    // Verificacion: Numero de licencia vacia
    if (this.nro_licencia.trim() === "") {
      this.alertService.info('Debes colocar un número de licencia');
      return;
    }

    // Verificacion: Tipo de servicio
    if (this.tipo_servicio === "") {
      this.alertService.info('Debes seleccionar un tipo de servicio');
      return;
    }

    this.alertService.loading();

    const data = {
      nro_licencia: this.nro_licencia,
      tipo_servicio: this.tipo_servicio,
      updatorUser: this.authService.usuario.userId,
    }

    this.licenciasService.actualizarLicencias(this.idLicencia, data).subscribe(() => {
      this.listarLicencias();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(licencia: any): void {

    const { _id, activo } = licencia;

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.licenciasService.actualizarLicencias(_id, { activo: !activo }).subscribe(() => {
            this.alertService.loading();
            this.listarLicencias();
          }, ({ error }) => {
            this.alertService.close();
            this.alertService.errorApi(error.message);
          });
        }
      });

  }

  // Reiniciando formulario
  reiniciarFormulario(): void {
    this.nro_licencia = '';
    this.tipo_servicio = '';
  }

  // Filtrar por estado
  filtrarEstado(estado: any): void {
    this.paginaActual = 1;
    this.filtro.estado = estado;
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
    this.listarLicencias();
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
    this.listarLicencias();
  }

}
