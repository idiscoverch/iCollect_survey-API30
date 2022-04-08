import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { NavParams, ModalController, AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { ConnectionStatus, NetworkService } from '../services/network.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions, CaptureAudioOptions } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-survey-answer',
  templateUrl: './survey-answer.page.html',
  styleUrls: ['./survey-answer.page.scss'],
})
export class SurveyAnswerPage implements OnInit {

  question: any;
  scope_id: any;
  sequence: any;
  id_criteria: any;
  selectedAnswer: any;
  sv_answer_type_id: any;
  a_list_number: any;
  a_number: any = "";
  id_agent: any;
  coordx: any;
  coordy: any;
  accuracy: any;

  survQ_grade = false;
  survQ_date = false;
  survQ_text = false;
  survQ_number = false;
  survQ_yesno = false;
  survQ_multiple = false;
  disabled_btn = false;
  media_yn = false;

  date_answer = null;
  number_answer = null;
  text_answer = null;
  grade_answer = null;
  yes_no_answer = null;
  list_answer = null;
  multiple_answer = null;
  multiple_answer_text: any = "";
  start_timestamp = null;
  end_timestamp = null;
  completed_date = null;
  completed = 0;

  user: any;
  username: any;
  country_id: any;
  town_id: any;
  id_partner: any;
  project_id: any;
  sv_comment: any;
  question_id: any;
  typedesc: any;
  network: any;
  survey_response_id: any;
  survey_unique_id: any;
  id_function: any;
  id_appearance: any;
  organisation: any;
  tt_saved_media = 0;

  answerList: any[] = [];
  mediaPictureList: any[] = [];

  constructor(
    private db: DatabaseService,
    private navParams: NavParams,
    public translate: TranslateService,
    private alertCtrl: AlertController,
    private nativeStorage: NativeStorage,
    private toastController: ToastController,
    private modalController: ModalController,
    private networkService: NetworkService,
    private geolocation: Geolocation,
    private mediaCapture: MediaCapture,
    private photoViewer: PhotoViewer,
    private camera: Camera,
    private file: File,
    private http: HTTP
  ) {
    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        this.network = true;
      } else { this.network = false; }
    });
  }

  ngOnInit() {
    this.scope_id = this.navParams.get('scope_id');
    this.sequence = this.navParams.get('sequence');
    this.id_criteria = this.navParams.get('id_criteria');
    this.sv_answer_type_id = this.navParams.get('sv_answer_type_id');
    this.survey_unique_id = this.navParams.get('survey_unique_id');

    this.nativeStorage.getItem('id_project').then((val) => { this.project_id = val; });
    this.nativeStorage.getItem('id_partner').then((val) => { this.id_partner = val; });
    this.nativeStorage.getItem('gid_town').then((val2) => { this.town_id = val2; });
    this.nativeStorage.getItem('id_function').then((val2) => { this.id_function = val2; });
    this.nativeStorage.getItem('id_appearance').then((val2) => { this.id_appearance = val2; });
    this.nativeStorage.getItem('organisation').then((val2) => { this.organisation = val2; });

    this.db.getProjectTask(this.scope_id, this.sequence).then(qst => {
      this.id_criteria = qst.id_criteria;
      this.question_id = qst.id_task;
      this.sequence = qst.sequence;
      this.typedesc = qst.sv_answer_type_id;

      this.disabled_btn = false;
      if (qst.media_yn == 1) {
        this.media_yn = true;
      } else {
        this.media_yn = false;
      }

      if (qst.sv_answer_type_id == 4) {
        this.survQ_grade = true;
        this.survQ_date = false;
        this.survQ_text = false;
        this.survQ_number = false;
        this.survQ_yesno = false;
        this.survQ_multiple = false;

      } else
        if (qst.sv_answer_type_id == 1) {
          this.survQ_grade = false;
          this.survQ_date = false;
          this.survQ_text = true;
          this.survQ_number = false;
          this.survQ_yesno = false;
          this.survQ_multiple = false;

        } else
          if (qst.sv_answer_type_id == 2) {
            this.survQ_grade = false;
            this.survQ_date = false;
            this.survQ_text = false;
            this.survQ_number = true;
            this.survQ_yesno = false;
            this.survQ_multiple = false;

          } else
            if (qst.sv_answer_type_id == 3) {
              this.survQ_grade = false;
              this.survQ_date = true;
              this.survQ_text = false;
              this.survQ_number = false;
              this.survQ_yesno = false;
              this.survQ_multiple = false;

            } else
              if (qst.sv_answer_type_id == 5) {
                this.survQ_grade = false;
                this.survQ_date = false;
                this.survQ_text = false;
                this.survQ_number = false;
                this.survQ_yesno = false;
                this.survQ_multiple = true;

              } else {
                this.survQ_grade = true;
                this.survQ_date = false;
                this.survQ_text = false;
                this.survQ_number = false;
                this.survQ_yesno = false;
                this.survQ_multiple = false;
              }

      this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
        if (value == 'en') {
          this.question = qst.desc_en;
        } else
          if (value == 'fr') {
            this.question = qst.desc_fr;
          } else {
            this.question = qst.desc_in;
          }
      });

      this.answerList = [];
      this.db.loadAnswers(qst.id_criteria).then(() => {
        this.db.getAnswers().subscribe(ans => {
          this.answerList = ans;

          if (ans.length == 1) {
            this.selectedAnswer = ans[0].sv_answers_def_id;
            this.a_list_number = ans[0].a_list_number;
            this.a_number = ans[0].a_number;
          }
        });
      });

      this.db.getNewId().then(data => {
        this.survey_response_id = data.new_id;
      });

      this.mediaPictureList = [];
      this.db.getSurveyMedia().subscribe(media => {
        this.mediaPictureList = media;
      });

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
  }

  radioSelect(sv_answers_def_id) {
    this.selectedAnswer = sv_answers_def_id;
    this.db.getAnswer(sv_answers_def_id).then(data => {
      this.a_list_number = data.a_list_number;
      this.a_number = data.a_number;
    });
  }

  getSelectedYesNo() {
    this.db.getAnswer(this.yes_no_answer).then(data => {
      this.a_list_number = data.a_list_number;
      this.a_number = data.a_number;
    });
  }

  async next() {

    var prompt = false;

    if (this.typedesc == 1) {
      if ((this.text_answer != null) && (this.text_answer != "") && (this.text_answer != undefined)) { prompt = true; }

    } else
      if (this.typedesc == 2) {
        prompt = true;
        this.text_answer = this.number_answer;

      } else
        if (this.typedesc == 3) {
          if ((this.date_answer != null) && (this.date_answer != "") && (this.date_answer != undefined)) { prompt = true; }

          let date_ans = this.date_answer.split('T');
          this.text_answer = date_ans[0];

        } else
          if (this.typedesc == 5) {
            if ((this.multiple_answer != null) && (this.multiple_answer != "") && (this.multiple_answer != undefined)) { prompt = true; }

            this.a_number = "";
            this.multiple_answer.forEach(element => {
              this.db.getAnswer(element).then(data => {
                if (this.a_number == "") {
                  this.a_number = data.a_number;
                  this.multiple_answer_text = data.answer;
                } else {
                  this.a_number = this.a_number + ',' + data.a_number;
                  this.multiple_answer_text = this.multiple_answer_text + ';' + data.answer;
                }

                this.a_list_number = data.a_list_number;
                this.text_answer = this.multiple_answer_text;
              });
            });

          } else
            if (this.typedesc == 4) {
              if ((this.selectedAnswer != null) && (this.selectedAnswer != "") && (this.selectedAnswer != undefined)) { prompt = true; }

              this.db.getAnswer(this.selectedAnswer).then(data => {
                this.text_answer = data.answer;
              });

            } else {
              prompt = false;
            }

    if (prompt == false) {
      this.translate.get('ANSWER_FIRST').subscribe(value => {
        this.toastAlert(value);
      });

    } else {
      var yes, no, title, msg;
      this.translate.get('YES').subscribe(value => { yes = value; });
      this.translate.get('NO').subscribe(value => { no = value; });
      this.translate.get('SAVE_SURVEY_HEADER').subscribe(value => { title = value; });
      this.translate.get('SAVE_SURVEY_PROMPT').subscribe(value => { msg = value; });

      const promptAlert = await this.alertCtrl.create({
        subHeader: title,
        message: msg,
        buttons: [
          {
            text: no,
            handler: data => {
              console.log(data);
            }
          },
          {
            text: yes,
            handler: data => {
              console.log(data);
              this.saveAndNext();
            }
          }
        ]
      });
      promptAlert.present();
    }
  }

  saveAndNext() {
    var m = new Date();
    let created_date = m.getUTCFullYear() + "-" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    //if (this.typedesc == 1) { this.a_number = 1001; } 
    //if (this.typedesc == 2) { this.a_number = 1002; }
    //if (this.typedesc == 3) { this.a_number = 1003; }
    //if (this.typedesc == 5) { this.a_number = 1005; }

    if (this.typedesc == 4) {
      this.grade_answer = this.selectedAnswer;
      this.list_answer = this.selectedAnswer;
    }

    let month_year;
    if (this.date_answer != null) {
      let data = this.date_answer.split('T');
      month_year = data[0];
    } else { month_year = null; }


    this.db.countSurveyQestions(this.survey_unique_id).then(qts => {
      this.db.countSurveyAnswers(this.survey_unique_id).then(ans => {

        if ((qts.total_question - 1) == ans.total_answer) { 
          this.end_timestamp = created_date;
          this.completed_date = created_date;
          this.completed = 1;
        } else {
          this.end_timestamp = null;
          this.completed_date = null;
          this.completed = 0;
        }

        this.start_timestamp = created_date;

        this.db.addResult(this.survey_response_id, 1005, this.question_id, this.id_criteria, this.project_id, this.scope_id, this.id_partner, this.town_id, this.country_id, this.a_list_number, this.a_number, this.selectedAnswer, created_date, this.id_agent, this.username, this.coordx, this.coordy, this.accuracy, this.sv_comment, this.completed, this.completed_date, null, 0, null, null, null, this.selectedAnswer, this.start_timestamp, this.end_timestamp, month_year, this.number_answer, this.text_answer, this.grade_answer, this.yes_no_answer, this.list_answer, this.multiple_answer, 1, 0, this.survey_unique_id, this.id_function, this.id_appearance, this.organisation, this.typedesc)
          .then(() => {

            this.disabled_btn = true;

            this.nativeStorage.setItem('survey_media', 1).then(data => console.log(data));

            this.translate.get('DATA_SUCCESSFULY_SAVED').subscribe(value => {
              this.toastAlert(value);
            });

            this.sendData(created_date, this.survey_response_id, month_year);
            this.db.addSurveyDataAnswer(this.text_answer, this.question_id, this.survey_unique_id);

            this.date_answer = null;
            this.text_answer = null;
            this.number_answer = null;
            this.selectedAnswer = null;
            this.yes_no_answer = null;
            this.multiple_answer = null;

            this.closeModal();
          });

      });
    });

  }

  newMedia() {
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

  async presentPrompt(doc_type: any, correctPath: any, currentName: any, survey_response_id: any) {
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

  moveFile(description: any, correctPath: any, currentName: any, survey_response_id: any, doc_type: any) {
    var m = new Date();
    let created_date = m.getUTCFullYear() + "-" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + "-" + ("0" + m.getUTCMinutes()).slice(-2) + "-" + ("0" + m.getUTCSeconds()).slice(-2);
    let newPath = this.file.externalDataDirectory + 'icollect_survey/documents/';

    if (doc_type == 155) {
      var newFileName = survey_response_id + '_' + created_date + ".mp4";

      this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
        this.db.saveDocData(this.user.id_contact, survey_response_id, newFileName, description, doc_type, this.survey_response_id);

        setTimeout(() => {
          this.countSavedMedia(this.survey_response_id);
        }, 2000);

      });

    } else
      if (doc_type == 157) {
        var newFileName = survey_response_id + '_' + created_date + ".mp3";

        this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
          this.db.saveDocData(this.user.id_contact, survey_response_id, newFileName, description, doc_type, this.survey_response_id);

          setTimeout(() => {
            this.countSavedMedia(this.survey_response_id);
          }, 2000);

        });

      } else {
        var newFileName = survey_response_id + '_' + created_date + ".jpg";

        this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
          this.db.saveDocData(this.user.id_contact, survey_response_id, newFileName, description, doc_type, this.survey_response_id);

          setTimeout(() => {
            this.countSavedMedia(this.survey_response_id);
          }, 2000);

        });
      }
  }

  countSavedMedia(survey_id: any) {
    this.db.countSurveyMedia(survey_id).then(value => {
      this.tt_saved_media = value.tt_media;
      this.db.loadSurveyMedia(survey_id);
    });
  }

  sendData(created_date, survey_response_id, month_year) {
    if (this.network == true) {

      var link = 'https://survey.icertification.ch/ords/m/sv/sv_results/';

      var myData = JSON.stringify({
        SURVEY_RESPONSE_ID: survey_response_id,
        ACTION_TYPE_ID: 1005,
        QUESTION_ID: this.question_id,
        CRITERIA_ID: this.id_criteria,
        PROJECT_ID: this.project_id,
        SCOPE_ID: this.scope_id,
        PARTNER_ID: this.id_partner,
        TOWN_ID: this.town_id,
        COUNTRY_ID: this.country_id,
        A_LIST_NUMBER: this.a_list_number,
        A_NUMBER: this.a_number,
        SV_ANSWERS_DEF_ID: this.selectedAnswer,
        CREATED_DATE: created_date,
        ID_AGENT: this.id_agent,
        CREATED_BY: this.username,
        COORDX: this.coordx,
        COORDY: this.coordy,
        ACCURACY: this.accuracy,
        SV_COMMENT: this.sv_comment,
        COMPLETED: this.completed,
        COMPLETED_DATE: this.completed_date,
        ISSUE_ID: null,
        SYNC_TO_SERVER: 1,
        SYNC_TO_SERVER_DATE: created_date,
        START_TIMESTAMP: this.start_timestamp,
        ACTION_ID: this.selectedAnswer,
        DATE_ANSWER: month_year,
        NUMBER_ANSWER: this.number_answer,
        TEXT_ANSWER: this.text_answer,
        GRADE_ANSWER: this.grade_answer,
        YES_NO_ANSWER: this.yes_no_answer,
        LIST_ANSWER: this.list_answer,
        MULTIPLE_ANSWERS: this.multiple_answer,
        SURVEY_UNIQUE_ID: this.survey_unique_id,
        FUNCTION_ID: this.id_function,
        APPEARANCE_ID: this.id_appearance,
        END_TIMESTAMP: this.end_timestamp,
        ORG_NAME: this.organisation,
        SV_ANSWER_TYPE_ID: this.typedesc
      });

      this.http.setDataSerializer('utf8');
      this.http.post(link, myData, {})
        .then((data) => {
          console.log(JSON.stringify(data));
          this.toastAlert('Données chargés avec succès.');
          this.db.updateAnsSync(survey_response_id, created_date);
          this.disabled_btn = false;

          this.db.lastLogedUser().then(usr => {
            this.db.restFetchUserActive(usr.id_contact);
          });

        }).catch((error) => {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
        });

    } else {
      this.disabled_btn = false;
    }
  }

  showMedia(filename) {
    this.photoViewer.show(this.file.externalDataDirectory + 'icollect_survey/documents/' + filename);
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

  radioFocus() {
    console.log("radioFocus");
  }

  radioBlur() {
    console.log("radioBlur");
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
