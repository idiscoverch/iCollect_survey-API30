import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SyncResultsPage } from './sync-results.page';

const routes: Routes = [
  {
    path: '',
    component: SyncResultsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SyncResultsPageRoutingModule {}
