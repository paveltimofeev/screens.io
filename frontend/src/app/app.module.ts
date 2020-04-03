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
import { StatsComponent } from './components/stats/stats.component';
import { MenuSectionComponent } from './components/menu-section/menu-section.component';

import { StoreModule } from '@ngrx/store';
import { appReducer } from './store/reducer';
import { dashboardReducer } from './view/dashboard/store/dashboard.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { DashboardEffects } from './view/dashboard/store/dashboard.effects';

const routes = [
  { path: '', component: DashboardComponent },
  { path: 'config/:scenario', component:ConfigurationComponent },
  { path: '**', component: DashboardComponent }
];


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
    HistoryTableComponent,
    StatsComponent,
    MenuSectionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({
      app: appReducer,
      dashboard: dashboardReducer
    }),
    // StoreDevtoolsModule should be imported after StoreModule
    StoreDevtoolsModule.instrument({
      maxAge:25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot([DashboardEffects]),
    RouterModule.forRoot(routes),
    AgGridModule.withComponents([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
