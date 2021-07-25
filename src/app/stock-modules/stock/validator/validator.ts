import { AbstractControl } from "@angular/forms";
import { map } from 'rxjs/operators';
import { StockService } from '../services/stock.service';
export class ValidationStock {
  static validateFieldCodec(stockService: StockService, id: any) {
    console.log('mira los ID Validator: ', id);
    return(control: AbstractControl) => {
      const value = control.value;
      return stockService.checkNumber(value, id)
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
