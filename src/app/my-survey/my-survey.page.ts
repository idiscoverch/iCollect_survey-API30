import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-my-survey',
  templateUrl: './my-survey.page.html',
  styleUrls: ['./my-survey.page.scss'],
})
export class MySurveyPage implements OnInit {

  results: any[] = [];
  scopesList: any[] = [];
  partnersList: any[] = [];

  type_filter: any;
  sel_partner = null;
  sel_scope = null;

  surv_partners = false;
  surv_scopes = false;

  constructor(
    private db: DatabaseService,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.db.lastLogedUser().then(usr => {
      this.partnersList = [];
      this.db.loadAllScopespartner(usr.id_country).then(() => {
        this.db.getScopespartner().subscribe(data => {
          this.partnersList = data;
        });
      });
    });

    this.scopesList = [];
    this.db.loadSurveyScope().then(() => {
      this.db.getSurveyScope().subscribe(data => {
        this.scopesList = data;
      });
    });

    this.filterSurveyResults('all');
  }

  filterSurvey() {
    this.results = [];
    if (this.type_filter == 'scopes') {
      this.surv_scopes = true;
      this.surv_partners = false;
    } else
      if (this.type_filter == 'partners') {
        this.surv_scopes = false;
        this.surv_partners = true;
      } else {
        this.surv_scopes = false;
        this.surv_partners = false;
        this.filterSurveyResults('all');
      }
  }

  filterSurveyResults(value) {
    this.results = [];
    if ((value == 'scopes') && (this.sel_scope != null)) {
      this.db.lastLogedUser().then(usr => {
        this.db.loadSurveyResultsByScope(usr.id_contact, this.sel_scope).then(() => {
          this.db.getResults().subscribe(data => {
            this.results = data;
          });
        });
      });

    } else
      if ((value == 'partners') && (this.sel_partner != null)) {
        this.db.lastLogedUser().then(usr => {
          this.db.loadSurveyResultsByParter(usr.id_contact, this.sel_partner).then(() => {
            this.db.getResults().subscribe(data => {
              this.results = data;
            });
          });
        });

      } else {
        this.db.lastLogedUser().then(usr => {
          this.db.loadSurveyResults(usr.id_contact).then(() => {
            this.db.getResults().subscribe(data => {
              this.results = data;
            });
          });
        });
      }
  }

  surveyDetails(survey_unique_id) {
    this.navCtrl.navigateForward(['/survey-details/' + survey_unique_id]);
  }

  backToDB() {
    this.navCtrl.navigateBack(['/tabs/tabs/dashboard']);
  }
}
