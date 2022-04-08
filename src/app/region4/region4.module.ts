import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Region4PageRoutingModule } from './region4-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { Region4Page } from './region4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    Region4PageRoutingModule
  ],
  declarations: [Region4Page]
})
export class Region4PageModule {}
