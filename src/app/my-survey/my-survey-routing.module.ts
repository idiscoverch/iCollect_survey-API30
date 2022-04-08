import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MySurveyPage } from './my-survey.page';

const routes: Routes = [
  {
    path: '',
    component: MySurveyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MySurveyPageRoutingModule {}
