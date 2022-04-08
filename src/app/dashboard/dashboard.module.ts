import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardPage } from './dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    DashboardPageRoutingModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
