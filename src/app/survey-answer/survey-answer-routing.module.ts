import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveyAnswerPage } from './survey-answer.page';

const routes: Routes = [
  {
    path: '',
    component: SurveyAnswerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyAnswerPageRoutingModule {}
