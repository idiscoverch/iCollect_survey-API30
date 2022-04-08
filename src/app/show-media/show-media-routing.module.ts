import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowMediaPage } from './show-media.page';

const routes: Routes = [
  {
    path: '',
    component: ShowMediaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowMediaPageRoutingModule {}
