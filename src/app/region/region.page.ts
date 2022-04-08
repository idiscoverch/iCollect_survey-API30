import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-region',
  templateUrl: './region.page.html',
  styleUrls: ['./region.page.scss'],
})
export class RegionPage implements OnInit {

  townList: any;

  constructor(
    public navCtrl: NavController,
    public loading: LoadingService,
    public translate: TranslateService,
    private db: DatabaseService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.translate.get('LOADING').subscribe(value => {
      this.loading.showLoader(value);
    });

    this.townList = [];
    this.db.loadRegions().then(() => {
      this.db.getRegions().subscribe(data => {
        this.townList = data;
        this.loading.hideLoader();
      });
    });
  }

  ionRefresh(event) {
    console.log('Pull Event Triggered!');
    setTimeout(() => {
      console.log('Async operation has ended');
      this.loadData();
      //complete()  signify that the refreshing has completed and to close the refresher
      event.target.complete();
    }, 2000);
  }

  ionPull(event) {
    //Emitted while the user is pulling down the content and exposing the refresher.
    console.log('ionPull Event Triggered!' + event);
  }

  ionStart(event) {
    //Emitted when the user begins to start pulling down.
    console.log('ionStart Event Triggered!' + event);
  } 

  townSelection(region1) {
    this.navCtrl.navigateForward(['/region2/'+region1]);
  }

  backToDetails() {
    this.navCtrl.navigateBack(['/tabs/tabs/project-list']);
  }
}
