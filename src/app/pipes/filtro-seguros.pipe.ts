import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroSeguros'
})
export class FiltroSegurosPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
