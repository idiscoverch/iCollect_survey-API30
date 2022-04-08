import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Region4Page } from './region4.page';

const routes: Routes = [
  {
    path: '',
    component: Region4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Region4PageRoutingModule {}
