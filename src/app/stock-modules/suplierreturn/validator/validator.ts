import { AbstractControl } from "@angular/forms";
export class ValidationSuplierReturn {
  static esNumero(control: AbstractControl) {
    const value = control.value;
    let num = "0123456789";
    let esnum = false;
    if ( value === '' || value === null) {
      return { esNumero: false };
    }
    if (value != null && value != '') {
      for (let i = 0; i < value.length; i++) {
        if (value[i] === '-' && i === 0)
          continue;
        if (num.indexOf(value[i]) === -1) {
          return {esNumero: true};
        }
      }
      if (value === '-')
        return {esNumero: true};
      return null;
    }
    return null;
  }
}
