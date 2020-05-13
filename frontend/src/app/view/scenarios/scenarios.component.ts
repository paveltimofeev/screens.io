import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  testHandler(e:any, label:string='testHandler') {
    console.log(label, e);
  }

}
