import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { LoadingService } from '../services/loading.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss'],
})
export class ProjectListPage implements OnInit {

  projectList: any[] = [];
  user: any;

  constructor(
    public navCtrl: NavController,
    public loading: LoadingService,
    public translate: TranslateService,
    private nativeStorage: NativeStorage,
    private db: DatabaseService
  ) { }

  ngOnInit() {
    this.nativeStorage.remove('id_project');
    this.loadData();
  }

  loadData() {
    this.translate.get('LOADING').subscribe(value => {
      this.loading.showLoader(value);
    });

    this.db.lastLogedUser().then(usr => { 
      this.db.loadProjects(usr.id_country).then(() => { 
        this.db.getProjects().subscribe(data => {
          this.projectList = data;
          this.loading.hideLoader();
        });
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

  townSelection(id_project: any) {
    this.db.countIdProjectTasks(id_project).then(val => { 
      if(val.total > 0) {
        this.nativeStorage.setItem('id_project', id_project);
        this.navCtrl.navigateForward(['/select-towns']);
      } else {
        this.navCtrl.navigateForward(['/download-answers/' + id_project]);
      }
    });

   /* this.db.lastLogedUser().then(usr => {
      if (usr.agent_type == 1016) {
        this.navCtrl.navigateForward(['/select-towns']);
      } else {
        this.navCtrl.navigateForward(['/region']);
      } 
    });*/
  }

}
