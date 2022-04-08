import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadPageRoutingModule } from './download-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { DownloadPage } from './download.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    DownloadPageRoutingModule
  ],
  declarations: [DownloadPage]
})
export class DownloadPageModule {}
