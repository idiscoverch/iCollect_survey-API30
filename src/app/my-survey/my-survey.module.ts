import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MySurveyPageRoutingModule } from './my-survey-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { MySurveyPage } from './my-survey.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    MySurveyPageRoutingModule
  ],
  declarations: [MySurveyPage]
})
export class MySurveyPageModule {}
