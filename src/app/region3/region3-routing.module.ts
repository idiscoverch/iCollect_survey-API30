import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Region3Page } from './region3.page';

const routes: Routes = [
  {
    path: '',
    component: Region3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Region3PageRoutingModule {}
