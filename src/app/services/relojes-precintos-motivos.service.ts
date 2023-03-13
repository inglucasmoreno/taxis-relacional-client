import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class RelojesPrecintosMotivosService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) {}

  // Nuevo motivo
  nuevoMotivo(data: any): Observable<any> {
    return this.http.post(`${base_url}/relojes-precintos-motivos`, data, {
      headers: this.getToken
    });
  };

  // Motivo por ID
  getMotivo(id: number): Observable<any> {
    return this.http.get(`${base_url}/relojes-precintos-motivos/${ id }`,{ 
      headers: this.getToken
    });
  };

  // Listar motivos
  listarMotivos(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/relojes-precintos-motivos`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'descripcion'
      },
      headers: this.getToken
    });
  }

  // Actualizar motivo
  actualizarMotivo(id:number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/relojes-precintos-motivos/${id}`, data, {
      headers: this.getToken
    });
  }  

}
