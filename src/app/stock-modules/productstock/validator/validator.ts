import { AbstractControl } from "@angular/forms";
import { map } from 'rxjs/operators';
import { ProductstockService } from '../services/productstock.service';
export class ValidationProductStock {
  static validateFieldCodec(productstockService: ProductstockService, id: any) {
    console.log('mira los ID Validator: ', id);
    return(control: AbstractControl) => {
      const value = control.value;
      return productstockService.checkNumber(value, id)
        .pipe(
          map( response => {
            console.log('mira aqui: ', response);
            //vlor true para que no de error
            return response.isNumberAvailable ? null : { notAvailable: true };
          })
        );
    };
  }
}
