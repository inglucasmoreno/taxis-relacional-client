import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PermisionariosService {
  
  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) {}

  // Nuevo permisionario
  nuevoPermisionario(data: any): Observable<any> {
    return this.http.post(`${base_url}/permisionarios`, data, {
      headers: this.getToken
    });
  };

  // Permisionario por ID
  getPermisionario(id: string): Observable<any> {
    return this.http.get(`${base_url}/permisionarios/${ id }`,{ 
      headers: this.getToken
    });
  };

  // Listar permisionarios
  listarPermisionarios(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/permisionarios`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'descripcion'
      },
      headers: this.getToken
    });
  }

  // Actualizar permisionarios
  actualizarPermisionarios(id:string, data: any): Observable<any> {
    return this.http.put(`${base_url}/permisionarios/${id}`, data, {
      headers: this.getToken
    });
  }  

}
