import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NavController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  name: any;
  company_name: any;
  count_survey: any = 0;
  count_issues: any = 0;

  constructor(
    public navCtrl: NavController,
    private db: DatabaseService,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,    
    private androidPermissions: AndroidPermissions
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.db.lastLogedUser().then(usr => {
      this.name = usr.name;
      this.company_name = usr.company_name;

      this.db.getNumberIssue(usr.id_contact).then(data => {
        this.count_issues = data.total;
      });
  
      this.db.getNumberSurvey(usr.id_contact).then(data => {
        this.count_survey = data.total;
      });
    });

    this.checkPermission();
  }

  checkPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          this.enableGPS();
        } else {
          this.locationAccPermission();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  locationAccPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              this.enableGPS();
            },
            error => {
              console.log(error)
            }
          );
      }
    });
  }

  enableGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        //this.currentLocPosition()
      },
      error => console.log(JSON.stringify(error))
    );
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

  mySurvey() {
    this.navCtrl.navigateForward(['/my-survey']);
  }

  myIssue() {
    this.navCtrl.navigateForward(['/my-issue']);
  }

  logOut() {
    this.db.logAllOut().then(() => {
      this.navCtrl.navigateRoot(['/login']);
    });
  }

}
