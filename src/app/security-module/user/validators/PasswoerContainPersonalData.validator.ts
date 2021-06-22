import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordHasPersonalDataValidator(data: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;

    if (!value) {
      return null;
    }

    let valid = true;

    data.forEach((item) => {
      valid = !value.includes(item);
    });

    return !valid ? { containPersonalData: true, data: data } : null;
  };
}
