import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NetworkService, ConnectionStatus } from '../services/network.service';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions, CaptureAudioOptions } from '@ionic-native/media-capture/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
})
export class SurveyPage implements OnInit {

  type: any;
  region: any;
  id_project: any;
  id_criteria: any;

  id_scope: any;
  id_partner: any;
  organisation: any;
  id_function: any;
  id_appearance: any;
  question: any;
  selectedAnswer: any;

  scopesList: any[] = [];
  partnersList: any[] = [];
  appearanceList: any[] = [];
  functionList: any[] = [];
  answerList: any[] = [];

  disabled_btn = false;
  selected_scop = false;

  question_id: any;
  project_id: any;
  town_id: any;
  country_id: any;
  a_list_number: any;
  a_number: any = "";
  id_agent: any;
  coordx: any;
  coordy: any;
  accuracy: any;

  network: any;
  sequence: any;
  current_question: any = 1;
  total_question: any;
  username: any;
  typedesc: any;
  started = true;
  user: any;
  survey_response_id: any;

  survQ_grade = false;
  survQ_date = false;
  survQ_text = false;
  survQ_number = false;
  survQ_yesno = false;
  survQ_multiple = false;

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

  add_media = false;
  sel_village: any;
  sel_scope: any;
  sel_partner: any;
  question_pagination: any;

  survey_unique_id: any;
  id_task: any;
  last_sequence: any;
  sv_comment: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private networkService: NetworkService,
    public navCtrl: NavController,
    private db: DatabaseService,
    public translate: TranslateService,
    private geolocation: Geolocation,
    private nativeStorage: NativeStorage,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private mediaCapture: MediaCapture,
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
    /*this.nativeStorage.getItem('id_project').then((val) => {
      this.db.loadScopes(val).then(() => {
        this.db.getScopes().subscribe(data => {
          this.scopesList = data;
        });
      });
    }); */

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
    this.db.countQuestions(this.id_scope).then(val => {
      if (val.total == 0) {
        this.translate.get('NO_QUESTION_FOR_SCOPE').subscribe(value => {
          this.presentAlert(value, 'Info');
        });

      } else {

        this.partnersList = [];
        this.selected_scop = true;

        this.question = null;
        this.answerList = null;
        this.disabled_btn = true;

        this.nativeStorage.getItem('id_project').then((val) => {
          this.db.loadScopespartner(this.country_id, val, this.id_scope).then(() => {
            this.db.getScopespartner().subscribe(data => {
              this.partnersList = data.sort((a, b) => a.contact_name> b.contact_name? 1 : -1);
            });
          });
        });

        this.db.getFirstProjectTask(this.id_scope).then(data => {
          if (this.current_question == 1) {
            this.sequence = data.sequence;
            this.id_task = data.id_task;

            if (data.id_task) {
              this.translate.get('NO_QUESTION_FOR_SCOPE').subscribe(value => {
                this.presentAlert(value, 'Info');
              });
            }
          }

          this.db.getProjectTask(this.id_scope, this.sequence).then(qst => {
            this.id_criteria = qst.id_criteria;
            this.question_id = qst.id_task;
            this.sequence = qst.sequence;
            this.typedesc = qst.sv_answer_type_id;
            this.disabled_btn = false;

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
                    /* if (qst.typedesc == 'Yes/No') {
                       this.survQ_grade = false;
                       this.survQ_date = false;
                       this.survQ_text = false;
                       this.survQ_number = false;
                       this.survQ_yesno = true;
                       this.survQ_multiple = false;
     
                     } else */
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

          });

          this.db.countQuestions(this.id_scope).then(data => {
            this.total_question = data.total;
            if (this.current_question == 1) {
              this.last_sequence = this.sequence + (this.total_question - 1);
            }

            this.question_pagination = this.current_question + '/' + this.total_question;
          });

          this.db.getNewId().then(data => {
            this.survey_response_id = data.new_id;
          });

        }).catch(err => {
          console.log(err);

          this.translate.get('NO_SURVEY_SCOPE').subscribe(value => {
            this.presentAlert(value, 'Error');
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

          this.nativeStorage.setItem('id_scope', this.id_scope);
          this.nativeStorage.setItem('id_partner', this.id_partner);
          this.nativeStorage.setItem('id_appearance', this.id_appearance);
          this.nativeStorage.setItem('id_function', this.id_function);

          this.db.getTown(this.town_id).then(val => {
            this.sel_village = val.name_town;
          });

          this.db.getScope(this.id_scope).then(val => {
            this.sel_scope = val.cvalue;
          });

          this.db.getScopePartner(this.id_partner).then(val => {
            this.sel_partner = val.contact_name;
          });

          this.db.getNewId().then(data => {
            this.survey_unique_id = data.new_id;
          });

          this.started = false;
          this.add_media = true;
        }
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
        //if ((this.number_answer != null) && (this.number_answer != "") && (this.number_answer != undefined)) { prompt = true; }
        prompt = true;
        this.text_answer = this.number_answer;

      } else
        if (this.typedesc == 3) {
          if ((this.date_answer != null) && (this.date_answer != "") && (this.date_answer != undefined)) { prompt = true; }

          let date_ans = this.date_answer.split('T');
          this.text_answer = date_ans[0];

        } else
          /* if (this.typedesc == 'Yes/No') {
            if ((this.yes_no_answer != null) && (this.yes_no_answer != "") && (this.yes_no_answer != undefined)) { prompt = true; }
            this.text_answer = this.yes_no_answer;

          } else */
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

    /* if (this.typedesc == 'Grade') {
      this.grade_answer = this.selectedAnswer;
    }

    if (this.typedesc == 'Select from list') {
      this.list_answer = this.selectedAnswer;
    } */

    if (this.typedesc == 1) { this.a_number = 1001; }
    if (this.typedesc == 2) { this.a_number = 1002; }
    if (this.typedesc == 3) { this.a_number = 1003; }
    if (this.typedesc == 5) { this.a_number = 1005; }

    if (this.typedesc == 4) {
      this.grade_answer = this.selectedAnswer;
      this.list_answer = this.selectedAnswer;
    }

    let month_year;
    if (this.date_answer != null) {
      let data = this.date_answer.split('T');
      month_year = data[0];
    } else { month_year = null; }

    /* if(this.current_question == 1) {
      this.start_timestamp = created_date;
    } else { this.start_timestamp = null; } */

    /* if(this.sequence == this.last_sequence) {
      this.end_timestamp = created_date;
      this.completed_date = created_date;
    } else { this.end_timestamp = null; this.completed_date = null; } */


    if (this.sequence == this.last_sequence) {
      this.end_timestamp = created_date;
      this.completed_date = created_date;
      this.completed = 1;
    } else { this.end_timestamp = created_date; this.completed_date = null; this.completed = 0; }

    this.start_timestamp = created_date;

    this.db.addResult(this.survey_response_id, 1005, this.question_id, this.id_criteria, this.project_id, this.id_scope, this.id_partner, this.town_id, this.country_id, this.a_list_number, this.a_number, this.selectedAnswer, created_date, this.id_agent, this.username, this.coordx, this.coordy, this.accuracy, this.sv_comment, this.completed, this.completed_date, null, 0, null, null, null, this.selectedAnswer, this.start_timestamp, this.end_timestamp, month_year, this.number_answer, this.text_answer, this.grade_answer, this.yes_no_answer, this.list_answer, this.multiple_answer, 1, 0, this.survey_unique_id, this.id_function, this.id_appearance, this.organisation, this.typedesc)
      .then(() => {

        this.disabled_btn = true;

        this.translate.get('DATA_SUCCESSFULY_SAVED').subscribe(value => {
          this.toastAlert(value);
        });

        this.sendData(created_date, this.survey_response_id, month_year);

        this.date_answer = null;
        this.text_answer = null;
        this.number_answer = null;
        this.selectedAnswer = null;
        this.yes_no_answer = null;
        this.multiple_answer = null;

        this.current_question = this.current_question + 1;
        this.sequence = this.sequence + 1;

        if (this.sequence > this.last_sequence) {
          this.translate.get('SURVEY_COMPLETE').subscribe(value => {
            this.presentAlert(value, 'Succès');
          });

          this.started = true;
          this.newIssue();

        } else {
          this.checkScope();
        }
      });
  }

  async newIssue() {
    var yes, no, title, msg;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });
    this.translate.get('NEW_ISSUE').subscribe(value => { title = value; });
    this.translate.get('NEW_ISSUE_TEXT').subscribe(value => { msg = value; });

    const promptAlert = await this.alertCtrl.create({
      subHeader: title,
      message: msg,
      buttons: [
        {
          text: no,
          handler: data => {
            console.log(data);
            this.navCtrl.navigateBack(['/select-towns']);
          }
        },
        {
          text: yes,
          handler: data => {
            console.log(data);
            this.openNewIssue();
          }
        }
      ]
    });
    promptAlert.present();
  }

  openNewIssue() {
    this.nativeStorage.setItem('survey_unique_id', this.survey_unique_id).then(() => {
      this.navCtrl.navigateForward(['/issue/' + this.type]);
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
        SCOPE_ID: this.id_scope,
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
        COMPLETED: 0,
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
      this.presentPrompt(154, correctPath, currentName, this.survey_response_id);
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

      this.presentPrompt(157, fromDirectory, fileName, this.survey_response_id);

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

      this.presentPrompt(155, fromDirectory, fileName, this.survey_response_id);

    }, (err: CaptureError) => console.error(err));
  }

  moveFile(description, correctPath, currentName, survey_response_id, doc_type) {
    var m = new Date();
    let created_date = m.getUTCFullYear() + "-" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + "-" + ("0" + m.getUTCMinutes()).slice(-2) + "-" + ("0" + m.getUTCSeconds()).slice(-2);
    let newPath = this.file.externalDataDirectory + 'icollect_survey/documents/';

    if (doc_type == 155) {
      var newFileName = this.survey_response_id + '_' + created_date + ".mp4";

      this.file.moveFile(correctPath, currentName, newPath, newFileName).then(_ => {
        this.db.saveDocData(this.user.id_contact, this.survey_response_id, newFileName, description, doc_type, null);
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

  radioFocus() {
    console.log("radioFocus");
  }

  radioBlur() {
    console.log("radioBlur");
  }

  backToDetails() {
    this.navCtrl.navigateBack(['/scope/' + this.type]);
  }
}
