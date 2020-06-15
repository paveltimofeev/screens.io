import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HistoryTableComponent } from './components/history-table/history-table.component';
import { AgGridModule } from 'ag-grid-angular';


import { StoreModule } from '@ngrx/store';
import { appReducer } from './store/reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { LoggedIn } from './guards/logged-in.guard';

import { OverviewComponent } from './view/overview/overview.component';
import { ScenariosComponent } from './view/scenarios/scenarios.component';
import { OverviewLayoutComponent } from './layouts/overview-layout/overview-layout.component';
import { SidebarPageLayoutComponent } from './layouts/sidebar-page-layout/sidebar-page-layout.component';
import { UiKitPreviewComponent } from './ui-kit/preview/ui-kit-preview.component';
import { CardSmComponent } from './ui-kit/card-sm/card-sm.component';
import { WidgetComponent } from './ui-kit/widget/widget.component';
import { WidgetFragiledComponent } from './ui-kit/widget-fragiled/widget-fragiled.component';
import { WidgetTimelineComponent } from './ui-kit/widget-timeline/widget-timeline.component';
import { WidgetLabelComponent } from './ui-kit/widget-label/widget-label.component';
import { WidgetRunComponent } from './ui-kit/widget-run/widget-run.component';
import { ViewportsSelectorComponent } from './ui-kit/viewports-selector/viewports-selector.component';
import { TextFieldComponent } from './ui-kit/text-field/text-field.component';
import { CheckboxFieldComponent } from './ui-kit/checkbox-field/checkbox-field.component';
import { DataActionButtonComponent } from './ui-kit/data-action-button/data-action-button.component';
import { CardMdComponent } from './ui-kit/card-md/card-md.component';
import { DataSearchButtonComponent } from './ui-kit/data-search-button/data-search-button.component';
import { JobsComponent } from './view/jobs/jobs.component';
import { IconComponent } from './ui-kit/icon/icon.component';
import { ScenarioPageComponent } from './view/scenario-page/scenario-page.component';
import { JobPageComponent } from './view/job-page/job-page.component';
import { ComparerComponent } from './view/comparer/comparer.component';
import { SettingsComponent } from './view/settings/settings.component';
import { OverviewEffects } from './view/overview/store/overview.effects';
import { overviewReducer } from './view/overview/store/overview.reducer';
import { jobPageReducer } from './view/job-page/store/job-page.reducer';
import { JobPageEffects } from './view/job-page/store/job-page.effects';
import { CardLgComponent } from './ui-kit/card-lg/card-lg.component';
import { InfoTableComponent } from './ui-kit/info-table/info-table.component';
import { scenarioPageReducer } from './view/scenario-page/store/scenario-page.reducer';
import { ScenarioPageEffects } from './view/scenario-page/store/scenario-page.effects';
import { NavigationEffects } from './store/navigation/navigation.effects';
import { comparerPageReducer } from './view/comparer/store/comparer.reducer';
import { ComparerEffects } from './view/comparer/store/comparer.effects';
import { MoreComponent } from './ui-kit/more/more.component';
import { ImagesComparerComponent } from './ui-kit/images-comparer/images-comparer.component';
import { jobsReducer } from './view/jobs/store/jobs.reducer';
import { JobsEffects } from './view/jobs/store/jobs.effects';
import { scenariosReducer } from './view/scenarios/store/scenarios.reducer';
import { ScenariosEffects } from './view/scenarios/store/scenarios.effects';
import { settingsReducer } from './view/settings/store/settings.reducer';
import { SettingsEffects } from './view/settings/store/settings.effects';
import { FormButtonComponent } from './ui-kit/form-button/form-button.component';
import { LoginComponent } from './view/login/login.component';
import { accountApiReducer } from './store/account-api/account-api.reducer';
import { AccountApiEffects } from './store/account-api/account-api.effects';
import { appApiReducer } from './store/app-api/app-api.reducer';
import { AppApiEffects } from './store/app-api/app-api.effects';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HistoryTableComponent,
    LoginComponent,
    OverviewComponent,
    ScenariosComponent,
    OverviewLayoutComponent,
    SidebarPageLayoutComponent,
    UiKitPreviewComponent,
    CardSmComponent,
    WidgetComponent,
    WidgetFragiledComponent,
    WidgetTimelineComponent,
    WidgetLabelComponent,
    WidgetRunComponent,
    ViewportsSelectorComponent,
    TextFieldComponent,
    CheckboxFieldComponent,
    DataActionButtonComponent,
    CardMdComponent,
    DataSearchButtonComponent,
    JobsComponent,
    IconComponent,
    ScenarioPageComponent,
    JobPageComponent,
    ComparerComponent,
    SettingsComponent,
    CardLgComponent,
    InfoTableComponent,
    MoreComponent,
    ImagesComparerComponent,
    FormButtonComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({
      app: appReducer,
      appApi: appApiReducer,
      accountApi: accountApiReducer,
      overview: overviewReducer,
      scenarios: scenariosReducer,
      scenarioPage: scenarioPageReducer,
      jobs: jobsReducer,
      jobPage: jobPageReducer,
      comparer: comparerPageReducer,
      settings: settingsReducer
    }),
    // StoreDevtoolsModule should be imported after StoreModule
    StoreDevtoolsModule.instrument({
      maxAge:25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot([
      AppApiEffects,
      AccountApiEffects,
      NavigationEffects,
      OverviewEffects,
      ScenariosEffects,
      ScenarioPageEffects,
      JobsEffects,
      JobPageEffects,
      ComparerEffects,
      SettingsEffects
    ]),
    RouterModule.forRoot(routes),
    AgGridModule.withComponents([])
  ],
  entryComponents: [],
  providers: [ LoggedIn ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
