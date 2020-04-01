import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';

import { DashboardComponent } from './view/dashboard/dashboard.component';
import { ConfigurationComponent } from './view/configuration/configuration.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { SectionSubheaderComponent } from './components/section-subheader/section-subheader.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { ScenarioCardComponent } from './components/scenario-card/scenario-card.component';
import { InputBoxComponent } from './components/input-box/input-box.component';
import { SelectorsBoxComponent } from './components/selectors-box/selectors-box.component';
import { AddScenarioButtonComponent } from './components/add-scenario-button/add-scenario-button.component';
import { HistoryTableComponent } from './components/history-table/history-table.component';
import { AgGridModule } from 'ag-grid-angular';

const routes = [
  { path: '', component: DashboardComponent },
  { path: 'config/:scenario', component:ConfigurationComponent }
]


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ConfigurationComponent,
    NavbarComponent,
    SidebarComponent,
    PageHeaderComponent,
    SectionHeaderComponent,
    SectionSubheaderComponent,
    TopMenuComponent,
    ScenarioCardComponent,
    InputBoxComponent,
    SelectorsBoxComponent,
    AddScenarioButtonComponent,
    HistoryTableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    AgGridModule.withComponents([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
