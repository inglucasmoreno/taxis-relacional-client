import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Nuevo vehiculo
  nuevoVehiculo(data: any): Observable<any> {
    return this.http.post(`${base_url}/vehiculos`, data, {
      headers: this.getToken
    });
  };

  // Vehiculo por ID
  getVehiculo(id: number): Observable<any> {
    return this.http.get(`${base_url}/vehiculos/${id}`, {
      headers: this.getToken
    });
  };

  // Vehiculo por parametro
  getVehiculoPorParametro({ parametro = '', valor = '' }): Observable<any> {
    return this.http.get(`${base_url}/vehiculos/${parametro}/${valor}`, {
      headers: this.getToken
    });
  };

  // Listar vehiculos
  listarVehiculos(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/vehiculos`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'createdAt',
        activo: parametros?.activo || '',
        parametro: parametros?.parametro || '',
        desde: parametros?.desde || 0,
        cantidadItems: parametros?.cantidadItems || 10000000,
      },
      headers: this.getToken
    });
  }

  // Actualizar vehiculo
  actualizarVehiculo(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/vehiculos/${id}`, data, {
      headers: this.getToken
    });
  }

}
