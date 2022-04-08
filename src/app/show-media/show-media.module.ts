import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowMediaPageRoutingModule } from './show-media-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ShowMediaPage } from './show-media.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ShowMediaPageRoutingModule
  ],
  declarations: [ShowMediaPage]
})
export class ShowMediaPageModule {}
