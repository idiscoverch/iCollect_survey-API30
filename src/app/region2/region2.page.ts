import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-region2',
  templateUrl: './region2.page.html',
  styleUrls: ['./region2.page.scss'],
})
export class Region2Page implements OnInit {

  region: any;
  townList: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public loading: LoadingService,
    public translate: TranslateService,
    private db: DatabaseService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(param => { 
      this.region = param.get('region');

      this.loadData(this.region);
    });
  }

  loadData(region) {
    this.translate.get('LOADING').subscribe(value => {
      this.loading.showLoader(value);
    });

    this.townList = [];
    this.db.loadRegions2(region).then(() => {
      this.db.getRegions2().subscribe(data => {
        this.townList = data;
        this.loading.hideLoader();
      });
    });
  }

  ionRefresh(event) {
    console.log('Pull Event Triggered!');
    setTimeout(() => {
      console.log('Async operation has ended');
      this.loadData(this.region);
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

  townSelection(region2) {
    this.navCtrl.navigateForward(['/region3/'+region2]);
  }

  backToDetails() {
    this.navCtrl.navigateBack(['/region']);
  }

}
