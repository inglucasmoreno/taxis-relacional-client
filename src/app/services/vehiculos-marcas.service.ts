import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class VehiculosMarcasService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) {}

  // Nueva marca
  nuevaMarca(data: any): Observable<any> {
    return this.http.post(`${base_url}/vehiculos-marcas`, data, {
      headers: this.getToken
    });
  };

  // Marca por ID
  getMarca(id: number): Observable<any> {
    return this.http.get(`${base_url}/vehiculos-marcas/${ id }`,{ 
      headers: this.getToken
    });
  };

  // Listar marcas
  listarMarcas(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/vehiculos-marcas`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'descripcion',
      },
      headers: this.getToken
    });
  }

  // Actualizar marcas
  actualizarMarcas(id:number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/vehiculos-marcas/${id}`, data, {
      headers: this.getToken
    });
  }  

}
