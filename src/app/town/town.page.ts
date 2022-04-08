import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-town',
  templateUrl: './town.page.html',
  styleUrls: ['./town.page.scss'],
})
export class TownPage implements OnInit {

  townList: any[] = [];

  public searchTerm: string = "";

  constructor(
    public navCtrl: NavController,
    public loading: LoadingService,
    public translate: TranslateService,
    private db: DatabaseService,
    private nativeStorage: NativeStorage
  ) { }

  ngOnInit() {
    this.nativeStorage.remove('gid_town');
    this.loadData();
  }

  loadData() {
    this.translate.get('LOADING').subscribe(value => {
      this.loading.showLoader(value);
    });

    this.townList = [];
    this.db.loadTowns().then(() => {
      this.db.getTowns().subscribe(data => {
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
    this.loadData();
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

  townSelection(gid_town) {
    this.nativeStorage.setItem('gid_town', gid_town);
    this.navCtrl.navigateForward(['/scope/town']);
  }

  backToDetails() {
    this.navCtrl.navigateBack(['/tabs/tabs/project-list']);
  }
}
