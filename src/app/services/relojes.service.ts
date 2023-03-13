import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class RelojesService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) {}

  // Nuevo reloj
  nuevoReloj(data: any): Observable<any> {
    return this.http.post(`${base_url}/relojes`, data, {
      headers: this.getToken
    });
  };

  // Reloj por ID
  getReloj(id: string): Observable<any> {
    return this.http.get(`${base_url}/relojes/${ id }`,{ 
      headers: this.getToken
    });
  };

  // Listar relojes
  listarRelojes(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/relojes`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'descripcion'
      },
      headers: this.getToken
    });
  }

  // Actualizar reloj
  actualizarReloj(id:string, data: any): Observable<any> {
    return this.http.put(`${base_url}/relojes/${id}`, data, {
      headers: this.getToken
    });
  }  

}
