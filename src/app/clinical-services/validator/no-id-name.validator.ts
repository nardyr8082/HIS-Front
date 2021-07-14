import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noIdName(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }
    let hasId = false;
    if (value === 'id' || value === 'Id' || value === 'iD' || value === 'ID') {
      hasId = true;
    }
    return hasId ? { hasId: hasId } : null;
  };
}
