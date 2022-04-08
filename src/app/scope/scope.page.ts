import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-scope',
  templateUrl: './scope.page.html',
  styleUrls: ['./scope.page.scss'],
})
export class ScopePage implements OnInit {

  type:any;
  region: any;

  constructor(
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private nativeStorage: NativeStorage,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(param => { 
      this.type = param.get('type');
    });
  }

  async newSurvey() {
    this.nativeStorage.remove('finish_survey');
    this.nativeStorage.remove('survey_unique_id').then(data => console.log(data));
    this.nativeStorage.remove('survey_media');

    this.navCtrl.navigateForward(['/full-survey/'+this.type]);

    /* var one_by_one, full_question, title, msg;
    this.translate.get('ONE_BY_ONE_SURVEY').subscribe(value => { one_by_one = value; });
    this.translate.get('FULL_QUESTION_SURVEY').subscribe(value => { full_question = value; });
    this.translate.get('CHOICE_SURVEY').subscribe(value => { title = value; });
    this.translate.get('CHOICE_SURVEY_TEXT').subscribe(value => { msg = value; });

    const promptAlert = await this.alertCtrl.create({
      subHeader: title,
      message: msg,
      buttons: [
        {
          text: one_by_one,
          handler: data => {
            console.log(data);
            this.navCtrl.navigateForward(['/survey/'+this.type]);
          }
        },
        {
          text: full_question,
          handler: data => {
            console.log(data);
            this.navCtrl.navigateForward(['/full-survey/'+this.type]);
          }
        }
      ]
    });
    promptAlert.present(); */
  }

  newIssue() {
    this.nativeStorage.remove('id_scope');
    this.nativeStorage.remove('id_partner');
    this.nativeStorage.remove('id_appearance');
    this.nativeStorage.remove('id_function');
    this.nativeStorage.remove('survey_unique_id');

    this.navCtrl.navigateForward(['/issue/'+this.type]);
  }

  backToDetails() {
    if(this.type == 'town') {
      this.navCtrl.navigateBack(['/town']);
    } else {
      this.nativeStorage.getItem('region').then(val => {
        this.navCtrl.navigateBack(['/region4/'+val]);
      });
    }
  }
}
