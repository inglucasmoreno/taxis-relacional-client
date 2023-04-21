import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class LicenciasTramitesService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Cambio de unidad
  cambioUnidad(data: any): Observable<any> {
    return this.http.post(`${base_url}/licencias-tramites/cambio-unidad`, data, {
      headers: this.getToken
    });
  };

  // Transferencia continuando
  transferenciaContinuando(data: any): Observable<any> {
    return this.http.post(`${base_url}/licencias-tramites/transferencia-continuando`, data, {
      headers: this.getToken
    });
  };

  // Transferencia con de cambio unidad
  transferenciaCambioUnidad(data: any): Observable<any> {
    return this.http.post(`${base_url}/licencias-tramites/transferencia-cambio-unidad`, data, {
      headers: this.getToken
    });
  };

}
