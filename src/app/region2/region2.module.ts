import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Region2PageRoutingModule } from './region2-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { Region2Page } from './region2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    Region2PageRoutingModule
  ],
  declarations: [Region2Page]
})
export class Region2PageModule {}
