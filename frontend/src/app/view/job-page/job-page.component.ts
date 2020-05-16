import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.css']
})
export class JobPageComponent implements OnInit {

  id:string;

  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
  }
}
