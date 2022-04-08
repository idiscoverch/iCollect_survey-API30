import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Network } from '@ionic-native/network/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Media } from '@ionic-native/media/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Md5 } from 'ts-md5/dist/md5';

import { ShowMediaPageModule } from './show-media/show-media.module';
import { SurveyAnswerPageModule } from './survey-answer/survey-answer.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    ShowMediaPageModule,
    SurveyAnswerPageModule
  ],
  providers: [
    Md5,
    File,
    HTTP,
    Network,
    SQLitePorter,
    SQLite,
    Camera,
    WebView,
    FilePath,
    Media,
    BackgroundMode,
    PhotoViewer,
    MediaCapture,
    Geolocation,
    FileTransfer,
    NativeStorage,
    AndroidPermissions,
    LocationAccuracy,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
