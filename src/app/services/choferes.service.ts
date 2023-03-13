import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ChoferesService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) {}

  // Nuevo chofer
  nuevoChofer(data: any): Observable<any> {
    return this.http.post(`${base_url}/choferes`, data, {
      headers: this.getToken
    });
  };

  // Chofer por ID
  getChofer(id: string): Observable<any> {
    return this.http.get(`${base_url}/choferes/${ id }`,{ 
      headers: this.getToken
    });
  };

  // Listar choferes
  listarChoferes(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/choferes`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'descripcion'
      },
      headers: this.getToken
    });
  }

  // Actualizar chofer
  actualizarChofer(id:string, data: any): Observable<any> {
    return this.http.put(`${base_url}/choferes/${id}`, data, {
      headers: this.getToken
    });
  }  

}
