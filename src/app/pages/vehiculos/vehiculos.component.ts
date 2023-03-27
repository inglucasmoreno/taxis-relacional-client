import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { PersonasService } from 'src/app/services/personas.service';
import { SigemService } from 'src/app/services/sigem.service';
import { VehiculosColoresService } from 'src/app/services/vehiculos-colores.service';
import { VehiculosMarcasService } from 'src/app/services/vehiculos-marcas.service';
import { VehiculosModelosService } from 'src/app/services/vehiculos-modelos.service';
import { VehiculosTitularesService } from 'src/app/services/vehiculos-titulares.service';
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
  public showModalAltaPersona = false;

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

  // Persona
  public apellido: string = '';
  public nombre: string = '';
  public dni: string = '';
  public domicilio: string = '';
  public telefono: string = '';
  public mail: string = '';
  public sigem: boolean = false;
  public genero: string = '';

  // Titulares del vehiculo
  public totalPorcentaje = 0;
  public porcentajeFaltante = 0;
  public titulares: any = [];
  public porcentaje: number = null;
  public numero_titulo: string = '';

  // Personas
  public dniBusqueda: string = '';
  public personaSeleccionada: any = null;

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
    columna: 'createdAt'
  }

  constructor(
    private personasService: PersonasService,
    private vehiculosTitulares: VehiculosTitularesService,
    private sigemService: SigemService,
    private vehiculosService: VehiculosService,
    private coloresService: VehiculosColoresService,
    private marcasService: VehiculosMarcasService,
    private modeloService: VehiculosModelosService,
    private authService: AuthService,
    private alertService: AlertService,
    private dataService: DataService
  ) { }

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
        this.showModalTitulares = false;
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

    // Verificacion: El porcentaje total debe ser 100
    if (this.totalPorcentaje !== 100) {
      this.alertService.info('El porcentaje total debe ser 100%');
      return;
    }

    this.alertService.loading();

    const dataVehiculo = {
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

    this.vehiculosService.nuevoVehiculo(dataVehiculo).subscribe(({ vehiculo }) => {
      this.nuevosTitulares(vehiculo.id);
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });

  }

  // Nuevos titulares
  nuevosTitulares(vehiculo: number): void {
    
    let dataTitulares = [];

    this.titulares.map( titular => {
      dataTitulares.push({
        ...titular,
        vehiculo
      });
    })

    console.log(dataTitulares);

    this.vehiculosTitulares.nuevosTitulares(dataTitulares).subscribe({
      next: () => {
        this.listarVehiculos();
      },error: ({error}) => this.alertService.errorApi(error.message)
    })  

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

    // Verificaciones

    if (this.patente.trim() === '') {
      this.alertService.info('Debe colocar una patente');
      return;
    }

    if (this.color.trim() === '') {
      this.alertService.info('Debe seleccionar un color');
      return;
    }

    if (this.marca.trim() === '') {
      this.alertService.info('Debe seleccionar una marca');
      return;
    }

    if (this.modelo.trim() === '') {
      this.alertService.info('Debe seleccionar un modelo');
      return;
    }

    if (this.modelo.trim() === '') {
      this.alertService.info('Debe seleccionar un modelo');
      return;
    }

    if (!this.ano || this.ano < this.LIMIT_ANO) {
      this.alertService.info('Debes colocar una año válido');
      return;
    }

    this.showModalVehiculo = false;
    this.showModalTitulares = true;
  }

  // Buscar persona
  buscarPersona(): void {

    // Verificacion de DNI
    if (this.dniBusqueda.trim() === '') {
      this.alertService.info('Debe colocar un DNI');
      return;
    }

    this.alertService.loading();

    const data = {
      dni: this.dniBusqueda,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId
    }

    this.sigemService.getPersona(data).subscribe({
      next: ({ persona }) => {

        if(persona){
          this.personaSeleccionada = persona;
        }else{
          this.reiniciarFormularioPersona();
          this.dni = this.dniBusqueda;
          this.showModalTitulares = false;
          this.showModalAltaPersona = true;
        }
        
        this.dniBusqueda = '';
        this.numero_titulo = '';
        this.porcentaje = null;
        this.calcularTotalesTitulo();
        this.alertService.close();

      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })


  }

  // Nueva persona
  nuevaPersona(): void {

    // Verificacion: Apellido vacio
    if (this.apellido.trim() === "") {
      this.alertService.info('Debes colocar un apellido');
      return;
    }

    // Verificacion: Nombre vacio
    if (this.nombre.trim() === "") {
      this.alertService.info('Debes colocar un nombre');
      return;
    }

    // Verificacion: DNI
    if (this.dni.trim() === "") {
      this.alertService.info('Debes colocar un DNI');
      return;
    }

    // Verificacion: Telefono
    if (this.telefono.trim() === "") {
      this.alertService.info('Debes colocar un número de teléfono');
      return;
    }

    // Verificacion: Domicilio
    if (this.domicilio.trim() === "") {
      this.alertService.info('Debes colocar un domicilio');
      return;
    }

    // Verificacion: Email
    if (this.mail.trim() === "") {
      this.alertService.info('Debes colocar un email');
      return;
    }

    this.alertService.loading();

    const data = {
      apellido: this.apellido,
      nombre: this.nombre,
      dni: this.dni,
      telefono: this.telefono,
      mail: this.mail,
      domicilio: this.domicilio,
      sigem: false,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.personasService.nuevaPersona(data).subscribe(({ persona }) => {
      this.personaSeleccionada = persona;
      this.showModalAltaPersona = false;
      this.showModalTitulares = true;
      this.alertService.close();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });

  }

  // Regresar a datos de vehiculo
  regresarVehiculo(): void {
    this.showModalVehiculo = true;
    this.showModalTitulares = false;
  }

  // Regresar a titulares
  regresarTitulares(): void {
    this.showModalAltaPersona = false;
    this.showModalTitulares = true;
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

    let titularRepetido = this.titulares.find(titular => titular.id === this.personaSeleccionada.id);

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

    console.log(this.titulares);

    this.personaSeleccionada = null;
    this.calcularTotalesTitulo();

  }

  // Eliminar persona
  eliminarPersona(): void {
    this.personaSeleccionada = null;
    this.numero_titulo = '';
    this.porcentaje = null;
    this.dniBusqueda = '';
    this.calcularTotalesTitulo();
  }

  // Eliminar titular
  eliminarTitular(idPersona: number): void {
    console.log(idPersona);
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

  // Reiniciando formulario
  reiniciarFormulario(): void {

    // Formulario de vehiculo
    this.patente = '';
    this.marca = '';
    this.modelo = '';
    this.motor = '';
    this.chasis = '';
    this.color = '';
    this.ano = null;

    // Formulario de titulares
    this.personaSeleccionada = null;
    this.titulares = [];

  }

  // Reiniciar formulario de persona
  reiniciarFormularioPersona(): void {
    this.apellido = '';
    this.nombre = '';
    this.dni = '';
    this.domicilio = '';
    this.telefono = '';
    this.mail = '';
    this.sigem = false;
    this.genero = '';
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
