import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RegionPageRoutingModule } from './region-routing.module';

import { RegionPage } from './region.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RegionPageRoutingModule
  ],
  declarations: [RegionPage]
})
export class RegionPageModule {}
