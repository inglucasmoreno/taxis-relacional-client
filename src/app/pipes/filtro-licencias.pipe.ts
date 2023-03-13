import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroLicencias'
})
export class FiltroLicenciasPipe implements PipeTransform {

  transform(valores: any[], parametro: string, estado: string): any {

    let filtrados: any[];

    // Estado
    if (estado) {
      filtrados = valores.filter(valor => valor.estado === estado)
    } else {
      filtrados = valores;
    }

    // Filtrado por parametro
    parametro = parametro.toLocaleLowerCase();

    if (parametro.length !== 0) {
      return filtrados.filter(valor => {
        return valor.nro_licencia.toLocaleLowerCase().includes(parametro)
      });
    } else {
      return filtrados;
    }

  }

}
