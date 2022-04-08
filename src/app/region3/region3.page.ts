import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-region3',
  templateUrl: './region3.page.html',
  styleUrls: ['./region3.page.scss'],
})
export class Region3Page implements OnInit {

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
    this.db.loadRegions3(region).then(() => {
      this.db.getRegions3().subscribe(data => {
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

  townSelection(region3) {
    this.navCtrl.navigateForward(['/region4/'+region3]);
  }

  backToDetails() {
    this.navCtrl.navigateBack(['/region2/'+this.region]);
  }

}
