import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SegurosEmpresasService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) {}

  // Nueva empresa
  nuevaEmpresa(data: any): Observable<any> {
    return this.http.post(`${base_url}/seguros-empresas`, data, {
      headers: this.getToken
    });
  };

  // Empresa por ID
  getEmpresa(id: number): Observable<any> {
    return this.http.get(`${base_url}/seguros-empresas/${ id }`,{ 
      headers: this.getToken
    });
  };

  // Listar empresas
  listarEmpresas(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/seguros-empresas`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'descripcion'
      },
      headers: this.getToken
    });
  }

  // Actualizar empresas
  actualizarEmpresa(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/seguros-empresas/${id}`, data, {
      headers: this.getToken
    });
  } 

}
