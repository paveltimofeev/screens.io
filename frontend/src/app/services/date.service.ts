import { Injectable } from '@angular/core';
import * as moment from 'moment'

@Injectable({
  providedIn: 'root'
})
export class DateService {

  fromNow (date:string): string {
    return moment(date).fromNow();
  }

  calendar (date:string): string {
    return moment(date).calendar()
  }

  short (date:any): string {
    return moment(date).format('DD/MM/YY_hh:mm')
  }
}
