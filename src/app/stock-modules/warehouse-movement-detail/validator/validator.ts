import { AbstractControl } from "@angular/forms";
export class ValidationWarehouse{
  static isDecimalFijo154(control: AbstractControl) {
    let value = control.value;
    if (value == null || value == ''){
      return {isDecimal: false};
    }
    else {
      if (value.length > 2){
        if(value[0] == '0' && value[1] != '.')
          return {isDecimalFijo154: true};
      }
      let num = '0123456789';
      let contpoint = 0;
      for(let i = 0; i < value.length; i++) {
        if(contpoint >= 2 ) {
          //tienes mas de 2 puntos
          console.log('DIOS 1');
          return {isDecimalFijo154: true};
        }
        if (num.indexOf(value[i]) != -1) {
          //eres un numero
          //solo eres parte entera
          if (contpoint === 0 && value.length >= 16) {
            console.log('DIOS 2');
            return {isDecimalFijo154: true};
          }
          if (contpoint === 1) {
            const prueba = value.split('.');
            console.log('las pruebas:', prueba);
            if (prueba[0].length >= 18 || prueba[1].length >= 5) {
              console.log('DIOS 3');
              return {isDecimalFijo154: true};
            }
          }
          continue;
        }
        else if (value[i] == '.') {
          if (i == 0 || i == (value.length) - 1 ) {
            //punto esta al principio o al final
            console.log('DIOS 4');
            return {isDecimalFijo154: true};
          }
          contpoint += 1;
        }
        else{
          //si no eres ni numero ni punto error
          console.log('DIOS 5');
          return {isDecimalFijo154: true};
        }
      }
  }
  return null;
}
  static isDecimalFijo172(control: AbstractControl) {
    let value = control.value;
    if (value == null || value == ''){
      return {isDecimalFijo172: false};
    }
    else {
      if (value.length > 2){
        if(value[0] == '0' && value[1] != '.')
          return {isDecimalFijo172: true};
      }
      let num = '0123456789';
      let contpoint = 0;
      for(let i = 0; i < value.length; i++) {
        if(contpoint >= 2 ) {
          //tienes mas de 2 puntos
          console.log('DIOS 1');
          return {isDecimalFijo172: true};
        }
        if (num.indexOf(value[i]) != -1) {
          //eres un numero
          //solo eres parte entera
          if (contpoint === 0 && value.length >= 18) {
            console.log('DIOS 2');
            return {isDecimalFijo172: true};
          }
          if (contpoint === 1) {
            const prueba = value.split('.');
            console.log('las pruebas:', prueba);
            if (prueba[0].length >= 18 || prueba[1].length >= 3) {
              console.log('DIOS 3');
              return {isDecimalFijo172: true};
            }
          }
          continue;
        }
        else if (value[i] == '.') {
          if (i == 0 || i == (value.length) - 1 ) {
            //punto esta al principio o al final
            console.log('DIOS 4');
            return {isDecimalFijo172: true};
          }
          contpoint += 1;
        }
        else{
          //si no eres ni numero ni punto error
          console.log('DIOS 5');
          return {isDecimalFijo172: true};
        }
      }
    }
    return null;
  }
  static isInts(control: AbstractControl) {
    let value = control.value;
    if (value == null || value == '') {
      console.log('A1');
      return null;
    }
    else {
      let num = '0123456789';
      for (let i = 0; i < value.length; i++) {
        if (num.indexOf(value[i]) == -1) {
          console.log('A2');
          return {isInts: true};
        }
      }
    }
    var valor = parseInt(value);
    if (valor < 0 || valor > 2147483647 ){
      console.log('A3');
      return {isInts: true};
    }

    console.log('A4');
    return null;
  }
}
