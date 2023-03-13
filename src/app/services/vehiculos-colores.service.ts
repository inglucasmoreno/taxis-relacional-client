import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class VehiculosColoresService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Nuevo color
  nuevoColor(data: any): Observable<any> {
    return this.http.post(`${base_url}/vehiculos-colores`, data, {
      headers: this.getToken
    });
  };

  // Color por ID
  getColor(id: number): Observable<any> {
    return this.http.get(`${base_url}/vehiculos-colores/${id}`, {
      headers: this.getToken
    });
  };

  // Listar colores
  listarColores(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/vehiculos-colores`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'descripcion'
      },
      headers: this.getToken
    });
  }

  // Actualizar colores
  actualizarColores(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/vehiculos-colores/${id}`, data, {
      headers: this.getToken
    });
  }

}
