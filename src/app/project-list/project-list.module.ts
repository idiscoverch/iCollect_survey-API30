import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectListPageRoutingModule } from './project-list-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectListPage } from './project-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ProjectListPageRoutingModule
  ],
  declarations: [ProjectListPage]
})
export class ProjectListPageModule {}
