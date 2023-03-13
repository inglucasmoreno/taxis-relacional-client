import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) {}

  // Nueva persona
  nuevaPersona(data: any): Observable<any> {
    return this.http.post(`${base_url}/personas`, data, {
      headers: this.getToken
    });
  };

  // Persona por ID
  getPersona(id: number): Observable<any> {
    return this.http.get(`${base_url}/personas/${ id }`,{ 
      headers: this.getToken
    });
  };

  // Persona por parametro
  getPersonaPorParametro({ parametro = '', valor = '' }): Observable<any> {
    return this.http.get(`${base_url}/personas/${parametro}/${valor}`,{ 
      headers: this.getToken
    });
  };

  // Listar personas
  listarPersonas(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/personas`, {
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

  // Actualizar persona
  actualizarPersona(id:number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/personas/${id}`, data, {
      headers: this.getToken
    });
  }  

}
