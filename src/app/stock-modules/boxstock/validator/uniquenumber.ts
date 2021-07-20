import { timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { BoxstockService } from '../services/boxstock.service';
 export const numberAsyncValidator =
  (numberService: BoxstockService, time: number = 500) => {
    console.log('antes 1');
    return (input: FormControl) => {
      console.log('antes 2', input.value);
      return timer(time).pipe(
        switchMap(() => numberService.checkNumber(input.value)),
        map(res => {
          //return res.isnumberAvailable ? null : {numberAvailable: false}
          console.log('antes 3');
          console.log('el mesnaje de res es ', res);
          return res.isnumberAvailable ? true : null;
        })
      );
    };
  };
