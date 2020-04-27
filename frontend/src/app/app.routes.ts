import { DashboardComponent } from './view/dashboard/dashboard.component';
import { ConfigurationComponent } from './view/configuration/configuration.component';
import { HistoryRecordComponent } from './view/history-record/history-record.component';
import { LoginComponent } from './view/login/login.component';
import { ReportComponent } from './view/report/report.component';

export const routes = [

  { path: '', component: DashboardComponent },

  { path: 'configuration/:id', component: ConfigurationComponent },
  { path: 'configuration', component: ConfigurationComponent },

  { path: 'history/:jobId', component: HistoryRecordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'report', component: ReportComponent },
  { path: '**', component: DashboardComponent }
];
