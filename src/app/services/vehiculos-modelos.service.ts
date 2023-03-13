import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class VehiculosModelosService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) {}

  // Nuevo modelo
  nuevoModelo(data: any): Observable<any> {
    return this.http.post(`${base_url}/vehiculos-modelos`, data, {
      headers: this.getToken
    });
  };

  // Modelo por ID
  getModelo(id: number): Observable<any> {
    return this.http.get(`${base_url}/vehiculos-modelos/${ id }`,{ 
      headers: this.getToken
    });
  };

  // Listar modelos
  listarModelos(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/vehiculos-modelos`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'descripcion',
        marca: parametros?.marca || ''
      },
      headers: this.getToken
    });
  }

  // Actualizar modelo
  actualizarModelos(id:number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/vehiculos-modelos/${id}`, data, {
      headers: this.getToken
    });
  }  

}
