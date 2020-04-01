import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';

import { DashboardComponent } from './view/dashboard/dashboard.component';
import { ConfigurationComponent } from './view/configuration/configuration.component';
import { RouterModule } from '@angular/router';

const routes = [
  { path: '', component: DashboardComponent },
  { path: 'config', component:ConfigurationComponent }
]


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ConfigurationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
