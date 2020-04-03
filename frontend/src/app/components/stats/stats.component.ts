import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  @Input()
  casesCount: number;

  @Input()
  historyRecordsCount: number;

  @Input()
  successRate: number;

  constructor() { }

  ngOnInit() {
  }

}
