import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class VehiculosTitularesService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Nuevo titular
  nuevoTitular(data: any): Observable<any> {
    return this.http.post(`${base_url}/vehiculos-titulares`, data, {
      headers: this.getToken
    });
  };

  // Titular por ID
  getTitular(id: number): Observable<any> {
    return this.http.get(`${base_url}/vehiculos-titulares/${id}`, {
      headers: this.getToken
    });
  };

  // Listar titulares
  listarTitulares(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/vehiculos-titulares`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'descripcion'
      },
      headers: this.getToken
    });
  }

  // Actualizar titulares
  actualizarTitulares(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/vehiculos-titulares/${id}`, data, {
      headers: this.getToken
    });
  }

}
