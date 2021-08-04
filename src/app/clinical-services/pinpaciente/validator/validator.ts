import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';


export function isEqual(id: any) {
  return (control: AbstractControl): {[key: string]: boolean} | null => {
    const value = control.value;
    if (value == null || value == '') {
      return null;
    }
    console.log('formato', id);
    console.log('id', id.pin);
    return id.pin === value ? null : {isEqual: true};
  };

}


export const bothEqual: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  console.log('TODO', control);
  const news = control.get('pin_nuevo');
  const confirm = control.get('pin_confirmar');
  console.log('NEWS', news.value);
  console.log('CONFIRM', confirm.value);
  if (news.value === null || confirm.value === null){
    console.log('OK 1');
    return null;
  }

  if (news.value === confirm.value){
    console.log('OK 2');
    return null;
  }
  console.log('OK 3');
  return { bothEqual: true };
};
