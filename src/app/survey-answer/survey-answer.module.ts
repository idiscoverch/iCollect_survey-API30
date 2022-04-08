import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurveyAnswerPageRoutingModule } from './survey-answer-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SurveyAnswerPage } from './survey-answer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SurveyAnswerPageRoutingModule
  ],
  declarations: [SurveyAnswerPage]
})
export class SurveyAnswerPageModule {}
