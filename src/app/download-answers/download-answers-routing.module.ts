import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadAnswersPage } from './download-answers.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadAnswersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadAnswersPageRoutingModule {}
