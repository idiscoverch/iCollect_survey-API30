import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScopePage } from './scope.page';

const routes: Routes = [
  {
    path: '',
    component: ScopePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScopePageRoutingModule {}
