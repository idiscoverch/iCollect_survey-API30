import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullSurveyPage } from './full-survey.page';

const routes: Routes = [
  {
    path: '',
    component: FullSurveyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullSurveyPageRoutingModule {}
