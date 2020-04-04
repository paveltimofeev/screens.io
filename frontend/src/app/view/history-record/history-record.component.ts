import { Component, OnInit } from '@angular/core';
import { ApiAdapterService } from '../../services/api-adapter.service';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-history-record',
  templateUrl: './history-record.component.html',
  styleUrls: ['./history-record.component.css']
})
export class HistoryRecordComponent implements OnInit {

  selected:string;
  records$;
  report$;
  storageUrl = environment.storage;

  constructor(
    private api: ApiAdapterService
  ) {}

  ngOnInit() {

    this.refreshHistory();
  }

  refreshHistory () {

    this.records$ = this.api.getHistory().pipe(
      map( x => x.jobs.reverse() )
    );
  }

  refreshHandler () {
    this.refreshHistory();
  }

  selectRecordHandler ($event: string) {
    this.selected = $event;

    this.report$ = this.api.getReport($event).pipe(
      map( x => x.report )
    );
  }

  approveCase (pair: any) {

    this.api.approveCase(pair).subscribe( x => {

      console.log(x)
    });
  }
}
