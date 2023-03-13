import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { PersonasService } from 'src/app/services/personas.service';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: []
})
export class PersonasComponent implements OnInit {

  // Permisos de usuarios login
  public permisos = { all: false };

  // Modal
  public showModalPersona = false;

  // Estado formulario 
  public estadoFormulario = 'crear';

  // Persona
  public idPersona: number = 0;
  public personas: any = [];
  public personaSeleccionada: any;

  // DataForm - Persona
  public apellido: string = '';
  public nombre: string = '';
  public dni: string = '';
  public domicilio: string = '';
  public telefono: string = '';
  public mail: string = '';
  public sigem: boolean = false;
  public genero: string = '';

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
    columna: 'apellido'
  }

  constructor(private personasService: PersonasService,
    private authService: AuthService,
    private alertService: AlertService,
    private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Personas';
    // this.permisos.all = this.permisosUsuarioLogin();
    this.alertService.loading();
    this.listarPersonas();
  }

  // Asignar permisos de usuario login
  // permisosUsuarioLogin(): boolean {
  //   return this.authService.usuario.permisos.includes('PERSONAS_ALL') || this.authService.usuario.role === 'ADMIN_ROLE';
  // }

  // Abrir modal
  abrirModal(estado: string, persona: any = null): void {
    window.scrollTo(0, 0);
    this.reiniciarFormulario();

    this.idPersona = 0;

    if (estado === 'editar') this.getPersona(persona);
    else this.showModalPersona = true;

    this.estadoFormulario = estado;
  }

  // Traer datos de persona
  getPersona(persona: any): void {
    this.alertService.loading();
    this.idPersona = persona.id;
    this.personaSeleccionada = persona;
    this.personasService.getPersona(persona.id).subscribe(({ persona }) => {

      // DataForm - Persona
      this.apellido = persona.apellido;
      this.nombre = persona.nombre;
      this.dni = persona.dni;
      this.telefono = persona.telefono;
      this.mail = persona.mail;
      this.domicilio = persona.domicilio;
      this.sigem = persona.sigem;

      this.alertService.close();
      this.showModalPersona = true;

    }, ({ error }) => {
      this.alertService.errorApi(error);
    });
  }

  // Listar personas
  listarPersonas(): void {
    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna,
      parametro: this.filtro.parametro,
      desde: this.desde,
      cantidadItems: this.cantidadItems
    }
    this.personasService.listarPersonas(parametros)
      .subscribe(({ personas, totalItems }) => {
        this.personas = personas;
        this.totalItems = totalItems;
        this.showModalPersona = false;
        this.alertService.close();
      }, (({ error }) => {
        this.alertService.errorApi(error.msg);
      }));
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

    console.log(data);

    this.personasService.nuevaPersona(data).subscribe(() => {
      this.listarPersonas();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });

  }

  // Actualizar persona
  actualizarPersona(): void {

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
      this.alertService.info('Debes colocar un Email');
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
      updatorUser: this.authService.usuario.userId,
    }

    this.personasService.actualizarPersona(this.idPersona, data).subscribe(() => {
      this.listarPersonas();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(persona: any): void {

    const { id, activo } = persona;

    if (!this.permisos.all) return this.alertService.info('Usted no tiene permiso para realizar esta acción');

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.personasService.actualizarPersona(id, { activo: !activo }).subscribe(() => {
            this.alertService.loading();
            this.listarPersonas();
          }, ({ error }) => {
            this.alertService.close();
            this.alertService.errorApi(error.message);
          });
        }
      });

  }

  // Reiniciando formulario
  reiniciarFormulario(): void {
    this.apellido = '',
      this.nombre = '',
      this.dni = '',
      this.telefono = '',
      this.mail = '',
      this.domicilio = ''
    this.sigem = false;
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
    this.listarPersonas();
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
    this.listarPersonas();
  }

}
