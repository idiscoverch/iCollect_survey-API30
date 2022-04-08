import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-survey-details',
  templateUrl: './survey-details.page.html',
  styleUrls: ['./survey-details.page.scss'],
})
export class SurveyDetailsPage implements OnInit {

  survey_unique_id: any;
  results: any[] = [];

  continue_btn = true;

  constructor(
    private db: DatabaseService,
    private activatedRoute: ActivatedRoute,
    private nativeStorage: NativeStorage,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.nativeStorage.remove('finish_survey');  
    this.nativeStorage.remove('saved_survey_id'); 
    
    this.activatedRoute.paramMap.subscribe(param => {
      this.survey_unique_id = param.get('survey_unique_id');

      this.results = [];
      this.db.getSurveyDetails(this.survey_unique_id).then(() => {
        this.db.getDetails().subscribe(data => {
          this.results = data;
        });
      });

      let total_question = 0;
      let total_answer = 0;

      this.db.countSurveyQestions(this.survey_unique_id).then(qts => {
        total_question = qts.total_question;

        this.db.countSurveyAnswers(this.survey_unique_id).then(ans => {
          total_answer = ans.total_answer;

          if(total_question == total_answer){
            this.continue_btn = true;
          } else {
            this.continue_btn = false;
          }

        });
      });
    });
  }

  finishSurvey() {
    this.nativeStorage.setItem('finish_survey', 1); 
    this.nativeStorage.setItem('saved_survey_id', this.survey_unique_id);
    this.navCtrl.navigateForward(['/full-survey/town']);
  }

  surveyMedia() {
    this.navCtrl.navigateForward(['/media/' + this.survey_unique_id]);
  }

  backToDB() {
    this.navCtrl.navigateBack(['/my-survey']);
  }

}
