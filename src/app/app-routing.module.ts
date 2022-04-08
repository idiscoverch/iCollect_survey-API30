import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'language',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'language',
    loadChildren: () => import('./language/language.module').then( m => m.LanguagePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'region',
    loadChildren: () => import('./region/region.module').then( m => m.RegionPageModule)
  },
  {
    path: 'town',
    loadChildren: () => import('./town/town.module').then( m => m.TownPageModule)
  },
  {
    path: 'download/:type',
    loadChildren: () => import('./download/download.module').then( m => m.DownloadPageModule)
  },
  {
    path: 'region2/:region',
    loadChildren: () => import('./region2/region2.module').then( m => m.Region2PageModule)
  },
  {
    path: 'region3/:region',
    loadChildren: () => import('./region3/region3.module').then( m => m.Region3PageModule)
  },
  {
    path: 'region4/:region',
    loadChildren: () => import('./region4/region4.module').then( m => m.Region4PageModule)
  },
  {
    path: 'scope/:type',
    loadChildren: () => import('./scope/scope.module').then( m => m.ScopePageModule)
  },
  {
    path: 'survey/:type',
    loadChildren: () => import('./survey/survey.module').then( m => m.SurveyPageModule)
  },
  {
    path: 'issue/:type',
    loadChildren: () => import('./issue/issue.module').then( m => m.IssuePageModule)
  },
  {
    path: 'select-towns',
    loadChildren: () => import('./select-towns/select-towns.module').then( m => m.SelectTownsPageModule)
  },
  {
    path: 'sync',
    loadChildren: () => import('./sync/sync.module').then( m => m.SyncPageModule)
  },
  {
    path: 'media/:survey_unique_id',
    loadChildren: () => import('./media/media.module').then( m => m.MediaPageModule)
  },
  {
    path: 'my-issue',
    loadChildren: () => import('./my-issue/my-issue.module').then( m => m.MyIssuePageModule)
  },
  {
    path: 'my-survey',
    loadChildren: () => import('./my-survey/my-survey.module').then( m => m.MySurveyPageModule)
  },
  {
    path: 'sync-results',
    loadChildren: () => import('./sync-results/sync-results.module').then( m => m.SyncResultsPageModule)
  },
  {
    path: 'show-media',
    loadChildren: () => import('./show-media/show-media.module').then( m => m.ShowMediaPageModule)
  },
  {
    path: 'survey-details/:survey_unique_id',
    loadChildren: () => import('./survey-details/survey-details.module').then( m => m.SurveyDetailsPageModule)
  },
  {
    path: 'issue-details',
    loadChildren: () => import('./issue-details/issue-details.module').then( m => m.IssueDetailsPageModule)
  },
  {
    path: 'full-survey/:type',
    loadChildren: () => import('./full-survey/full-survey.module').then( m => m.FullSurveyPageModule)
  },
  {
    path: 'survey-answer',
    loadChildren: () => import('./survey-answer/survey-answer.module').then( m => m.SurveyAnswerPageModule)
  },
  {
    path: 'download-answers/:id_project',
    loadChildren: () => import('./download-answers/download-answers.module').then( m => m.DownloadAnswersPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
