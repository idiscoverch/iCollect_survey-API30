import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadAnswersPageRoutingModule } from './download-answers-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { DownloadAnswersPage } from './download-answers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    DownloadAnswersPageRoutingModule
  ],
  declarations: [DownloadAnswersPage]
})
export class DownloadAnswersPageModule {}
