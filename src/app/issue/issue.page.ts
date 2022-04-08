import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { NetworkService, ConnectionStatus } from '../services/network.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { TranslateService } from '@ngx-translate/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions, CaptureAudioOptions } from '@ionic-native/media-capture/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.page.html',
  styleUrls: ['./issue.page.scss'],
})
export class IssuePage implements OnInit {

  type: any;
  region: any;

  id_action: any;
  id_issue_cat: any;
  id_partner: any;
  id_scope: any;
  organisation: any;
  id_function: any;
  id_appearance: any;
  comment: any;

  scopesList: any[] = [];
  partnersList: any[] = [];
  categoriesList: any[] = [];
  actionsList: any[] = [];
  appearanceList: any[] = [];
  functionList: any[] = [];

  id_project: any;
  id_regvalue: any;
  id_register: any;

  selected_cat = false;
  selected_scop = false;
  survQ = false;
  add_media = false;
  disabled_select = false;
  loadImg = false;

  project_id: any;
  town_id: any;
  country_id: any;
  id_agent: any;
  coordx: any;
  coordy: any;
  accuracy: any;
  username: any;
  user: any;

  network: any;
  trigger_text: any;
  status_name: any;
  desc_en: any;
  survey_response_id: any;
  trigger_regvalue: any;

  survey_unique_id: any;

  constructor(
    private camera: Camera,
    private mediaCapture: MediaCapture,
    private activatedRoute: ActivatedRoute,
    private networkService: NetworkService,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private geolocation: Geolocation,
    private http: HTTP,
    private Platform: Platform,
    private filePath: FilePath,
    public navCtrl: NavController,
    public translate: TranslateService,
    private db: DatabaseService,
    private nativeStorage: NativeStorage,
    private file: File
  ) {
    this.db.createSurveyDir();
    this.db.createDocumentsDir();

    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        this.network = true;
      } else { this.network = false; }
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(param => {
      this.type = param.get('type');
    });

    this.nativeStorage.getItem('id_project').then((val) => {
      this.project_id = val;
    });

    this.nativeStorage.getItem('gid_town').then((val2) => {
      this.town_id = val2;
    });

    this.db.lastLogedUser().then(usr => {
      this.user = usr;
      this.country_id = usr.id_country;
      this.id_agent = usr.id_contact;
      this.username = usr.username;
    });

    this.geolocation.getCurrentPosition().then((resp) => {
      this.coordx = resp.coords.latitude;
      this.coordy = resp.coords.longitude;
      this.accuracy = resp.coords.accuracy;
    });

    this.loadData();
  }

  loadData() {
    this.scopesList = [];
    this.db.loadIssueScopes().then(() => {
      this.db.getScopes().subscribe(data => {
        this.scopesList = data;
      });
    });

    this.appearanceList = [];
    this.db.loadAppearance().then(() => {
      this.db.getAppearance().subscribe(data => {
        this.appearanceList = data;
      });
    });

    this.functionList = [];
    this.db.loadFunction().then(() => {
      this.db.getFunction().subscribe(data => {
        this.functionList = data;
      });
    });

    setTimeout(() => {
      this.nativeStorage.getItem('id_appearance').then(val => {
        this.id_appearance = val;
      });

      this.nativeStorage.getItem('id_function').then(val => {
        this.id_function = val;
      });

      this.nativeStorage.getItem('id_scope').then(val => {
        this.id_scope = val;
        this.checkScope();
      });
    }, 800);

    this.nativeStorage.getItem('survey_unique_id').then((val) => { 
      this.survey_unique_id = val; 
    }).catch(() => {
      this.db.getNewId().then(data => { 
        this.survey_unique_id = data.new_id;
      });
    });
  }

  checkScope() {
    this.selected_scop = true;

    this.id_issue_cat = null;
    this.id_action = null;
    this.trigger_regvalue = null;

    this.partnersList = [];
    this.db.lastLogedUser().then(usr => {
      this.db.loadScopespartner(usr.id_country, this.project_id, this.id_scope).then(() => {
        this.db.getScopespartner().subscribe(data => {
          this.partnersList = data;

          this.nativeStorage.getItem('id_partner').then(val => {
            this.id_partner = val;
            this.disabled_select = true;
          });
        });
      });
    });

    this.categoriesList = [];
    this.db.loadIssueCategories(this.id_scope).then(() => {
      this.db.getIssueCategories().subscribe(data => {
        this.categoriesList = data;
      });
    });
  }

  checkCategory() {
    this.survQ = true;
    this.selected_cat = true;
    this.add_media = true;
    this.id_action = null;
    this.trigger_regvalue = null;

    this.actionsList = [];
    this.db.loadCategoryAction(this.id_scope, this.id_issue_cat).then(() => {
      this.db.getCategoryAction().subscribe(data => {
        this.actionsList = data;
      });
    });

    this.db.getNewId().then(data => {
      this.survey_response_id = data.new_id;
    });

    this.id_regvalue = this.id_scope;
  }

  getActionData() {
    if(this.trigger_regvalue == 1135) {
      this.loadImg = true;
    } else { this.loadImg = false; }

    this.db.getCatAction(this.trigger_regvalue).then(data => {
      this.trigger_text = data.trigger_text;
      this.status_name = data.status_name;
      this.desc_en = data.desc_en;
      this.id_action = data.topic_id;
    });
  }

  submit() {
    var m = new Date();
    let created_date = m.getUTCFullYear() + "-" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    this.db.addResult(this.survey_response_id, 1144, null, null, this.project_id, this.id_scope, this.id_partner, this.town_id, this.country_id, null, null, null, created_date, this.id_agent, this.username, this.coordx, this.coordy, this.accuracy, this.comment, 0, null, null, 0, null, this.trigger_text, this.status_name, this.id_action, created_date, null, null, null, null, null, null, null, null, 0, 1, this.survey_unique_id, this.id_function, this.id_appearance, this.organisation, null)
      .then(() => {
        this.survQ = false;
        this.add_media = false;
        this.translate.get('DATA_SUCCESSFULY_SAVED').subscribe(value => {
          this.toastAlert(value);
        });

        this.sendData(created_date, this.survey_response_id);

        this.translate.get('ISSUE_COMPLETE').subscribe(value => {
          this.presentAlert(value, 'Succès');
        });

        this.nativeStorage.remove('survey_unique_id');
        this.backToDetails();
      });

  }

  sendData(created_date, survey_response_id) {
    if (this.network == true) {
      var link = 'https://survey.icertification.ch/ords/m/sv/sv_results/';

      var myData = JSON.stringify({
        SURVEY_RESPONSE_ID: survey_response_id,
        ACTION_TYPE_ID: 1144,
        QUESTION_ID: null,
        CRITERIA_ID: null,
        PROJECT_ID: this.project_id,
        SCOPE_ID: this.id_scope,
        PARTNER_ID: this.id_partner,
        TOWN_ID: this.town_id,
        COUNTRY_ID: this.country_id,
        A_LIST_NUMBER: null,
        A_NUMBER: null,
        SV_ANSWERS_DEF_ID: null,
        CREATED_DATE: created_date,
        ID_AGENT: this.id_agent,
        CREATED_BY: this.username,
        COORDX: this.coordx,
        COORDY: this.coordy,
        ACCURACY: this.accuracy,
        SV_COMMENT: this.comment,
        ACTION_ITEM: this.trigger_text,
        ACTION_STATUS_NAME: this.status_name,
        ACTION_ID: this.id_action,
        COMPLETED: 0,
        COMPLETED_DATE: created_date,
        ISSUE_ID: null,
        SYNC_TO_SERVER: 1,
        SYNC_TO_SERVER_DATE: created_date,
        SURVEY_UNIQUE_ID: this.survey_unique_id,
        FUNCTION_ID: this.id_function,
        APPEARANCE_ID: this.id_appearance,
        ORG_NAME: this.organisation,
        SV_ANSWER_TYPE_ID: null
      });

      this.http.setDataSerializer('utf8');
      this.http.post(link, myData, {})
        .then((data) => {  console.log(JSON.stringify(data)); 
          this.db.updateAnsSync(survey_response_id, created_date);
          this.translate.get('DATA_UPLOAD_SUCCESS').subscribe(value => {
            this.toastAlert(value);
          });

          this.db.lastLogedUser().then(usr => {
            this.db.restFetchUserActive(usr.id_contact);
          });

        }).catch((error) => {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
        });
    }

  }

  async toastAlert(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }


  loadImage() {
    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  }

  selectImage() {
    this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      targetWidth: 1024,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(imagePath => {
      if (this.Platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) { 
        imagePath = 'file://'+imagePath;
        this.filePath.resolveNativePath(imagePath).then(filePath => { 
          let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          this.presentPrompt(154, correctPath, currentName, this.survey_unique_id, 0);
        });

      } else {
        let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.presentPrompt(154, correctPath, currentName, this.survey_unique_id, 1);
      }
    });
  }

  async presentPrompt(doc_type, correctPath, currentName, survey_unique_id, source) {
    var pic_desc, save, cancel;
    this.translate.get('PIC_DESCRIPTION').subscribe(value => { pic_desc = value; });
    this.translate.get('SAVE').subscribe(value => { save = value; });
    this.translate.get('CANCEL').subscribe(value => { cancel = value; });

    const alert = await this.alertCtrl.create({
      message: pic_desc,
      inputs: [
        {
          name: 'description',
          placeholder: 'Description'
        }
      ],
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          handler: data => {
            console.log(data);
          }
        },
        {
          text: save,
          handler: data => {
            this.moveFile(data.description, correctPath, currentName, survey_unique_id, doc_type, source);
          }
        }
      ]
    });
    alert.present();
  }

  captureAudio() {
    let options: CaptureAudioOptions = {
      limit: 1,
      duration: 30
    }

    this.mediaCapture.captureAudio(options).then((res: MediaFile[]) => { 
      let capturedFile = res[0];
      let fileName = capturedFile.name;
      let dir = capturedFile['fullPath'].split('/');
      dir.pop();
      let fromDirectory = dir.join('/');
 
      this.presentPrompt(157, fromDirectory+'/', fileName, this.survey_unique_id, null);

    }, (err: CaptureError) => console.error(err));
  }

  captureVideo() {
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 30
    }

    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => { 
      let capturedFile = res[0];
      let fileName = capturedFile.name;
      let dir = capturedFile['fullPath'].split('/');
      dir.pop();
      let fromDirectory = dir.join('/');
 
      this.presentPrompt(155, fromDirectory+'/', fileName, this.survey_unique_id, null);

    }, (err: CaptureError) => console.error(err));
  }

  moveFile(description, correctPath, currentName, survey_unique_id, doc_type, source) {
    var m = new Date();
    let created_date = m.getUTCFullYear() + "-" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + "-" + ("0" + m.getUTCMinutes()).slice(-2) + "-" + ("0" + m.getUTCSeconds()).slice(-2);
    let newPath = this.file.externalDataDirectory + 'icollect_survey/documents/';

    if (doc_type == 155) {
      var newFileName = this.survey_response_id + '_' + created_date + ".mp4";

      this.file.moveFile(correctPath, currentName, newPath, newFileName).then(() => { 
        this.db.saveDocData(this.user.id_contact, survey_unique_id, newFileName, description, doc_type, null);
      });

    } else
    if(doc_type == 157) {
      var newFileName = this.survey_response_id + '_' + created_date + ".mp3";

      this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
        this.db.saveDocData(this.user.id_contact, survey_unique_id, newFileName, description, doc_type, null);
      });

    } else { 
      var newFileName = this.survey_response_id + '_' + created_date + ".jpg";
       
      if(source == 0) { 
        this.file.copyFile(correctPath, currentName, newPath, newFileName).then(_ => {
          this.db.saveDocData(this.user.id_contact, survey_unique_id, newFileName, description, doc_type, null);
        }); 

      } else {
        this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
          this.db.saveDocData(this.user.id_contact, survey_unique_id, newFileName, description, doc_type, null);
        });
      }
      
    }
  }

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

  backToDetails() {
    this.navCtrl.navigateBack(['/scope/' + this.type]);
  }
}
