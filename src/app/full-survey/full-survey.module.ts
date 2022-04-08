import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FullSurveyPageRoutingModule } from './full-survey-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FullSurveyPage } from './full-survey.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    FullSurveyPageRoutingModule
  ],
  declarations: [FullSurveyPage]
})
export class FullSurveyPageModule {}
