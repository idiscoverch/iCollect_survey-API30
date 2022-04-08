import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { NetworkService, ConnectionStatus } from '../services/network.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SurveyAnswerPage } from '../survey-answer/survey-answer.page';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions, CaptureAudioOptions } from '@ionic-native/media-capture/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-full-survey',
  templateUrl: './full-survey.page.html',
  styleUrls: ['./full-survey.page.scss'],
})
export class FullSurveyPage implements OnInit {

  type: any;
  network: any;
  project_id: any;
  town_id: any;
  id_agent: any;
  coordx: any;
  coordy: any;
  accuracy: any;
  user: any;
  country_id: any;
  username: any;

  id_scope: any;
  id_partner: any;
  survey_response_id: any;
  id_appearance: any;
  id_function: any;
  organisation: any;
  survey_unique_id: any;

  add_media = false;
  selected_scop = false;
  started = true;
  spinner = false;
  new_data = false;
  issue_btn = true;
  saved_id = false;

  scopesList: any[] = [];
  partnersList: any[] = [];
  appearanceList: any[] = [];
  functionList: any[] = [];
  questionList: any[] = [];

  sel_village: any;
  sel_scope: any;
  sel_partner: any;

  constructor(
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private networkService: NetworkService,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
    private db: DatabaseService,
    public translate: TranslateService,
    private geolocation: Geolocation,
    private nativeStorage: NativeStorage,
    private mediaCapture: MediaCapture,
    private camera: Camera,
    private file: File,
  ) {
    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        this.network = true;
      } else { this.network = false; }
    });

    this.nativeStorage.getItem('finish_survey').then((fn) => { 
      if(fn == 1) {
        this.saved_id = true;

        this.nativeStorage.getItem('saved_survey_id').then((id) => { 
          this.survey_unique_id = id;
          this.db.getSurveySavedData(this.survey_unique_id).then(data => {  
            this.nativeStorage.setItem('gid_town', data.town_id); 
            this.nativeStorage.setItem('id_project', data.id_project);
  
            this.project_id = data.id_project;
            this.id_scope = data.id_scope;
            this.id_partner = data.id_partner;
            this.id_appearance = data.id_appearance;
            this.id_function = data.id_function;
            this.organisation = data.organisation;
  
            this.startSurvey();
          });
        });
      }

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

    this.geolocation.getCurrentPosition().then((resp) => {
      this.coordx = resp.coords.latitude;
      this.coordy = resp.coords.longitude;
      this.accuracy = resp.coords.accuracy;
    });

    this.db.lastLogedUser().then(usr => {
      this.user = usr;
      this.country_id = usr.id_country;
      this.id_agent = usr.id_contact;
      this.username = usr.username;
    });

    this.loadData();
  }

  loadData() {
    this.scopesList = [];
    this.db.loadSurveyScope().then(() => {
      this.db.getSurveyScope().subscribe(data => {
        this.scopesList = data.sort((a, b) => a.cvalue> b.cvalue? 1 : -1);
      });
    });

    this.appearanceList = [];
    this.db.loadAppearance().then(() => {
      this.db.getAppearance().subscribe(data => {
        this.appearanceList = data.sort((a, b) => a.cvalue> b.cvalue? 1 : -1);
      });
    });

    this.functionList = [];
    this.db.loadFunction().then(() => {
      this.db.getFunction().subscribe(data => {
        this.functionList = data.sort((a, b) => a.cvalue> b.cvalue? 1 : -1);
      });
    });
  }

  checkScope() {
    this.partnersList = [];
    this.selected_scop = true;

    this.db.countQuestions(this.id_scope).then(val => {
      if(val.total == 0) {
        this.translate.get('NO_QUESTION_FOR_SCOPE').subscribe(value => {
          this.presentAlert(value, 'Info');
        });

      } else {

        this.nativeStorage.getItem('id_project').then((val) => {
          this.db.loadScopespartner(this.country_id, val, this.id_scope).then(() => {
            this.db.getScopespartner().subscribe(data => {
              this.partnersList = data.sort((a, b) => a.contact_name> b.contact_name? 1 : -1);
            });
          });
        });
      }
    });
  }

  startSurvey() {
    if (this.id_scope == null) {
      this.translate.get('SELECT_A_SCOPE').subscribe(value => {
        this.presentAlert(value, 'Error');
      });

    } else
      if (this.id_partner == null) {
        this.translate.get('SELECT_A_PARTNER').subscribe(value => {
          this.presentAlert(value, 'Error');
        });

      } else
        if ((this.id_scope != null) && (this.id_partner != null)) {

          this.spinner = true;

          this.nativeStorage.setItem('id_scope', this.id_scope);
          this.nativeStorage.setItem('id_partner', this.id_partner);
          this.nativeStorage.setItem('id_appearance', this.id_appearance);
          this.nativeStorage.setItem('id_function', this.id_function);
          this.nativeStorage.setItem('organisation', this.organisation);

          this.db.getTown(this.town_id).then(val => {
            this.sel_village = val.name_town;
          });

          this.db.getScope(this.id_scope).then(val => {
            this.sel_scope = val.cvalue;
          });

          this.db.getScopePartner(this.id_partner).then(val => {
            this.sel_partner = val.contact_name;
          });

          if(this.saved_id != true) {
            this.db.getNewId().then(data => {
              this.survey_unique_id = data.new_id;
            });
          }

          this.db.getAllProjectTask(this.id_scope).then(() => {
            this.db.getProjectTaskList().subscribe(data => {

              let i = 0;
              data.forEach(value => {
                i += 1;

                this.db.checkSavedSurvey(this.project_id, this.id_scope, this.id_partner, this.id_appearance, this.id_function, this.survey_unique_id).then(result => {
                  if (result.total == 0) {
                    this.new_data = true;
                    this.db.addSurveyData(this.project_id, this.id_scope, this.id_partner, this.id_appearance, this.id_function, value.id_task, this.survey_unique_id, this.town_id, this.organisation);
                  } else { this.new_data = false; }
                });

                if (i == data.length) {
                  setTimeout(() => {
                    this.loadQuestions();
                    this.spinner = false;
                  }, 3000);
                }
              });

            });
          });

          this.started = false;
        }
  }

  async loadQuestions() {
    this.questionList = [];
    this.db.getSavedSurvey(this.project_id, this.id_scope, this.id_partner, this.id_appearance, this.id_function, this.survey_unique_id).then(() => {
      this.db.getSurveyData().subscribe(data => {
        this.questionList = data;
      });
    });

    this.db.checkSavedSurvey(this.project_id, this.id_scope, this.id_partner, this.id_appearance, this.id_function, this.survey_unique_id).then(result => {
      if (result.reponse == result.total) {
        this.issue_btn = false;
      } else { this.issue_btn = true; }
    });

    this.nativeStorage.getItem('survey_media').then(media => { 
      if(media == 1) {
        this.add_media = true;
      } else { this.add_media = false; }
    });
  }

  async getAnswer(sv_answer_type_id: any, id_criteria: any, sequence: any, scope_id: any, survey_unique_id: any) {

    let unique_id;
    if (this.new_data == true) {
      unique_id = this.survey_unique_id;
    } else { unique_id = survey_unique_id; }

    const modal = await this.modalController.create({
      component: SurveyAnswerPage,
      componentProps: {
        sv_answer_type_id: sv_answer_type_id,
        survey_unique_id: unique_id,
        id_criteria: id_criteria,
        sequence: sequence,
        scope_id: scope_id
      }
    });

    modal.onDidDismiss().then(() => {
      this.loadQuestions();
    })

    modal.present();
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
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.presentPrompt(154, correctPath, currentName, this.survey_unique_id);
    });
  }

  async presentPrompt(doc_type, correctPath, currentName, survey_response_id) {
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
            this.moveFile(data.description, correctPath, currentName, survey_response_id, doc_type);
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
      let dir = capturedFile['localURL'].split('/');
      dir.pop();
      let fromDirectory = dir.join('/');

      this.presentPrompt(157, fromDirectory, fileName, this.survey_unique_id);

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
      let dir = capturedFile['localURL'].split('/');
      dir.pop();
      let fromDirectory = dir.join('/');

      this.presentPrompt(155, fromDirectory, fileName, this.survey_unique_id);

    }, (err: CaptureError) => console.error(err));
  }

  moveFile(description, correctPath, currentName, survey_response_id, doc_type) {
    var m = new Date();
    let created_date = m.getUTCFullYear() + "-" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + "-" + ("0" + m.getUTCMinutes()).slice(-2) + "-" + ("0" + m.getUTCSeconds()).slice(-2);
    let newPath = this.file.externalDataDirectory + 'icollect_survey/documents/';

    if (doc_type == 155) {
      var newFileName = survey_response_id + '_' + created_date + ".mp4";

      this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
        this.db.saveDocData(this.user.id_contact, survey_response_id, newFileName, description, doc_type, null);
      });

    } else
      if (doc_type == 157) {
        var newFileName = survey_response_id + '_' + created_date + ".mp3";

        this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
          this.db.saveDocData(this.user.id_contact, survey_response_id, newFileName, description, doc_type, null);
        });

      } else {
        var newFileName = survey_response_id + '_' + created_date + ".jpg";

        this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
          this.db.saveDocData(this.user.id_contact, survey_response_id, newFileName, description, doc_type, null);
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

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

  newIssue() {
    this.nativeStorage.setItem('survey_unique_id', this.survey_unique_id);
    this.navCtrl.navigateForward(['/issue/' + this.type]);
  }

  backToDetails() {
    this.navCtrl.navigateBack(['/scope/' + this.type]);
  }

}
