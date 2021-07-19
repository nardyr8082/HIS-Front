import { AbstractControl } from "@angular/forms";
import { BoxstockService } from '../services/boxstock.service';
import { map } from 'rxjs/operators';
export class MyValidation{
  static isNumberInt(control: AbstractControl){
    const value = control.value;
    let num = "0123456789";
    let isnum = false;
    if(value != null && value != ''){
      for(let i = 0; i < value.length; i++) {
        if (num.indexOf(value[i]) == -1) {
          return {isNumber: true};
        }
      }
      return null;
    }
    else{
      return {isNumber: true};
    }
    return null;
  }
  static isDecimal(control: AbstractControl){
    let value = control.value;
    if (value == null || value == ''){
      return {isDecimal: true};
    }
    else{
      if(value.length > 2){
        if(value[0] == '0' && value[1] != '.')
          return {isDecimal: true};
      }
      let num = "0123456789";
      let contpoint = 0;
      for(let i = 0; i < value.length; i++) {
        if(contpoint >=2 ){
          return {isDecimal: true};
        }
        if (num.indexOf(value[i]) != -1) {
          continue;
        }
        else if(value[i] == '.'){
          if(i == 0 || i == (value.length)-1)
          return {isDecimal: true};
          contpoint += 1;
        }
        else{
          return {isDecimal: true};
        }
      }
  }
  return null;
}
  static validateFieldNumber(boxstockService: BoxstockService){
    return(control: AbstractControl) => {
      const value = control.value;
      return boxstockService.checkNumber(value)
      .pipe(
        map( response => {
          console.log('mira mi response: ', response);
          return response.isNumberAvailable ? null : { notAvailable: true };
        })
      );
    };
  }
}
