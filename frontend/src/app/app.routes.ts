import { DashboardComponent } from './view/dashboard/dashboard.component';
import { ConfigurationComponent } from './view/configuration/configuration.component';
import { HistoryRecordComponent } from './view/history-record/history-record.component';
import { LoginComponent } from './view/login/login.component';
import { ReportComponent } from './view/report/report.component';
import { OverviewComponent } from './view/overview/overview.component';
import { ScenariosComponent } from './view/scenarios/scenarios.component';
import { UiKitPreviewComponent } from './ui-kit/preview/ui-kit-preview.component';
import { JobsComponent } from './view/jobs/jobs.component';

export const routes = [

  { path: 'overview', component: OverviewComponent },
  { path: 'scenarios/new', component: ScenariosComponent, data: { createMode: true } },
  { path: 'scenarios/:id', component: ScenariosComponent },
  { path: 'scenarios', component: ScenariosComponent },
  { path: 'jobs/:id/compare', component: ScenariosComponent },
  { path: 'jobs/:id', component: ScenariosComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'settings', component: ScenariosComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'ui-kit-preview', component: UiKitPreviewComponent },


  { path: '', component: DashboardComponent },
  { path: 'configuration/:id', component: ConfigurationComponent },
  { path: 'configuration', component: ConfigurationComponent },
  { path: 'history/:jobId', component: HistoryRecordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'report', component: ReportComponent },
  { path: '**', component: DashboardComponent }
];
