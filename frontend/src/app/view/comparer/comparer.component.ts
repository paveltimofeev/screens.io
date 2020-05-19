import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-comparer',
  templateUrl: './comparer.component.html',
  styleUrls: ['./comparer.component.css']
})
export class ComparerComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy () {
    //this.store.dispatch(cleanupNgrxStorage())
  }
}
