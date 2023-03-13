import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroVehiculos'
})
export class FiltroVehiculosPipe implements PipeTransform {

  transform(valores: any[], parametro: string, activo: string): any {
    
    // Trabajando con activo boolean
    let boolActivo: boolean;
    let filtrados: any[];
  
    // Creando variable booleana
    if(activo === 'true') boolActivo = true;
    else if(activo === 'false') boolActivo = false; 
    else boolActivo = null;
    
    // Filtrado Activo - Inactivo - Todos
    if(boolActivo !== null){
      filtrados = valores.filter( valor => {
        return valor.activo == boolActivo;
      });
    }else if(boolActivo === null){
      filtrados = valores; 
    }
    
    // Filtrado por parametro
    parametro = parametro.toLocaleLowerCase();
    
    if(parametro.length !== 0){
      return filtrados.filter( valor => { 
        return valor.patente.toLocaleLowerCase().includes(parametro) ||
               valor.marca['descripcion'].toLocaleLowerCase().includes(parametro) ||
               valor.modelo['descripcion'].toLocaleLowerCase().includes(parametro) ||
               valor.color['descripcion'].toLocaleLowerCase().includes(parametro) ||
               valor.motor.toLocaleLowerCase().includes(parametro) ||
               valor.chasis.toLocaleLowerCase().includes(parametro)
      });
    }else{
      return filtrados;
    }

  }

}
