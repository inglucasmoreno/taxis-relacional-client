import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import gsap from 'gsap';
import { LicenciasChoferesService } from 'src/app/services/licencias-choferes.service';
import { SigemService } from 'src/app/services/sigem.service';
import { TiposServiciosService } from 'src/app/services/tipos-servicios.service';
import { VehiculosTitularesService } from 'src/app/services/vehiculos-titulares.service';
import { SegurosEmpresasService } from 'src/app/services/seguros-empresas.service';
import { VehiculosSegurosService } from 'src/app/services/vehiculos-seguros.service';

@Component({
  selector: 'app-licencias-detalles',
  templateUrl: './licencias-detalles.component.html',
  styles: [
  ]
})
export class LicenciasDetallesComponent implements OnInit {

  // Constantes
  public LIMIT_ANO: number = 1990;

  // Flags
  public showContenido: string = 'Detalles'; // Detalles | Historial
  public showModalTitulares = false;
  public showModalSeguro = false;

  // Etapas
  public flagEtapaPersona: string = 'permisionario';
  public flagEtapaBaja: string = 'permisionario';
  public flagEtapaDetalles: string = 'permisionario';

  // Selecciones
  public permisionarioLicenciaSeleccionada: any = null;
  public vehiculoLicenciaSeleccionada: any = null;
  public choferLicenciaSeleccionada: any = null;
  public vehiculoSeleccionado: any = null;

  // Relaciones
  public vehiculosLicencia: any[] = [];
  public permisionariosLicencia: any[] = [];
  public choferesLicencia: any[] = [];

  // Estado formulario 
  public estadoFormulario = 'crear';

  // Modal
  public showModalAsignarVehiculo: boolean = false;
  public showModalAsignarPersona: boolean = false;
  public showModalAsignarChofer: boolean = false;
  public showModalAsignarReloj: boolean = false;
  public showModalBajas: boolean = false;
  public showModalDetalles: boolean = false;
  public showModalTramites: boolean = false;
  public showModalEditarLicencia: boolean = false;
  public showModalAltaPersona: boolean = false;

  // Licencia
  public idLicencia: number = 0;
  public licencias: any = [];
  public licencia: any = null;
  public tipo_servicio: string = '';
  public nro_licencia: string = '';

  // Licencia seleccionada
  public permisionario: any;
  public vehiculo: any;
  public choferes: any[] = [];

  // Seguros
  public empresas: any[] = [];

  // Vehiculo
  public nuevoVehiculoData: any = {
    patente: '',
    marca: '',
    modelo: '',
    motor: '',
    chasis: '',
    color: '',
    ano: null
  }

  // Persona
  public personaSeleccionada: any = null;
  public nuevaPersonaData: any = {
    apellido: '',
    nombre: '',
    dni: '',
    mail: '',
    telefono: '',
    domicilio: ''
  }

  // Seguro de vehiculo
  public dataSeguro = {
    vehiculo: 0,
    empresa: '',
    nro_poliza: '',
    fecha_desde: '',
    fecha_hasta: '',
    creatorUser: this.authService.usuario.userId,
    updatorUser: this.authService.usuario.userId,
  }

  // Chofer
  public motivo_baja_chofer: string = '';

  // Valores INPUTS
  public dni: string = '';
  public patente: string = '';

  // Marcas
  public marcas: any[];

  // Colores
  public colores: any[];

  // Modelos
  public modelos: any[];

  // Tipos de servicio
  public tipos_servicios: any[] = [];

  // Paginacion
  public paginaActual: number = 1;
  public cantidadItems: number = 10;

  // Flags
  public flagNuevaPersona: boolean = false;
  public flagNuevoVehiculo: boolean = false;

  // Titulares del vehiculo
  public totalPorcentaje = 0;
  public titulares: any = [];
  public porcentaje: number = null;
  public numero_titulo: string = '';

  // Personas
  public dniBusqueda: string = '';

  // Filtrado
  public filtro: any = {
    estado: 'Habilitada',
    parametro: ''
  }

  // Ordenar
  public ordenarPermisionarios: any = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'fecha_alta'
  }

  public ordenarVehiculos: any = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'fecha_alta'
  }

  public ordenarChoferes: any = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'fecha_alta'
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private tiposServiciosService: TiposServiciosService,
    private dataService: DataService,
    private licenciasService: LicenciasService,
    private licenciasPermisionariosService: LicenciasPermisionariosService,
    private licenciasChoferesService: LicenciasChoferesService,
    private licenciasVehiculosService: LicenciasVehiculosService,
    private segurosEmpresasService: SegurosEmpresasService,
    public authService: AuthService,
    private sigemService: SigemService,
    private coloresService: VehiculosColoresService,
    private marcasService: VehiculosMarcasService,
    private modeloService: VehiculosModelosService,
    private personasService: PersonasService,
    private vehiculosService: VehiculosService,
    private vehiculosTitularesService: VehiculosTitularesService,
    private vehiculosSegurosService: VehiculosSegurosService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dasboard - Detalles de licencia";
    gsap.from('.gsap-contenido', { y: 100, opacity: 0, duration: .2 });
    this.alertService.loading();
    this.activatedRoute.params.subscribe(({ id }) => {
      this.idLicencia = id;
      this.calculosIniciales();
    });
  }

  // Calculos iniciales
  calculosIniciales(): void {

    // Datos de licencia
    this.licenciasService.getLicencia(this.idLicencia).subscribe({
      next: ({ licencia, permisionario, vehiculo, choferes }) => {
        this.licencia = licencia;
        this.choferes = choferes;
        this.vehiculo = vehiculo?.vehiculo;
        this.permisionario = permisionario;

        const parametrosPermisionarios = {
          licencia: this.idLicencia,
          columna: this.ordenarPermisionarios.columna,
          direccion: this.ordenarPermisionarios.direccion
        }

        // Historial de permisionarios
        this.licenciasPermisionariosService.listarRelaciones(parametrosPermisionarios).subscribe({
          next: ({ relaciones }) => {
            this.permisionariosLicencia = relaciones;

            const parametrosVehiculos = {
              licencia: this.idLicencia,
              columna: this.ordenarVehiculos.columna,
              direccion: this.ordenarVehiculos.direccion
            }

            // Historial de vehiculos
            this.licenciasVehiculosService.listarRelaciones(parametrosVehiculos).subscribe({
              next: ({ relaciones }) => {
                this.vehiculosLicencia = relaciones;
                this.showModalBajas = false;
                this.alertService.close();
              }, error: ({ error }) => this.alertService.errorApi(error.message)
            })

          }, error: ({ error }) => this.alertService.errorApi(error.message)
        })

      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Listar permisionarios
  listarPermisionarios(): void {
    const parametros = {
      licencia: this.idLicencia,
      columna: this.ordenarPermisionarios.columna,
      direccion: this.ordenarPermisionarios.direccion
    }
    this.licenciasPermisionariosService.listarRelaciones(parametros).subscribe({
      next: ({ relaciones }) => {
        this.permisionariosLicencia = relaciones;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Listar vehiculos
  listarVehiculos(): void {
    const parametros = {
      licencia: this.idLicencia,
      columna: this.ordenarVehiculos.columna,
      direccion: this.ordenarVehiculos.direccion
    }
    this.licenciasVehiculosService.listarRelaciones(parametros).subscribe({
      next: ({ relaciones }) => {
        this.vehiculosLicencia = relaciones;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Listar choferes
  listarChoferes(): void {
    const parametros = {
      licencia: this.idLicencia,
      columna: this.ordenarChoferes.columna,
      direccion: this.ordenarChoferes.direccion
    }
    this.licenciasChoferesService.listarRelaciones(parametros).subscribe({
      next: ({ relaciones }) => {
        this.choferes = relaciones;
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

    const data = {
      dni: this.dni,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.sigemService.getPersona(data).subscribe({
      next: ({ persona, success }) => {

        if (!success) {
          this.nuevaPersonaData = {
            apellido: '',
            nombre: '',
            dni: this.dni,
            mail: '',
            telefono: '',
            domicilio: ''
          }

          if (this.showModalTitulares) {
            this.showModalAltaPersona = true;
            this.showModalTitulares = false;
          } else {
            this.flagNuevaPersona = true;
          }

        }

        this.personaSeleccionada = success ? persona : null;

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
                    patente: this.patente,
                    marca: '',
                    modelo: '',
                    motor: '',
                    chasis: '',
                    color: '',
                    ano: null
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

        if (this.showModalAltaPersona) {
          this.showModalAltaPersona = false;
          this.showModalTitulares = true;
        } else {
          this.flagNuevaPersona = false;
        }

        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Nueva vehiculo
  nuevoVehiculo(): void {

    // VERIFICACION -> DATOS DE VEHICULO

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

    // Verificacion: Año vacio
    if (!this.nuevoVehiculoData.ano || this.nuevoVehiculoData.ano < this.LIMIT_ANO) {
      this.alertService.info('Debes colocar un año válido');
      return;
    }

    // VERIFICACION -> TITULARES

    // Verificacion: El porcentaje total debe ser 100
    if (this.totalPorcentaje !== 100) {
      this.alertService.info('El porcentaje total debe ser 100%');
      return;
    }

    // VERIFICACION -> SEGURO

    // Verificacion: Empresa
    if (this.dataSeguro.empresa.trim() === "") {
      this.alertService.info('Debes colocar una empresa de seguros válida');
      return;
    }

    // Verificacion: Poliza
    if (this.dataSeguro.nro_poliza.trim() === "") {
      this.alertService.info('Debes colocar un número de poliza');
      return;
    }

    // Verificacion: Fecha desde
    if (this.dataSeguro.fecha_desde.trim() === "") {
      this.alertService.info('Debes colocar un rango de fechas válido para el seguro');
      return;
    }

    // Verificacion: Fecha hasta
    if (this.dataSeguro.fecha_desde.trim() === "") {
      this.alertService.info('Debes colocar un rango de fechas válido para el seguro');
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
        this.nuevosTitulares(vehiculo.id);
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Nuevos titulares
  nuevosTitulares(vehiculo: number): void {

    let dataTitulares = [];

    this.titulares.map(titular => {
      dataTitulares.push({
        ...titular,
        vehiculo
      });
    })

    this.vehiculosTitularesService.nuevosTitulares(dataTitulares).subscribe({
      next: () => {
        this.nuevoSeguro(vehiculo);
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Nuevo seguro
  nuevoSeguro(vehiculo: number): void {
    this.dataSeguro.vehiculo = vehiculo;
    this.vehiculosSegurosService.nuevoSeguro(this.dataSeguro).subscribe({
      next: () => {
        this.showModalTitulares = false;
        this.showModalAsignarVehiculo = true;
        this.showModalSeguro = false;
        this.titulares = [];
        this.reiniciarFormularioSeguro();
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  abrirModalNuevo(destino: string) {

    window.scrollTo(0, 0);

    this.dni = '';
    this.patente = '';
    this.personaSeleccionada = null;
    this.vehiculoSeleccionado = null;

    if (destino === 'permisionario') {
      this.flagEtapaPersona = 'permisionario';
      this.flagNuevaPersona = false;
      this.reiniciarPersona();
      this.showModalAsignarPersona = true;
    } else if (destino === 'chofer') {
      this.flagEtapaPersona = 'chofer';
      this.flagNuevaPersona = false;
      this.reiniciarPersona();
      this.showModalAsignarPersona = true;
    } else if (destino === 'reloj') {
      this.showModalAsignarReloj = true;
    } else if (destino === 'vehiculo') {
      this.flagNuevoVehiculo = false;
      this.titulares = [];
      this.reiniciarVehiculo();
      this.showModalAsignarVehiculo = true;
    }

  }

  abrirModalDetalles(destino: string, elemento: any) {

    window.scrollTo(0, 0);

    this.personaSeleccionada = null;
    this.vehiculoSeleccionado = null;

    if (destino === 'permisionario') {
      this.permisionarioLicenciaSeleccionada = elemento;
      this.flagEtapaDetalles = 'permisionario';
      this.showModalDetalles = true;

    } else if (destino === 'chofer') {
      this.choferLicenciaSeleccionada = elemento;
      console.log(this.choferLicenciaSeleccionada);
      this.flagEtapaDetalles = 'chofer';
      this.showModalDetalles = true;

    } else if (destino === 'vehiculo') {
      this.vehiculoLicenciaSeleccionada = elemento;
      this.flagEtapaDetalles = 'vehiculo';
      this.showModalDetalles = true;
    }

  }

  // Asignando permisionario a licencia
  asignarPermisionario(): void {
    this.alertService.loading();
    const data = {
      persona: this.personaSeleccionada.id,
      licencia: this.idLicencia,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    };
    this.licenciasPermisionariosService.nuevaRelacion(data).subscribe({
      next: () => {
        this.showModalAsignarPersona = false;
        this.dni = '';
        this.personaSeleccionada = null;
        this.calculosIniciales();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Asignando chofer a licencia
  asignarChofer(): void {
    this.alertService.loading();
    const data = {
      persona: this.personaSeleccionada.id,
      licencia: this.idLicencia,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    };
    this.licenciasChoferesService.nuevaRelacion(data).subscribe({
      next: () => {
        this.showModalAsignarPersona = false;
        this.dni = '';
        this.personaSeleccionada = null;
        this.calculosIniciales();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Asignando vehiculo a licencia
  asignarVehiculo(): void {
    this.alertService.loading();
    const data = {
      vehiculo: this.vehiculoSeleccionado.id,
      licencia: this.idLicencia,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    };
    this.licenciasVehiculosService.nuevaRelacion(data).subscribe({
      next: ({ relacion }) => {
        this.showModalAsignarVehiculo = false;
        this.patente = '';
        this.vehiculoSeleccionado = null;
        this.vehiculosLicencia = relacion;
        this.calculosIniciales();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Cerrar modal - Nuevo
  cerrarModalNuevo(destino: string) {

    if (destino === 'permisionario') {
      this.showModalAsignarPersona = false;
    } else if (destino === 'chofer') {
      this.showModalAsignarChofer = false;
    } else if (destino === 'reloj') {
      this.showModalAsignarReloj = false;
    } else if (destino === 'vehiculo') {
      this.showModalAsignarVehiculo = false;
    }

  }

  // Abrir modal - Baja
  abrirModalBaja(elemento: any, tipo: string = ''): void {

    window.scrollTo(0, 0);
    this.showModalBajas = true;
    this.flagEtapaBaja = tipo;
    this.motivo_baja_chofer = '';

    this.permisionarioLicenciaSeleccionada = null;
    this.vehiculoLicenciaSeleccionada = null;
    this.choferLicenciaSeleccionada = null;

    if (tipo === 'permisionario') {
      this.permisionarioLicenciaSeleccionada = elemento;
    }

    if (tipo === 'vehiculo') {
      this.vehiculoLicenciaSeleccionada = elemento;
    }

    if (tipo === 'chofer') {
      this.choferLicenciaSeleccionada = elemento;
    }

  }

  // Baja de chofer
  generarBaja(): void {

    // Baja de permisionario
    if (this.flagEtapaBaja === 'permisionario') {
      this.alertService.loading();

      const dataBaja = {
        activo: false,
        updatorUser: this.authService.usuario.userId
      }

      this.licenciasPermisionariosService.actualizarRelaciones(this.permisionarioLicenciaSeleccionada.id, dataBaja).subscribe({
        next: () => {
          this.calculosIniciales();
        }, error: ({ error }) => this.alertService.errorApi(error.message)
      });
    }

    // Baja de vehiculo
    if (this.flagEtapaBaja === 'vehiculo') {
      this.alertService.loading();

      const dataBaja = {
        activo: false,
        updatorUser: this.authService.usuario.userId
      }

      this.licenciasVehiculosService.actualizarRelaciones(this.vehiculoLicenciaSeleccionada.id, dataBaja).subscribe({
        next: () => {
          this.calculosIniciales();
        }, error: ({ error }) => this.alertService.errorApi(error.message)
      });
    }

    // Baja de chofer
    if (this.flagEtapaBaja === 'chofer') {

      if (this.motivo_baja_chofer.trim() === '') {
        this.alertService.info('Debe colocar el motivo de la baja');
        return;
      }

      this.alertService.loading();

      const dataBaja = {
        activo: false,
        motivo_baja: this.motivo_baja_chofer,
        updatorUser: this.authService.usuario.userId
      }

      this.licenciasChoferesService.actualizarRelaciones(this.choferLicenciaSeleccionada.id, dataBaja).subscribe({
        next: () => {
          this.calculosIniciales();
        }, error: ({ error }) => this.alertService.errorApi(error.message)
      });
    }

  }

  // Abrir editar licencia
  abrirEditarLicencia(): void {
    this.alertService.loading();
    this.tiposServiciosService.listarTipos().subscribe({
      next: ({ tipos }) => {
        this.tipos_servicios = tipos;
        this.nro_licencia = this.licencia.nro_licencia;
        this.tipo_servicio = this.licencia.tipo_servicio.id;
        this.showModalEditarLicencia = true;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Editar licencia
  editarLicencia(): void {

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

    this.licenciasService.actualizarLicencias(this.idLicencia, {
      nro_licencia: this.nro_licencia,
      tipo_servicio: this.tipo_servicio,
      updatorUser: this.authService.usuario.userId
    }).subscribe({
      next: ({ licencia }) => {
        this.licencia = licencia.licencia;
        this.showModalEditarLicencia = false;
        this.alertService.close();
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

  // Agregar titular
  agregarTitular(): void {

    // Verificacion

    if (this.numero_titulo.trim() === '') {
      this.alertService.info('Debe colocar número de titulo');
      return;
    }

    if (!this.porcentaje || this.porcentaje <= 0 || this.porcentaje > 100) {
      this.alertService.info('Debe colocar un porcentaje válido');
      return;
    }

    if ((this.totalPorcentaje + this.porcentaje) > 100) {
      this.alertService.info('El porcentaje total no puede superar 100');
      return;
    }

    let titularRepetido = this.titulares.find(titular => titular.dni === this.personaSeleccionada.dni);

    if (titularRepetido) {
      this.alertService.info('La persona ya esta cargada como titular');
      return;
    }

    this.titulares.push({
      nombre: this.personaSeleccionada.nombre,
      apellido: this.personaSeleccionada.apellido,
      dni: this.personaSeleccionada.dni,
      persona: this.personaSeleccionada.id,
      numero_titulo: this.numero_titulo,
      porcentaje: this.porcentaje,
      fecha_inscripcion_inicial: '2023-03-23',
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    });

    this.personaSeleccionada = null;
    this.dni = '';
    this.numero_titulo = '';
    this.calcularTotalesTitulo();

  }

  // Eliminar titular
  eliminarTitular(idPersona: number): void {
    this.titulares = this.titulares.filter(titular => titular.persona !== idPersona);
    this.calcularTotalesTitulo();
  }

  // Totales titulos
  calcularTotalesTitulo(): void {
    let totalPorcentajeTMP = 0;
    this.titulares.map(titular => {
      totalPorcentajeTMP = totalPorcentajeTMP += titular.porcentaje;
    })
    this.totalPorcentaje = totalPorcentajeTMP;
    this.porcentaje = 100 - this.totalPorcentaje;
  }

  // Abrir titulares
  abrirTitulares(): void {

    // Verificaciones

    if (this.patente.trim() === '') {
      this.alertService.info('Debe colocar una patente');
      return;
    }

    if (this.nuevoVehiculoData.color.trim() === '') {
      this.alertService.info('Debe seleccionar un color');
      return;
    }

    if (this.nuevoVehiculoData.marca.trim() === '') {
      this.alertService.info('Debe seleccionar una marca');
      return;
    }

    if (this.nuevoVehiculoData.modelo.trim() === '') {
      this.alertService.info('Debe seleccionar un modelo');
      return;
    }

    if (this.nuevoVehiculoData.motor.trim() === '') {
      this.alertService.info('Debe colocar un número de motor');
      return;
    }

    if (this.nuevoVehiculoData.chasis.trim() === '') {
      this.alertService.info('Debe colocar un número de chasis');
      return;
    }

    if (!this.nuevoVehiculoData.ano || this.nuevoVehiculoData.ano < this.LIMIT_ANO) {
      this.alertService.info('Debes colocar una año válido');
      return;
    }

    this.calcularTotalesTitulo();
    this.showModalAsignarVehiculo = false;
    this.showModalTitulares = true;

  }


  // Abrir seguro de vehiculo
  abrirSeguro(): void {

    // Verificacion: El porcentaje total debe ser 100
    if (this.totalPorcentaje !== 100) {
      this.alertService.info('El porcentaje total debe ser 100%');
      return;
    }

    this.alertService.loading();
    this.segurosEmpresasService.listarEmpresas().subscribe({
      next: ({ empresas }) => {
        this.empresas = empresas.filter(empresa => empresa.activo);
        this.showModalSeguro = true;
        this.showModalTitulares = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Regresar a datos de vehiculo
  regresarVehiculo(): void {
    this.showModalAsignarVehiculo = true;
    this.showModalTitulares = false;
  }

  // Regresar a titulares
  regresarTitulares(): void {
    this.showModalAltaPersona = false;
    this.showModalSeguro = false;
    this.showModalTitulares = true;
  }

  // Reiniciar vehiculo
  reiniciarVehiculo(): void {
    this.nuevoVehiculoData = {
      patente: '',
      marca: '',
      modelo: '',
      motor: '',
      chasis: '',
      color: '',
      ano: null
    }
  }

  // Reiniciar persona
  reiniciarPersona(): void {
    this.nuevaPersonaData = {
      apellido: '',
      nombre: '',
      dni: '',
      mail: '',
      telefono: '',
      domicilio: ''
    }
  }

  // Reiniciar formulario seguro
  reiniciarFormularioSeguro(): void {
    this.dataSeguro.vehiculo = 0;
    this.dataSeguro.empresa = '';
    this.dataSeguro.nro_poliza = '';
    this.dataSeguro.fecha_desde = '';
    this.dataSeguro.fecha_hasta = '';
  }

  // Ordenar por columna - Permisionarios
  ordenarPorColumnaPermisionarios(columna: string) {
    this.ordenarPermisionarios.columna = columna;
    this.ordenarPermisionarios.direccion = this.ordenarPermisionarios.direccion == 1 ? -1 : 1;
    this.alertService.loading();
    this.listarPermisionarios();
  }

  // Ordenar por columna - Vehiculos
  ordenarPorColumnaVehiculos(columna: string) {
    this.ordenarVehiculos.columna = columna;
    this.ordenarVehiculos.direccion = this.ordenarVehiculos.direccion == 1 ? -1 : 1;
    this.alertService.loading();
    this.listarVehiculos();
  }

  // Ordenar por columna - Choferes
  ordenarPorColumnaChoferes(columna: string) {
    this.ordenarChoferes.columna = columna;
    this.ordenarChoferes.direccion = this.ordenarChoferes.direccion == 1 ? -1 : 1;
    this.alertService.loading();
    this.listarChoferes();
  }

}
