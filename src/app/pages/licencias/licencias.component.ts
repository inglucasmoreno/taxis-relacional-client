import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { LicenciasPermisionariosService } from 'src/app/services/licencias-permisionarios.service';
import { LicenciasVehiculosService } from 'src/app/services/licencias-vehiculos.service';
import { LicenciasService } from 'src/app/services/licencias.service';
import { PersonasService } from 'src/app/services/personas.service';
import { VehiculosColoresService } from 'src/app/services/vehiculos-colores.service';
import { VehiculosMarcasService } from 'src/app/services/vehiculos-marcas.service';
import { VehiculosModelosService } from 'src/app/services/vehiculos-modelos.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';


@Component({
  selector: 'app-licencias',
  templateUrl: './licencias.component.html',
  styles: [
  ]
})
export class LicenciasComponent implements OnInit {

  // Modal
  public showModalAsignarVehiculo = false;
  public showModalAsignarPermisionario = false;
  public showModalAsignarChofer = false;
  public showModalAsignarReloj = false;
  public showModalLicencia = false;
  public showModalDetalles = false;

  // Estado formulario 
  public estadoFormulario = 'crear';

  // Licencia
  public nro_licencia: string = '';
  public idLicencia: number = 0;
  public licencias: any = [];

  // Licencia seleccionada
  public licenciaSeleccionada: any;
  public licenciaPermisionario: any;
  public licenciaVehiculo: any;

  // Vehiculo
  public vehiculoSeleccionado: any = null;
  public nuevoVehiculoData: any = {
    patente: '',
    marca: '',
    modelo: '',
    motor: '',
    chasis: '',
    color: ''
  }

  // Persona
  public personaSeleccionada: any = null;
  public nuevaPersonaData: any = {
    apellido_nombre: '',
    dni: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: ''
  }

  // Valores INPUTS
  public dni = '';
  public patente = '';

  // Marcas
  public marcas: any[];

  // Colores
  public colores: any[];

  // Modelos
  public modelos: any[];

  // Paginacion
  public paginaActual: number = 1;
  public cantidadItems: number = 10;

  // Flags
  public flagNuevaPersona: boolean = false;
  public flagNuevoVehiculo: boolean = false;

  // Filtrado
  public filtro = {
    estado: 'Habilitada',
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'nro_licencia'
  }

  constructor(
    private licenciasService: LicenciasService,
    private licenciasPermisionariosService: LicenciasPermisionariosService,
    private licenciasVehiculosService: LicenciasVehiculosService,
    public authService: AuthService,
    private coloresService: VehiculosColoresService,
    private marcasService: VehiculosMarcasService,
    private modeloService: VehiculosModelosService,
    private personasService: PersonasService,
    private vehiculosService: VehiculosService,
    private alertService: AlertService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Licencias';
    this.alertService.loading();
    this.listarLicencias();
  }

  // Abrir modal
  abrirModal(estado: string, licencia: any = null): void {
    window.scrollTo(0, 0);
    this.reiniciarFormulario();
    this.nro_licencia = '';
    this.idLicencia = 0;

    if (estado === 'editar') this.getLicencia(licencia);
    else this.showModalLicencia = true;

    this.estadoFormulario = estado;
  }

  // Traer datos de licencia
  getLicencia(licencia: any): void {
    this.alertService.loading();
    this.idLicencia = licencia.id;
    this.licenciaSeleccionada = licencia;
    this.licenciasService.getLicencia(licencia.id).subscribe(({ licencia }) => {
      this.nro_licencia = licencia.nro_licencia;
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
      columna: this.ordenar.columna
    }
    this.licenciasService.listarLicencias(parametros)
      .subscribe(({ licencias }) => {
        this.licencias = licencias;
        this.showModalLicencia = false;
        this.alertService.close();
      }, (({ error }) => {
        this.alertService.errorApi(error.msg);
      }));
  }

  // Nueva licencia
  nuevaLicencia(): void {

    // Verificacion: Descripción vacia
    if (this.nro_licencia.trim() === "") {
      this.alertService.info('Debes colocar una descripción');
      return;
    }

    this.alertService.loading();

    const data = {
      nro_licencia: this.nro_licencia,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    console.log(data);

    this.licenciasService.nuevaLicencia(data).subscribe(() => {
      this.listarLicencias();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });

  }

  // Actualizar licencia
  actualizarLicencia(): void {

    // Verificacion: Descripción vacia
    if (this.nro_licencia.trim() === "") {
      this.alertService.info('Debes colocar una descripción');
      return;
    }

    this.alertService.loading();

    const data = {
      nro_licencia: this.nro_licencia,
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

  // Asignando permisionario a licencia
  asignarPermisionario(): void {
    this.alertService.loading();
    const data = {
      persona: this.personaSeleccionada._id,
      licencia: this.licenciaSeleccionada._id,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    };
    this.licenciasPermisionariosService.nuevaRelacion(data).subscribe({
      next: ({ relacion }) => {
        this.showModalAsignarPermisionario = false;
        this.showModalDetalles = true;
        this.dni = '';
        this.personaSeleccionada = null;
        this.licenciaPermisionario = relacion;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Asignando vehiculo a licencia
  asignarVehiculo(): void {
    this.alertService.loading();
    const data = {
      vehiculo: this.vehiculoSeleccionado._id,
      licencia: this.licenciaSeleccionada._id,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    };
    this.licenciasVehiculosService.nuevaRelacion(data).subscribe({
      next: ({ relacion }) => {
        this.showModalAsignarVehiculo = false;
        this.showModalDetalles = true;
        this.patente = '';
        this.vehiculoSeleccionado = null;
        this.licenciaVehiculo = relacion;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Buscar persona
  buscarPersona(): void {

    // Verificacion: DNI
    if (!this.dni || this.dni.trim() === '') {
      this.alertService.info('Debe colocar un DNI');
      return;
    }

    this.alertService.loading();
    this.personasService.getPersonaPorParametro({ parametro: 'dni', valor: this.dni }).subscribe({
      next: ({ persona }) => {
        if (!persona) {
          this.flagNuevaPersona = true;
          this.nuevaPersonaData = {
            apellido_nombre: '',
            dni: this.dni,
            fecha_nacimiento: '',
            telefono: '',
            direccion: ''
          }
        };
        this.personaSeleccionada = persona ? persona : null;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Buscar vehiculo
  buscarVehiculo(): void {

    // Verificacion: Patente
    if (!this.patente || this.patente.trim() === '') {
      this.alertService.info('Debe colocar una patente');
      return;
    }

    this.alertService.loading();
    this.vehiculosService.getVehiculoPorParametro({ parametro: 'patente', valor: this.patente }).subscribe({
      next: ({ vehiculo }) => {

        if (!vehiculo) {

          // Colores de vehiculos
          this.coloresService.listarColores().subscribe({
            next: ({ colores }) => {
              this.colores = colores;

              // Marcas de vehiculos
              this.marcasService.listarMarcas().subscribe({
                next: ({ marcas }) => {
                  this.marcas = marcas;
                  this.flagNuevoVehiculo = true;
                  this.nuevoVehiculoData = {
                    patente: '',
                    marca: '',
                    modelo: '',
                    motor: '',
                    chasis: '',
                    color: ''
                  }
                  this.vehiculoSeleccionado = null;
                  this.alertService.close();
                }, error: ({ error }) => this.alertService.errorApi(error.message)
              })

            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })

        } else {
          this.vehiculoSeleccionado = vehiculo;
          this.alertService.close();
        }


      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })


  }

  // Eliminar persona seleccionada
  eliminarPersona(): void {
    this.dni = '';
    this.personaSeleccionada = null;
  }

  // Eliminar vehiculo seleccionado
  eliminarVehiculo(): void {
    this.patente = '';
    this.vehiculoSeleccionado = null;
  }

  // ABRIR MODAL - DETALLES DE LICENCIA
  abrirDetalles(licencia: any): void {
    this.alertService.loading();
    this.idLicencia = licencia.id;
    this.licenciaSeleccionada = licencia;
    this.licenciasService.getLicencia(licencia.id).subscribe(({ licencia, permisionario }) => {
      this.licenciaPermisionario = permisionario ? permisionario : null;
      this.nro_licencia = licencia.nro_licencia;
      this.alertService.close();
      this.showModalDetalles = true;
    }, ({ error }) => {
      this.alertService.errorApi(error);
    })
  }

  abrirModalNuevo(destino: string) {

    this.dni = '';
    this.patente = '';
    this.personaSeleccionada = null;
    this.vehiculoSeleccionado = null;

    if (destino === 'permisionario') {
      this.showModalDetalles = false;
      this.showModalAsignarPermisionario = true;
    } else if (destino === 'chofer') {
      this.showModalDetalles = false;
      this.showModalAsignarChofer = true;
    } else if (destino === 'reloj') {
      this.showModalDetalles = false;
      this.showModalAsignarReloj = true;
    } else if (destino === 'vehiculo') {
      this.showModalDetalles = false;
      this.showModalAsignarVehiculo = true;
    }

  }

  cerrarModalNuevo(destino: string) {

    this.showModalDetalles = true;

    if (destino === 'permisionario') {
      this.showModalAsignarPermisionario = false;
    } else if (destino === 'chofer') {
      this.showModalAsignarChofer = false;
    } else if (destino === 'reloj') {
      this.showModalAsignarReloj = false;
    } else if (destino === 'vehiculo') {
      this.showModalAsignarVehiculo = false;
    }

  }

  // Baja de persona
  bajaPersona(tipo: string): void {

    console.log(this.licenciaPermisionario);

    this.alertService.question({ msg: `Se esta por dar de baja un ${tipo}`, buttonText: 'Aceptar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {

          this.alertService.loading();

          if (tipo === 'permisionario') {

            this.alertService.loading();
            this.flagNuevaPersona = false;
            this.licenciasPermisionariosService.bajaRelacion(this.licenciaPermisionario._id, { activo: false }).subscribe({
              next: () => {
                this.licenciaPermisionario = null;
                this.alertService.close();
              }, error: ({ error }) => {
                this.alertService.errorApi(error.message)
              }
            })

          } else if (tipo === 'chofer') {

          }

        }
      });

  }

  // Nueva persona
  nuevaPersona(): void {

    // Verificaciones

    if (this.nuevaPersonaData.apellido_nombre.trim() === '') {
      this.alertService.info("Debe colocar apellido y nombre");
      return;
    }

    if (this.nuevaPersonaData.dni.trim() === '') {
      this.alertService.info("Debe colocar DNI");
      return;
    }

    if (this.nuevaPersonaData.fecha_nacimiento.trim() === '') {
      this.alertService.info("Debe colocar la fecha de nacimiento");
      return;
    }

    this.alertService.loading();

    const data = { ...this.nuevaPersonaData };
    data.creatorUser = this.authService.usuario.userId;
    data.updatorUser = this.authService.usuario.userId;

    this.personasService.nuevaPersona(data).subscribe({
      next: ({ persona }) => {
        this.personaSeleccionada = persona;
        this.flagNuevaPersona = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }


  // Nueva vehiculo
  nuevoVehiculo(): void {

    // Verificaciones

    if (this.nuevoVehiculoData.patente.trim() === '') {
      this.alertService.info("Debe colocar un numero de patente");
      return;
    }

    if (this.nuevoVehiculoData.marca.trim() === '') {
      this.alertService.info("Debe colocar una marca");
      return;
    }

    if (this.nuevoVehiculoData.modelo.trim() === '') {
      this.alertService.info("Debe colocar un modelo");
      return;
    }

    if (this.nuevoVehiculoData.color.trim() === '') {
      this.alertService.info("Debe colocar un color");
      return;
    }

    this.alertService.loading();

    const data = { ...this.nuevoVehiculoData };
    data.creatorUser = this.authService.usuario.userId;
    data.updatorUser = this.authService.usuario.userId;

    this.vehiculosService.nuevoVehiculo(data).subscribe({
      next: ({ vehiculo }) => {
        this.vehiculoSeleccionado = vehiculo;
        this.flagNuevoVehiculo = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Buscar modelos
  buscarModelos(): void {
    this.nuevoVehiculoData.modelo = '';

    if (this.nuevoVehiculoData.marca.trim() !== '') {
      this.alertService.loading();
      this.modeloService.listarModelos({ marca: this.nuevoVehiculoData.marca }).subscribe({
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

  // Reiniciando formulario
  reiniciarFormulario(): void {
    this.nro_licencia = '';
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

}
