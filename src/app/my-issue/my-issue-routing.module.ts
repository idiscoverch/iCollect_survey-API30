import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyIssuePage } from './my-issue.page';

const routes: Routes = [
  {
    path: '',
    component: MyIssuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyIssuePageRoutingModule {}
