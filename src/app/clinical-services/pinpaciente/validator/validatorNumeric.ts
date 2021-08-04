import {AbstractControl } from '@angular/forms';

export class ValidationPinPaciente {
  static isNumberInt(control: AbstractControl) {
    const value = control.value;
    let num = "0123456789";
    let isnum = false;
    if (value == null || value == '') {
      return {isNumberInt: false};
    }
    if (value != null && value != '') {
      for (let i = 0; i < value.length; i++) {
        if (num.indexOf(value[i]) == -1) {
          return {isNumberInt: true};
        }
      }
      return null;
    }
    else {
      return {isNumberInt: true};
    }
    return null;
  }
}
