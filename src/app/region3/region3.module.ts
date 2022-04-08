import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Region3PageRoutingModule } from './region3-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { Region3Page } from './region3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    Region3PageRoutingModule
  ],
  declarations: [Region3Page]
})
export class Region3PageModule {}
