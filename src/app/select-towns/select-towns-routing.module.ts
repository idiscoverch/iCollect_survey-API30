import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectTownsPage } from './select-towns.page';

const routes: Routes = [
  {
    path: '',
    component: SelectTownsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectTownsPageRoutingModule {}
