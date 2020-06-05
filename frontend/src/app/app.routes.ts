import { LoginComponent } from './view/login/login.component';
import { OverviewComponent } from './view/overview/overview.component';
import { ScenariosComponent } from './view/scenarios/scenarios.component';
import { UiKitPreviewComponent } from './ui-kit/preview/ui-kit-preview.component';
import { JobsComponent } from './view/jobs/jobs.component';
import { ScenarioPageComponent } from './view/scenario-page/scenario-page.component';
import { JobPageComponent } from './view/job-page/job-page.component';
import { ComparerComponent } from './view/comparer/comparer.component';
import { SettingsComponent } from './view/settings/settings.component';

export const routes = [

  { path: 'overview', component: OverviewComponent },
  { path: 'scenarios', component: ScenariosComponent },
  { path: 'scenario/new', component: ScenarioPageComponent, data: { createMode: true } },
  { path: 'scenario/:id', component: ScenarioPageComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'job/:id/compare/:case', component: ComparerComponent },
  { path: 'job/:id', component: JobPageComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'login', component: LoginComponent },

  { path: 'ui-kit-preview', component: UiKitPreviewComponent },
  { path: '', component: OverviewComponent },
  { path: '**', component: OverviewComponent }
];
