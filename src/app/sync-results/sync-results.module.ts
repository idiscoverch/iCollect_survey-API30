import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SyncResultsPageRoutingModule } from './sync-results-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SyncResultsPage } from './sync-results.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SyncResultsPageRoutingModule
  ],
  declarations: [SyncResultsPage]
})
export class SyncResultsPageModule {}
