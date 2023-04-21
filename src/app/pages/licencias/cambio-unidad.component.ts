import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { LicenciasService } from 'src/app/services/licencias.service';
import gsap from 'gsap';
import { AuthService } from 'src/app/services/auth.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { LicenciasTramitesService } from 'src/app/services/licencias-tramites.service';
import { VehiculosColoresService } from 'src/app/services/vehiculos-colores.service';
import { VehiculosMarcasService } from 'src/app/services/vehiculos-marcas.service';
import { VehiculosModelosService } from 'src/app/services/vehiculos-modelos.service';

@Component({
  selector: 'app-cambio-unidad',
  templateUrl: './cambio-unidad.component.html',
  styles: [
  ]
})
export class CambioUnidadComponent implements OnInit {

  // Limite de antiguedad
  public LIMIT_ANO = 1996;

  // Flags
  public showNuevoVehiculo = false;

  // Datos de licencia
  public idLicencia: number = null;
  public licencia: any = null;
  public licenciaVehiculo: any = null;

  // Vehiculos
  public patente: string = '';
  public nuevoVehiculo: any = null;
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
    private licenciasService: LicenciasService,
    private licenciasTramitesService: LicenciasTramitesService,
    private vehiculosService: VehiculosService,
    private coloresService: VehiculosColoresService,
    private marcasService: VehiculosMarcasService,
    private modelosService: VehiculosModelosService,
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
      next: ({ licencia, vehiculo }) => {
        this.licencia = licencia;
        this.licenciaVehiculo = vehiculo;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Buscar vehiculo
  buscarVehiculo(): void {

    // Verificacion: Patente vacia
    if(this.patente.trim() === ''){
      this.alertService.info('Debe colocar una patente');
      return;
    }    

    this.alertService.loading();
    this.vehiculosService.getVehiculoPorParametro({
      parametro: 'patente',
      valor: this.patente
    }).subscribe({
      next: ({ vehiculo }) => {

        if(vehiculo){ // -> Seleccionar vehiculo
          this.patente = '';
          this.nuevoVehiculo =  vehiculo;
          this.alertService.close();
        }else{        // -> Abrir modal de nuevo vehiculo
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
          next: ({marcas}) => {
            this.marcas = marcas;
            this.nuevoVehiculoData.patente = this.patente.toUpperCase();
            this.showNuevoVehiculo = true;
            this.alertService.close();
          }, error: ({error}) => this.alertService.errorApi(error.message)
        })
      }, error: ({error}) => this.alertService.errorApi(error.message)
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
        this.nuevoVehiculo = vehiculo;
        this.showNuevoVehiculo = false;
        this.alertService.close();
      },error: ({error}) => this.alertService.errorApi(error.message)
    })
  }

  // Tramite -> Cambio de unidad
  cambioUnidad(): void {

    if(!this.nuevoVehiculo){
      this.alertService.info('Debe seleccionar una nueva unidad');
      return;
    }

    this.alertService.question({ msg: '¿Quieres realizar el cambio de unidad?', buttonText: 'Aceptar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          const data = {
            licencia: this.idLicencia,
            vehiculo: this.nuevoVehiculo.id,
            creatorUser: this.authService.usuario.userId,
            updatorUser: this.authService.usuario.userId,
          };
          this.licenciasTramitesService.cambioUnidad(data).subscribe({
            next: () => {
              this.router.navigateByUrl(`/dashboard/licencias/detalles/${this.idLicencia}`);
              this.alertService.close();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });

  }

  // Eliminar vehiculo seleccionado
  eliminarVehiculo(): void {
    this.patente = '';
    this.nuevoVehiculo = null;
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

}
