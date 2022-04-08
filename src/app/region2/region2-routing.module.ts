import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Region2Page } from './region2.page';

const routes: Routes = [
  {
    path: '',
    component: Region2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Region2PageRoutingModule {}
