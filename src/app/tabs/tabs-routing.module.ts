import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
      {
        path: 'project-list',
        loadChildren: () => import('../project-list/project-list.module').then( m => m.ProjectListPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then( m => m.SettingsPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
