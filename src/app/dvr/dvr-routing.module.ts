import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CasesComponent } from '../dvr/components/cases/cases.component';

import { DataOfPath } from '../common/models/routing.model';
import { ApproveComponent } from './components/approve/approve.component';
import { DvrComponent } from './components/dvr.component';
import { SummaryComponent } from './components/summary/summary.component';

const routes: Routes = [
  {
    path: 'cases',
    data: {
      breadcrumb: 'Cases',
      breadcrumbLink: '..',
    } as DataOfPath,
    children: [
      {
        path: ':hash',
        component: ApproveComponent,
        data: {
          breadcrumb: 'Case',
        } as DataOfPath,
      },
      {
        path: '',
        component: CasesComponent,
      },
    ],
  },
  {
    path: 'summaries',
    component: SummaryComponent,
    data: {
      breadcrumb: 'Summaries',
    } as DataOfPath,
  },
  {
    path: '',
    component: DvrComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DvrRoutingModule {}
