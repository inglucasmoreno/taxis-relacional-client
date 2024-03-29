import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class LicenciasService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Nueva licencia
  nuevaLicencia(data: any): Observable<any> {
    return this.http.post(`${base_url}/licencias`, data, {
      headers: this.getToken
    });
  };

  // Licencia por ID
  getLicencia(id: number): Observable<any> {
    return this.http.get(`${base_url}/licencias/${id}`, {
      headers: this.getToken
    });
  };

  // Listar licencias
  listarLicencias(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/licencias`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'createdAt',
        activo: parametros?.activo || '',
        parametro: parametros?.parametro || '',
        estado: parametros?.estado || '',
        tipo_servicio: parametros?.tipo_servicio || '',
        desde: parametros?.desde || 0,
        cantidadItems: parametros?.cantidadItems || 10000000,
      },
      headers: this.getToken
    });
  }

  // Actualizar licencias
  actualizarLicencias(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/licencias/${id}`, data, {
      headers: this.getToken
    });
  }

}
