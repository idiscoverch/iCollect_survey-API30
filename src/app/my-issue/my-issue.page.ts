import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-my-issue',
  templateUrl: './my-issue.page.html',
  styleUrls: ['./my-issue.page.scss'],
})
export class MyIssuePage implements OnInit {

  results: any[] = [];
  
  constructor(
    private db: DatabaseService,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.results = [];
    this.db.lastLogedUser().then(usr => {
      this.db.loadIssueResults(usr.id_contact).then(() => {
        this.db.getResults().subscribe(data => {
          this.results = data;
        });
      });
    });
  }

  surveyMedia(survey_unique_id: any) {
    this.navCtrl.navigateForward(['/media/' + survey_unique_id]);
  }

  backToDB() {
    this.navCtrl.navigateBack(['/tabs/tabs/dashboard']);
  }
}
