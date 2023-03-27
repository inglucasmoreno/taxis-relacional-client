import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { VehiculosTitularesService } from 'src/app/services/vehiculos-titulares.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import gsap from 'gsap';

@Component({
  selector: 'app-vehiculos-titulares',
  templateUrl: './vehiculos-titulares.component.html',
  styles: [
  ]
})
export class VehiculosTitularesComponent implements OnInit {

  // Vehiculo
  public idVehiculo = 0;
  public vehiculo = null;

  // Titulares
  public titularesVehiculo = [];

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private vehiculosService: VehiculosService,
    private titularesService: VehiculosTitularesService
  ) { }

  ngOnInit(): void {
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .2 });
    this.dataService.ubicacionActual = 'Dashboard - Titulares de vehículo';
    this.alertService.loading();
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.idVehiculo = id;
      this.iniciandoComponente();
    })
  }

  iniciandoComponente(): void {
    this.vehiculosService.getVehiculo(this.idVehiculo).subscribe({
      next: ({ vehiculo }) => {
        this.vehiculo = vehiculo;
        console.log(vehiculo);
        this.titularesService.listarTitulares({
          direccion: 1,
          parametro: 'porcentaje',
          vehiculo: this.idVehiculo
        }).subscribe({
          next: ({ titulares }) => {
            console.log(titulares);
            this.titularesVehiculo = titulares;
            this.alertService.close();
          }, error: ({error}) => this.alertService.errorApi(error.message)
        })
      }, error: ({error}) => this.alertService.errorApi(error.message)
    })
  }

}
