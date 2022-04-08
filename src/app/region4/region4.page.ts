import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-region4',
  templateUrl: './region4.page.html',
  styleUrls: ['./region4.page.scss'],
})
export class Region4Page implements OnInit {

  region: any;
  townList: any;
  
  public searchTerm: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public loading: LoadingService,
    public translate: TranslateService,
    private db: DatabaseService,
    private nativeStorage: NativeStorage
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(param => { 
      this.region = param.get('region');
      this.nativeStorage.remove('gid_town');
      this.loadData(this.region);
    });
  }

  loadData(region) {
    this.translate.get('LOADING').subscribe(value => {
      this.loading.showLoader(value);
    });

    this.townList = [];
    this.db.loadRegions4(region).then(() => {
      this.db.getRegions4().subscribe(data => {
        this.townList = data;
        this.loading.hideLoader();
      });
    });
  }

  setFilteredItems() {
    this.townList = this.filterItems(this.searchTerm);
  }

  filterItems(searchTerm) {
    return this.townList.filter(item => {
      return item.code_town.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  onCancel(event) {
    console.log(event);
    this.loadData(this.region);
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

  townSelection(gid_town) {
    this.nativeStorage.setItem('gid_town', gid_town);
    this.nativeStorage.setItem('region', this.region);

    this.navCtrl.navigateForward(['/scope/region4']);
  }

  backToDetails() {
    this.navCtrl.navigateBack(['/region3/'+this.region]);
  }

}
