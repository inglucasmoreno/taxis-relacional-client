import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class VehiculosSegurosService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) {}

  // Nuevo seguro
  nuevoSeguro(data: any): Observable<any> {
    return this.http.post(`${base_url}/vehiculos-seguros`, data, {
      headers: this.getToken
    });
  };

  // Seguro por ID
  getSeguro(id: number): Observable<any> {
    return this.http.get(`${base_url}/vehiculos-seguros/${ id }`,{ 
      headers: this.getToken
    });
  };

  // Listar seguros
  listarSeguros(parametros?: any): Observable<any> {
    console.log(parametros);
    return this.http.get(`${base_url}/vehiculos-seguros`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'descripcion',
        activo: parametros?.activo || '',
        parametro: parametros?.parametro || '',
        desde: parametros?.desde || 0,
        cantidadItems: parametros?.cantidadItems || 10000000,
      },
      headers: this.getToken
    });
  }

  // Actualizar seguro
  actualizarSeguro(id:number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/vehiculos-seguros/${id}`, data, {
      headers: this.getToken
    });
  }  

}
