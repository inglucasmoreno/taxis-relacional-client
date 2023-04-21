import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import gsap from 'gsap';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { LicenciasTramitesService } from 'src/app/services/licencias-tramites.service';
import { LicenciasService } from 'src/app/services/licencias.service';
import { PersonasService } from 'src/app/services/personas.service';
import { SigemService } from 'src/app/services/sigem.service';
import { VehiculosColoresService } from 'src/app/services/vehiculos-colores.service';
import { VehiculosMarcasService } from 'src/app/services/vehiculos-marcas.service';
import { VehiculosModelosService } from 'src/app/services/vehiculos-modelos.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';

@Component({
  selector: 'app-transferencia-cambio-unidad',
  templateUrl: './transferencia-cambio-unidad.component.html',
  styles: [
  ]
})
export class TransferenciaCambioUnidadComponent implements OnInit {

  // Limite de antiguedad
  public LIMIT_ANO = 1996;

  // Flag
  public showNuevaPersona = false;
  public showNuevoVehiculo = false;

  // Licencia
  public idLicencia: number = null;
  public licencia: any = null;
  public licenciaVehiculo: any = null;

  // Persona
  public dni: string = '';
  public personaSeleccionada: any = null;
  public nuevaPersonaData: any = {
    apellido: '',
    nombre: '',
    dni: '',
    mail: '',
    telefono: '',
    domicilio: ''
  }

  // Vehiculos
  public patente: string = '';
  public vehiculoSeleccionado: any = null;
  public colores: any[] = [];
  public marcas: any[] = [];
  public modelos: any[] = [];

  // Vehiculo
  public nuevoVehiculoData: any = {
    patente: '',
    marca: '',
    modelo: '',
    motor: '',
    chasis: '',
    color: '',
    ano: null,
    creatorUser: this.authService.usuario.userId,
    updatorUser: this.authService.usuario.userId,
  }

  constructor(
    private dataService: DataService,
    private router: Router,
    private sigemService: SigemService,
    private personasService: PersonasService,
    private licenciasTramitesService: LicenciasTramitesService,
    private vehiculosService: VehiculosService,
    private coloresService: VehiculosColoresService,
    private marcasService: VehiculosMarcasService,
    private modelosService: VehiculosModelosService,
    private licenciasService: LicenciasService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dasboard - Cambio de unidad";
    gsap.from('.gsap-contenido', { y: 100, opacity: 0, duration: .2 });
    this.alertService.loading();
    this.activatedRoute.params.subscribe(({ id }) => {
      this.idLicencia = id;
      this.datosIniciales();
    });
  }

  // Carga de datos iniciales
  datosIniciales(): void {
    this.licenciasService.getLicencia(this.idLicencia).subscribe({
      next: ({ licencia }) => {
        this.licencia = licencia;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // -> PERMISIONARIO

  // Buscar persona
  buscarPersona(): void {

    // Verificacion: DNI
    if (!this.dni || this.dni.trim() === '') {
      this.alertService.info('Debe colocar un DNI');
      return;
    }

    this.alertService.loading();

    const data = {
      dni: this.dni,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.sigemService.getPersona(data).subscribe({
      next: ({ persona, success }) => {

        if (!success) {
          this.showNuevaPersona = true;
          this.nuevaPersonaData = {
            apellido: '',
            nombre: '',
            dni: this.dni,
            mail: '',
            telefono: '',
            domicilio: ''
          }
        }

        this.personaSeleccionada = success ? persona : null;

        this.alertService.close();

      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  nuevaPersona(): void {

    // Verificacion: Apellido vacio
    if (this.nuevaPersonaData.apellido.trim() === "") {
      this.alertService.info('Debes colocar un apellido');
      return;
    }

    // Verificacion: Nombre vacio
    if (this.nuevaPersonaData.nombre.trim() === "") {
      this.alertService.info('Debes colocar un nombre');
      return;
    }

    // Verificacion: DNI
    if (this.nuevaPersonaData.dni.trim() === "") {
      this.alertService.info('Debes colocar un DNI');
      return;
    }

    // Verificacion: Telefono
    if (this.nuevaPersonaData.telefono.trim() === "") {
      this.alertService.info('Debes colocar un número de teléfono');
      return;
    }

    // Verificacion: Domicilio
    if (this.nuevaPersonaData.domicilio.trim() === "") {
      this.alertService.info('Debes colocar un domicilio');
      return;
    }

    // Verificacion: Email
    if (this.nuevaPersonaData.mail.trim() === "") {
      this.alertService.info('Debes colocar un email');
      return;
    }

    this.alertService.loading();

    const data = { ...this.nuevaPersonaData };
    data.creatorUser = this.authService.usuario.userId;
    data.updatorUser = this.authService.usuario.userId;

    this.personasService.nuevaPersona(data).subscribe({
      next: ({ persona }) => {
        this.personaSeleccionada = persona;
        this.showNuevaPersona = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Eliminar persona seleccionada
  eliminarPersona(): void {
    this.dni = '';
    this.personaSeleccionada = null;
  }

  // -> VEHICULO

  // Buscar vehiculo
  buscarVehiculo(): void {

    // Verificacion: Patente vacia
    if (this.patente.trim() === '') {
      this.alertService.info('Debe colocar una patente');
      return;
    }

    this.alertService.loading();
    this.vehiculosService.getVehiculoPorParametro({
      parametro: 'patente',
      valor: this.patente
    }).subscribe({
      next: ({ vehiculo }) => {

        if (vehiculo) { // -> Seleccionar vehiculo
          this.patente = '';
          this.vehiculoSeleccionado = vehiculo;
          this.alertService.close();
        } else {        // -> Abrir modal de nuevo vehiculo
          this.abrirNuevoVehiculo();
        }

      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Abrir modal -> Nuevo vehiculo
  abrirNuevoVehiculo(): void {
    this.reiniciarNuevoVehiculo();
    this.coloresService.listarColores().subscribe({
      next: ({ colores }) => {
        this.colores = colores;
        this.marcasService.listarMarcas().subscribe({
          next: ({ marcas }) => {
            this.marcas = marcas;
            this.nuevoVehiculoData.patente = this.patente.toUpperCase();
            this.showNuevoVehiculo = true;
            this.alertService.close();
          }, error: ({ error }) => this.alertService.errorApi(error.message)
        })
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Buscar modelos
  buscarModelos(): void {
    this.alertService.loading();
    this.modelosService.listarModelos({ marca: this.nuevoVehiculoData.marca }).subscribe({
      next: ({ modelos }) => {
        this.modelos = modelos;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Nuevo vehiculo
  crearNuevoVehiculo(): void {

    // Verificacion: Patente vacia
    if (this.patente.trim() === "") {
      this.alertService.info('Debes colocar una patente');
      return;
    }

    // Verificacion: Marca vacia
    if (this.nuevoVehiculoData.marca.trim() === "") {
      this.alertService.info('Debes colocar una marca');
      return;
    }

    // Verificacion: Modelo vacio
    if (this.nuevoVehiculoData.modelo.trim() === "") {
      this.alertService.info('Debes colocar una modelo');
      return;
    }

    // Verificacion: Motor vacio
    if (this.nuevoVehiculoData.motor.trim() === "") {
      this.alertService.info('Debes colocar un número de motor');
      return;
    }

    // Verificacion: Chasis vacio
    if (this.nuevoVehiculoData.chasis.trim() === "") {
      this.alertService.info('Debes colocar un número de chasis');
      return;
    }

    // Verificacion: Año vacio
    if (!this.nuevoVehiculoData.ano || this.nuevoVehiculoData.ano < this.LIMIT_ANO) {
      this.alertService.info('Debes colocar un año válido');
      return;
    }

    this.alertService.loading();

    this.vehiculosService.nuevoVehiculo(this.nuevoVehiculoData).subscribe({
      next: ({ vehiculo }) => {
        this.vehiculoSeleccionado = vehiculo;
        this.showNuevoVehiculo = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Eliminar vehiculo seleccionado
  eliminarVehiculo(): void {
    this.patente = '';
    this.vehiculoSeleccionado = null;
  }

  // Reiniciar formulario -> Nuevo vehiculo
  reiniciarNuevoVehiculo(): void {
    this.nuevoVehiculoData = {
      patente: '',
      marca: '',
      modelo: '',
      motor: '',
      chasis: '',
      color: '',
      ano: null,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }
  }

  
  // Tramite -> Transferencia con cambio de unidad
  completarTramite(): void {

    if (!this.nuevaPersona) {
      this.alertService.info('Debe seleccionar un nuevo permisionario');
      return;
    }

    if (!this.vehiculoSeleccionado) {
      this.alertService.info('Debe seleccionar una nueva unidad');
      return;
    }

    this.alertService.question({ msg: '¿Quieres realizar la transferencia con cambio de unidad?', buttonText: 'Aceptar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          const data = {
            licencia: this.idLicencia,
            persona: this.personaSeleccionada.id,
            vehiculo: this.vehiculoSeleccionado.id,
            creatorUser: this.authService.usuario.userId,
            updatorUser: this.authService.usuario.userId,
          };
          this.licenciasTramitesService.transferenciaCambioUnidad(data).subscribe({
            next: () => {
              this.router.navigateByUrl(`/dashboard/licencias/detalles/${this.idLicencia}`);
              this.alertService.close();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });

  }


}
