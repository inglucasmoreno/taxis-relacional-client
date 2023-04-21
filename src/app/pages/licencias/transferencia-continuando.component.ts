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

@Component({
  selector: 'app-transferencia-continuando',
  templateUrl: './transferencia-continuando.component.html',
  styles: [
  ]
})
export class TransferenciaContinuandoComponent implements OnInit {

  // Flag
  public showNuevaPersona = false;

  // Licencia
  public idLicencia: number = null;
  public licencia: any = null;
  
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

  constructor(
    private dataService: DataService,
    private router: Router,
    private sigemService: SigemService,
    private personasService: PersonasService,
    private licenciasTramitesService: LicenciasTramitesService,
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
      }, error: ({error}) => this.alertService.errorApi(error.message)
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

  // Tramite -> Transferencia continuando
  transferenciaContinuando(): void {

    if(!this.personaSeleccionada){
      this.alertService.info('Debe seleccionar un permisionario');
      return;
    }

    this.alertService.question({ msg: '¿Quieres realizar la transferencia continuando?', buttonText: 'Aceptar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          const data = {
            licencia: this.idLicencia,
            persona: this.personaSeleccionada.id,
            creatorUser: this.authService.usuario.userId,
            updatorUser: this.authService.usuario.userId,
          };
          this.licenciasTramitesService.transferenciaContinuando(data).subscribe({
            next: () => {
              this.router.navigateByUrl(`/dashboard/licencias/detalles/${this.idLicencia}`);
              this.alertService.close();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });

  }

}
