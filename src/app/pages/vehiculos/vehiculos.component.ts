import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { VehiculosColoresService } from 'src/app/services/vehiculos-colores.service';
import { VehiculosMarcasService } from 'src/app/services/vehiculos-marcas.service';
import { VehiculosModelosService } from 'src/app/services/vehiculos-modelos.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: []
})
export class VehiculosComponent implements OnInit {

  // Constantes
  public LIMIT_ANO = 1990;

  // Permisos de usuarios login
  public permisos = { all: false };

  // Modal
  public showModalVehiculo = false;
  public showModalTitulares = false;

  // Estado formulario 
  public estadoFormulario = 'crear';

  // Marcas
  public marcas: any[];

  // Colores
  public colores: any[];

  // Modelos
  public modelos: any[];

  // Vehiculo
  public idVehiculo: number = 0;
  public vehiculos: any = [];
  public vehiculoSeleccionado: any;

  public patente: string = '';
  public marca: string = '';
  public modelo: string = '';
  public motor: string = '';
  public chasis: string = '';
  public color: string = '';
  public ano: number = null;

  // Paginacion
  public totalItems: number;
  public desde: number = 0;
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
    columna: 'patente'
  }

  constructor(private vehiculosService: VehiculosService,
    private coloresService: VehiculosColoresService,
    private marcasService: VehiculosMarcasService,
    private modeloService: VehiculosModelosService,
    private authService: AuthService,
    private alertService: AlertService,
    private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Vehículos';
    // this.permisos.all = this.permisosUsuarioLogin();
    this.alertService.loading();
    this.cargaInicial();
  }

  cargaInicial(): void {
    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna
    }
    // Listar vehiculos
    this.vehiculosService.listarVehiculos(parametros)
      .subscribe(({ vehiculos, totalItems }) => {

        this.totalItems = totalItems;

        // Listar marcas
        this.marcasService.listarMarcas().subscribe({
          next: ({ marcas }) => {
            this.marcas = marcas;

            // Listar colores
            this.coloresService.listarColores().subscribe({
              next: ({ colores }) => {
                this.colores = colores;
                this.alertService.close();
              }, error: ({ error }) => this.alertService.errorApi(error.message)
            })

          },
          error: ({ error }) => this.alertService.errorApi(error)
        })
        this.vehiculos = vehiculos;
      }, (({ error }) => {
        this.alertService.errorApi(error.msg);
      }));
  }

  // Asignar permisos de usuario login
  // permisosUsuarioLogin(): boolean {
  //   return this.authService.usuario.permisos.includes('VEHICULOS_ALL') || this.authService.usuario.role === 'ADMIN_ROLE';
  // }

  // Abrir modal
  abrirModal(estado: string, vehiculo: any = null): void {
    window.scrollTo(0, 0);
    this.reiniciarFormulario();
    this.patente = '';
    this.marca = '';
    this.modelo = '';
    this.motor = '';
    this.chasis = '';
    this.color = '';

    this.idVehiculo = 0;

    if (estado === 'editar') this.getVehiculo(vehiculo);
    else this.showModalVehiculo = true;

    this.estadoFormulario = estado;
  }

  // Traer datos de vehiculo
  getVehiculo(vehiculo: any): void {
    this.alertService.loading();
    this.idVehiculo = vehiculo.id;
    this.vehiculoSeleccionado = vehiculo;
    this.vehiculosService.getVehiculo(vehiculo.id).subscribe(({ vehiculo }) => {

      console.log(vehiculo);

      this.patente = vehiculo.patente;
      this.marca = String(vehiculo.marca.id);
      this.modelo = String(vehiculo.modelo.id);
      this.motor = vehiculo.motor === '0' ? null : String(vehiculo.motor);
      this.chasis = vehiculo.chasis === '0' ? null : String(vehiculo.chasis);
      this.color = String(vehiculo.color.id);
      this.ano = vehiculo.ano;

      // Se listan los modelos
      this.modeloService.listarModelos({ marca: this.marca }).subscribe({
        next: ({ modelos }) => {
          this.modelos = modelos;
          this.showModalVehiculo = true;
          this.alertService.close();
        },
        error: ({ error }) => this.alertService.errorApi(error)
      })

    }, ({ error }) => {
      this.alertService.errorApi(error);
    });
  }

  // Listar vehiculo
  listarVehiculos(): void {
    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna,
      parametro: this.filtro.parametro,
      desde: this.desde,
      cantidadItems: this.cantidadItems
    }
    this.vehiculosService.listarVehiculos(parametros)
      .subscribe(({ vehiculos, totalItems }) => {
        this.vehiculos = vehiculos;
        this.totalItems = totalItems;
        this.showModalVehiculo = false;
        this.alertService.close();
      }, (({ error }) => {
        this.alertService.errorApi(error.msg);
      }));
  }

  // Nuevo vehiculo
  nuevoVehiculo(): void {

    // Verificacion: Patente vacia
    if (this.patente.trim() === "") {
      this.alertService.info('Debes colocar una patente');
      return;
    }

    // Verificacion: Marca vacia
    if (this.marca.trim() === "") {
      this.alertService.info('Debes colocar una marca');
      return;
    }

    // Verificacion: Modelo vacio
    if (this.modelo.trim() === "") {
      this.alertService.info('Debes colocar una modelo');
      return;
    }

    // Verificacion: Año vacio
    if (!this.ano || this.ano < this.LIMIT_ANO) {
      this.alertService.info('Debes colocar un año válido');
      return;
    }

    this.alertService.loading();

    const data = {
      patente: this.patente.replace('-', '').replace(' ', '').trim(),
      marca: this.marca,
      modelo: this.modelo,
      motor: this.motor,
      chasis: this.chasis,
      color: this.color,
      ano: this.ano,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.vehiculosService.nuevoVehiculo(data).subscribe(() => {
      this.listarVehiculos();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });

  }

  // Actualizar vehiculo
  actualizarVehiculo(): void {

    // Verificacion: Patente vacia
    if (this.patente.trim() === "") {
      this.alertService.info('Debes colocar una patente');
      return;
    }

    // Verificacion: Marca vacia
    if (this.marca.trim() === "") {
      this.alertService.info('Debes colocar una marca');
      return;
    }

    // Verificacion: Modelo vacio
    if (this.modelo.trim() === "") {
      this.alertService.info('Debes colocar una modelo');
      return;
    }

    // Verificacion: Año vacio
    if (!this.ano || this.ano < this.LIMIT_ANO) {
      this.alertService.info('Debes colocar una año válido');
      return;
    }

    this.alertService.loading();

    const data = {
      patente: this.patente.replace('-', '').replace(' ', '').trim(),
      marca: this.marca,
      modelo: this.modelo,
      motor: this.motor,
      chasis: this.chasis,
      color: this.color,
      ano: this.ano,
      updatorUser: this.authService.usuario.userId,
    }

    this.vehiculosService.actualizarVehiculo(this.idVehiculo, data).subscribe(() => {
      this.listarVehiculos();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(vehiculo: any): void {

    const { id, activo } = vehiculo;

    if (!this.permisos.all) return this.alertService.info('Usted no tiene permiso para realizar esta acción');

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.vehiculosService.actualizarVehiculo(id, { activo: !activo }).subscribe(() => {
            this.alertService.loading();
            this.listarVehiculos();
          }, ({ error }) => {
            this.alertService.close();
            this.alertService.errorApi(error.message);
          });
        }
      });

  }

  // Buscar modelos
  buscarModelos(): void {

    this.modelo = '';

    if (this.marca.trim() !== '') {
      this.alertService.loading();
      this.modeloService.listarModelos({ marca: this.marca }).subscribe({
        next: ({ modelos }) => {
          this.modelos = modelos;
          this.alertService.close();
        },
        error: ({ error }) => this.alertService.errorApi(error)
      })
    } else {
      this.modelos = [];
    }

  }

  // Abrir titulares
  abrirTitulares(): void {
    this.showModalVehiculo = false;
    this.showModalTitulares = true;
  }

  // Regresar a datos de vehiculo
  regresarVehiculo(): void {
    this.showModalVehiculo = true;
    this.showModalTitulares = false;
  }

  // Reiniciando formulario
  reiniciarFormulario(): void {
    this.patente = '';
    this.marca = '';
    this.modelo = '';
    this.motor = '';
    this.chasis = '';
    this.color = '';
    this.ano = null;
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
    this.listarVehiculos();
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
    this.listarVehiculos();
  }

}
