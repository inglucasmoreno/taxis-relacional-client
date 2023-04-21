import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TiposServiciosService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Nuevo tipo
  nuevoTipo(data: any): Observable<any> {
    return this.http.post(`${base_url}/tipos-servicios`, data, {
      headers: this.getToken
    });
  };

  // Tipo por ID
  getTipo(id: number): Observable<any> {
    return this.http.get(`${base_url}/tipos-servicios/${id}`, {
      headers: this.getToken
    });
  };

  // Listar tipos de servicios
  listarTipos(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/tipos-servicios`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'descripcion'
      },
      headers: this.getToken
    });
  }

  // Actualizar tipo de servicio
  actualizarTipos(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/tipos-servicios/${id}`, data, {
      headers: this.getToken
    });
  }

}
