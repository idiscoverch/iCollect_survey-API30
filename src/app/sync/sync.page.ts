import { Component, OnInit } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController, ToastController, NavController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { NetworkService, ConnectionStatus } from '../services/network.service';
import { File } from '@ionic-native/file/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ShowMediaPage } from '../show-media/show-media.page';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss'],
})
export class SyncPage implements OnInit {

  network = false;
  //uploading = false;

  progress: any;
  data: any[] = [];

  constructor(
    public http: HTTP,
    private db: DatabaseService,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    public translate: TranslateService,
    private backgroundMode: BackgroundMode,
    private networkService: NetworkService,
    private nativeStorage: NativeStorage,
    private transfer: FileTransfer,
    public navCtrl: NavController,
    private photoViewer: PhotoViewer,
    private media: Media,
    private webview: WebView,
    private modalController: ModalController,
    private file: File
  ) { }

  ngOnInit() {
    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        this.network = true;
      } else { this.network = false; }
    });

    //this.nativeStorage.getItem('uploading').then((val) => {
    //  if (val == true) {
    //    this.uploading = val;
    //  }
    //});

    this.db.loadDocumentsSync().then(_ => {
      this.db.getDocuments().subscribe(data => {
        this.data = [];
        this.data = data;
      });
    });
  }

  showMedia(item) {
    if (item.doc_type == 155) {
      var videopath = this.webview.convertFileSrc(this.file.externalDataDirectory + 'icollect_survey/documents/' + item.filename);
      this.openMeia(videopath);

    } else
      if (item.doc_type == 157) {
        var audioPath = this.file.externalDataDirectory + 'icollect_survey/documents/' + item.filename;
        const file: MediaObject = this.media.create(audioPath);
        file.play();

      } else {
        var correctPath;
        if (item.cloud_path != null) {
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

  sync(conf: any) {
    if (this.network == true) {

      //this.uploading = true;
      //this.nativeStorage.setItem('uploading', true);

      this.backgroundMode.enable();
      this.translate.get('UPLOAD_BACKGROUND').subscribe(value => {
        this.presentAlert(value, 'Info');
      });

      //var i = 1;
      //let length = this.data.length;

      this.data.forEach(value => {
        if (value.doc_type == conf) {
          let filepath = this.file.externalDataDirectory + 'icollect_survey/documents/';
          let filename = value.filename;
          let id_doc = value.id_doc;
          let survey_unique_id = value.survey_unique_id;
          let doc_type = value.doc_type;
          let description = value.description;
          let coordx = value.coordx;
          let coordy = value.coordy;
          let accuracy = value.accuracy;
          let heading = value.heading;
          let agent_id = value.agent_id;
          let doc_date = value.doc_date;
          let cloud_path = value.cloud_path;
          let altitude = value.altitude;

          if (cloud_path != null) {
            this.save(id_doc, agent_id, survey_unique_id, doc_type, doc_date, filename, description, coordx, coordy, accuracy, heading, altitude, cloud_path);

          } else {
            let documentsURL = encodeURI(filepath + filename);

            let url: any;
            if(conf == 154) {
              url = encodeURI("https://api.cloudinary.com/v1_1/www-idiscover-live/image/upload");
            } else {
              url = encodeURI("https://api.cloudinary.com/v1_1/www-idiscover-live/video/upload");
            }

            let options: FileUploadOptions = {
              fileKey: "file",
              fileName: filename,
              chunkedMode: false,
              mimeType: "multipart/form-data",
              params: { 'upload_preset': 'gkvtiroi' }
            }

            const fileTransfer: FileTransferObject = this.transfer.create();

            fileTransfer.upload(documentsURL, url, options, true)
              .then((data) => {
                console.log(data);

                let r = data.response.trim();
                let cUrl = JSON.parse(r);
                let file_url = JSON.stringify(cUrl.secure_url).split('"').join('');

                var m = new Date();
                let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                this.db.addData('documents', timestamp, null, 1, null);

                this.db.updateCloudLinkDocument(file_url, id_doc).then(() => {
                  this.save(id_doc, agent_id, survey_unique_id, doc_type, doc_date, filename, description, coordx, coordy, accuracy, heading, altitude, file_url);
                });

                this.translate.get('DOC_UPLOAD_SUCCESS').subscribe(
                  value => { this.toastAlert(value); }
                );

              }, (err) => { 
                console.log(err);
                this.translate.get('DOC_UPLOAD_ERROR').subscribe(
                  value => { this.toastAlert(value); }
                );
              });
          }

          //if (length == i) {
          //  this.uploading = false;
          //  this.nativeStorage.setItem('uploading', false);
          //}

          //i = i + 1;
        }
      });

    } else {
      this.translate.get('CHECK_INTERNET').subscribe(value => {
        this.toastAlert(value);
      });
    }
  }

  save(id_doc, agent_id, survey_unique_id, doc_type, doc_date, filename, description, coordx, coordy, accuracy, heading, altitude, cloud_path) {
    if (this.network == true) {
      var link = 'https://survey.icertification.ch/ords/m/sv/sv_doc/';
      var myData = JSON.stringify({
        ID_DOC: id_doc,
        AGENT_ID: agent_id,
        SURVEY_UNIQUE_ID: survey_unique_id,
        DOC_TYPE: doc_type,
        DOC_DATE: doc_date,
        FILENAME: filename,
        DESCRIPTION: description,
        COORDX: coordx,
        COORDY: coordy,
        ACCURACY: accuracy,
        HEADING: heading,
        ALTITUDE: altitude,
        CLOUD_PATH: cloud_path,
        SYNC: 1,
      });

      this.http.setDataSerializer('utf8');
      this.http.post(link, myData, {})
        .then(() => {
          this.db.updateSyncDoc(1, id_doc).then(() => {
            this.toastAlert('Données chargés avec succès.');
          });

        }).catch((error) => {
          this.presentAlert('Echec du trasfert au serveur', 'Erreur');

          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
        });

    } else {
      this.toastAlert('Vérifier votre connexion à internet');
    }
  }

  del(id_doc) {
    this.db.deleteDocument(id_doc).then(() => {
      this.toastAlert('Supprimé avec succès.');
    });
  }

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

  async toastAlert(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }

  back() {
    this.navCtrl.navigateBack(['/tabs/tabs/settings']);
  }

}
