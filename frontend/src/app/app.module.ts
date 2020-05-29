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
import { HistoryTableEffects } from './components/history-table/store/history-table.effects';
import { historyTableReducer } from './components/history-table/store/history-table.reducer';
import { ConfigurationEffects } from './view/configuration/store/configuration.effects';
import { configurationReducer } from './view/configuration/store/configuration.reducer';
import { FormsModule } from '@angular/forms';
import { HistoryRecordComponent } from './view/history-record/history-record.component';
import { LoginComponent } from './view/login/login.component';
import { AgCellButtonComponent } from './components/history-table/ag-cell-button/ag-cell-button.component';
import { ReportComponent } from './view/report/report.component';
import { routes } from './app.routes';
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
    MenuSectionComponent,
    HistoryRecordComponent,
    LoginComponent,
    AgCellButtonComponent,
    ReportComponent,
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
    ImagesComparerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({
      app: appReducer,
      overview: overviewReducer,
      dashboard: dashboardReducer,
      configurationView: configurationReducer,
      historyTable: historyTableReducer,
      jobs: jobsReducer,
      jobPage: jobPageReducer,
      scenarioPage: scenarioPageReducer,
      comparer: comparerPageReducer
    }),
    // StoreDevtoolsModule should be imported after StoreModule
    StoreDevtoolsModule.instrument({
      maxAge:25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot([
      NavigationEffects,
      OverviewEffects,
      DashboardEffects,
      ConfigurationEffects,
      HistoryTableEffects,
      JobsEffects,
      JobPageEffects,
      ScenarioPageEffects,
      ComparerEffects
    ]),
    RouterModule.forRoot(routes),
    AgGridModule.withComponents([])
  ],
  entryComponents: [
    AgCellButtonComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
