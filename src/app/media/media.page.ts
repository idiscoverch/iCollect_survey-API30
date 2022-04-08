import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { NavController, ModalController } from '@ionic/angular';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { ShowMediaPage } from '../show-media/show-media.page';
import { File } from '@ionic-native/file/ngx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-media',
  templateUrl: './media.page.html',
  styleUrls: ['./media.page.scss'],
})
export class MediaPage implements OnInit {

  data: any[] = [];
  survey_unique_id: any;

  return = 'survey';

  constructor(
    public http: HTTP,
    private db: DatabaseService,
    public translate: TranslateService,
    public navCtrl: NavController,
    private photoViewer: PhotoViewer,
    private media: Media,
    private webview: WebView,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private file: File
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(param => {
      this.survey_unique_id = param.get('survey_unique_id');

      this.db.getUniqueResults(this.survey_unique_id).then(data => {
        if(data.issue == 1) {
          this.return = 'issue';
        } else {
          this.return = 'survey';
        }
      });

      this.data = [];  
      this.db.loadDocuments(this.survey_unique_id).then(_ => {
        this.db.getDocuments().subscribe(data => {
          this.data = data;
        });
      });
   });
  }

  showMedia(item) { 
    if(item.doc_type == 155) {  
      var videopath = this.webview.convertFileSrc(this.file.externalDataDirectory + 'icollect_survey/documents/' + item.filename);
      this.openMeia(videopath);

    } else
    if(item.doc_type == 157) {  
      var audioPath = this.file.externalDataDirectory + 'icollect_survey/documents/' + item.filename;
      const file: MediaObject = this.media.create(audioPath);
      file.play();

    } else {
      var correctPath;
      if(item.cloud_path!=null) {
        correctPath = item.cloud_path;
      } else {
        correctPath = this.file.externalDataDirectory + 'icollect_survey/documents/' + item.filename; 
      }
      
      this.photoViewer.show(correctPath);
    }
  }

  async openMeia(link) {
    const modal = await this.modalController.create({
      component: ShowMediaPage,
      componentProps: {
        link: link
      }
    });
    modal.present();
  }

  back() {
    if(this.return == 'survey') {
      this.navCtrl.navigateBack(['/survey-details/' + this.survey_unique_id]);
    } else {
      this.navCtrl.navigateBack(['/my-issue']);
    }
  }

}
