import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectTownsPageRoutingModule } from './select-towns-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SelectTownsPage } from './select-towns.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SelectTownsPageRoutingModule
  ],
  declarations: [SelectTownsPage]
})
export class SelectTownsPageModule {}
