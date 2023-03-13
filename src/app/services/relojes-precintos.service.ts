import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class RelojesPrecintosService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) {}

  // Nuevo precinto
  nuevoPrecinto(data: any): Observable<any> {
    return this.http.post(`${base_url}/relojes-precintos`, data, {
      headers: this.getToken
    });
  };

  // Precinto por ID
  getPrecinto(id: string): Observable<any> {
    return this.http.get(`${base_url}/relojes-precintos/${ id }`,{ 
      headers: this.getToken
    });
  };

  // Listar precintos
  listarPrecintos(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/relojes-precintos`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'descripcion'
      },
      headers: this.getToken
    });
  }

  // Actualizar precinto
  actualizarPrecinto(id:string, data: any): Observable<any> {
    return this.http.put(`${base_url}/relojes-precintos/${id}`, data, {
      headers: this.getToken
    });
  }

}
