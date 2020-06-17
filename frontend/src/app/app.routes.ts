import { LoginComponent } from './view/login/login.component';
import { OverviewComponent } from './view/overview/overview.component';
import { ScenariosComponent } from './view/scenarios/scenarios.component';
import { UiKitPreviewComponent } from './ui-kit/preview/ui-kit-preview.component';
import { JobsComponent } from './view/jobs/jobs.component';
import { ScenarioPageComponent } from './view/scenario-page/scenario-page.component';
import { JobPageComponent } from './view/job-page/job-page.component';
import { ComparerComponent } from './view/comparer/comparer.component';
import { SettingsComponent } from './view/settings/settings.component';
import { Route } from '@angular/router';
import { LoggedIn } from './guards/logged-in.guard';


export const routes:Route[] = [

  { canActivate: [LoggedIn], path: 'overview', component: OverviewComponent,  },
  { canActivate: [LoggedIn], path: 'scenarios', component: ScenariosComponent,  },
  { canActivate: [LoggedIn], path: 'scenario/new', component: ScenarioPageComponent, data: { createMode: true },  },
  { canActivate: [LoggedIn], path: 'scenario/:id', component: ScenarioPageComponent,  },
  { canActivate: [LoggedIn], path: 'jobs', component: JobsComponent,  },
  { canActivate: [LoggedIn], path: 'job/:id/compare/:case', component: ComparerComponent,  },
  { canActivate: [LoggedIn], path: 'job/:id', component: JobPageComponent,  },
  { canActivate: [LoggedIn], path: 'settings', component: SettingsComponent,  },

  { path: 'login', component: LoginComponent },
  { path: 'account/:mode', component: LoginComponent },

  { canActivate: [LoggedIn], path: 'ui-kit-preview', component: UiKitPreviewComponent,  },
  { canActivate: [LoggedIn], path: '', component: OverviewComponent,  },
  { canActivate: [LoggedIn], path: '**', component: OverviewComponent,  }
];
