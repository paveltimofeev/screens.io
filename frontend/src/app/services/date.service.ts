import { Injectable } from '@angular/core';
import * as moment from 'moment'

@Injectable({
  providedIn: 'root'
})
export class DateService {

  fromNow (date:string) {
    return moment(date).fromNow();
  }

  calendar (date:string) {
    return moment(date).calendar()
  }
}
