import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { NetworkService, ConnectionStatus } from '../services/network.service';

@Component({
  selector: 'app-download-answers',
  templateUrl: './download-answers.page.html',
  styleUrls: ['./download-answers.page.scss'],
})
export class DownloadAnswersPage implements OnInit {

  scope_progress: number;
  scope_total_row: any;
  scope_data_date: any;
  scope_total_rows: any;
  scope_total: any;
  scope_row_less = false;
  scope_row_ok = false;
  scope_spinner = false;

  deployment_progress: number;
  deployment_total_row: any;
  deployment_data_date: any;
  deployment_total_rows: any;
  deployment_total: any;
  deployment_row_less = false;
  deployment_row_ok = false;
  deployment_spinner = false;

  task_progress: number;
  task_total_row: any;
  task_data_date: any;
  task_total_rows: any;
  task_total: any;
  task_row_less = false;
  task_row_ok = false;
  task_spinner = false;

  user: any;
  id_project: any;
  project_name: any;
  loading = false;
  start = true;

  constructor(
    public http: HTTP,
    private alertCtrl: AlertController,
    public translate: TranslateService,
    private nativeStorage: NativeStorage,
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private networkService: NetworkService,
    private db: DatabaseService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(param => {
      this.id_project = param.get('id_project');

      this.db.getProject(this.id_project).then(data => {
        this.project_name = data.project_name;
      });
    });

    this.db.lastLogedUser().then(usr => {
      this.user = usr;
    });
  }

  loadProjectTask() { 
    this.db.countIdProjectTasks(this.id_project).then(data => {
      this.db.loadProjectTasksData().then(tsk => {
        this.task_spinner = false;
        this.task_data_date = tsk.data_date;
        this.task_total_rows = tsk.total_rows;
        this.task_total = data.total;

        if (data.total == tsk.total_rows) { this.task_row_ok = true; }
        else { this.task_row_less = true; }
      });
    });
  }

  loadAgentDeployment() {
    this.db.countAgentDeployment().then(data => {
      this.db.loadAgentDeploymentData().then(adp => {
        this.deployment_spinner = false;
        this.deployment_data_date = adp.data_date;
        this.deployment_total_rows = adp.total_rows;
        this.deployment_total = data.total;

        if (data.total == adp.total_rows) { this.deployment_row_ok = true; }
        else { this.deployment_row_less = true; }
      });
    });
  }

  loadScopes() {
    this.db.countScopes().then(data => {
      this.db.loadScopesData().then(adp => {
        this.scope_spinner = false;
        this.scope_data_date = adp.data_date;
        this.scope_total_rows = adp.total_rows;
        this.scope_total = data.total;

        if (data.total == adp.total_rows) { this.scope_row_ok = true; }
        else { this.scope_row_less = true; }
      });
    });
  }

  hideall() {  
    this.deployment_row_less = false; this.deployment_row_ok = false;
    this.task_row_less = false; this.task_row_ok = false;
    this.scope_row_less = false; this.scope_row_ok = false;
    
    this.deployment_total = null;
    this.task_total = null;
    this.scope_total = null;
  }

  async startDownload() {
    this.hideall();

    var yes, no, upLocalDB, upLocalDBText;
    this.translate.get('YES').subscribe(value => { yes = value; });
    this.translate.get('NO').subscribe(value => { no = value; });
    this.translate.get('MSG_UPDATE_LOCAL_DB').subscribe(value => { upLocalDB = value; });
    this.translate.get('MSQ_UPDATE_LOCAL_DB_TEXT').subscribe(value => { upLocalDBText = value; });

    let promptAlert = await this.alertCtrl.create({
      message: upLocalDBText,
      subHeader: upLocalDB,
      buttons: [
        {
          text: no,
          handler: data => {
            console.log(data);
          }
        },
        {
          text: yes,
          handler: data => {
            console.log(data);
            this.updateLocalDB();
          }
        }
      ]
    });
    promptAlert.present();
  }

  updateLocalDB() { 
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      this.loading = false;
      this.translate.get('NO_DATA_STORED').subscribe(
        value => { this.presentAlert(value, 'Error'); }
      );

    } else { 
      this.start = false;
      this.db.clearTaskDeploymentData();
      this.restFetchProjectTask(this.user.id_country, this.id_project);
      this.loading = true;
    }
  }

  async restFetchProjectTask(id_country: any, id_project: any) {
    this.task_spinner = true;
    this.task_progress = 0;

    this.db.restFetchProjectTasksLenth(id_country, id_project).then(total_rows => {
      this.task_total_row = total_rows;
      this.task_total = total_rows;

      let link = 'https://survey.icertification.ch/ords/m/v_project_task/?limit=10000&q={"country_id":"'+id_country+'","id_project":"'+id_project+'"}';

      this.db.deleteProjectTasksProject(id_project).then(() => {
        this.http.get(link, {}, {}).then(data => {
          let raw_data = JSON.parse(data.data);
          let r = raw_data.items;
          let lenth: number = r.length;
         
          if (lenth == 0) { 
            this.loading = true;

            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('project_task', timestamp, 1, null, lenth);

            this.loadProjectTask();
            this.task_spinner = false;
            this.restFetchScope();
            
          } else {
            this.loading = false;

            let i = 1;
            r.forEach(value => { 
              this.db.addProjectTask(value.id_task, value.survey_id, value.scope_id, value.scope_name, value.id_criteria, value.topic_id, value.topic_name, value.desc_en, value.desc_fr, value.desc_in, value.criteria_level, value.media_yn, value.sv_answer_type_id, value.civ1, value.gh, value.in1, value.typedesc, value.range_to, value.range_from, value.answerlist_id, value.sequence, id_project).then(() => {
                this.task_progress = (i / this.task_total_row);
                this.task_total_rows = i; 

                if (i == lenth) {  
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('project_task', timestamp, 1, null, lenth);

                  this.loadProjectTask();
                  this.task_spinner = false;
                  this.restFetchScope();
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });
      });
    });
  }

  restFetchScope() {
    this.scope_spinner = true;
    this.scope_progress = 0;
    
    this.db.restFetchScopesLenth(this.user.id_country,this.id_project).then(total_rows => {
      this.scope_total_row = total_rows;
      this.scope_total = total_rows;
      
      let link = 'https://survey.icertification.ch/ords/m/v_scope_partner/?limit=1000&q={"id_country":"'+this.user.id_country+'","id_project":"'+this.id_project+'"}';

      this.db.deleteScopesProject(this.id_project).then(() => {
        this.http.get(link, {}, {}).then(data => {
          let raw_data = JSON.parse(data.data);
          let r = raw_data.items;
          let lenth: number = r.length;
         
          if (lenth == 0) { 
            this.loading = true;

            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('scope_partner', timestamp, 1, null, lenth);

            this.loadScopes();
            this.scope_spinner = false;
            this.restFetchAgentDeployment(this.user.id_country, this.user.admin, this.id_project);
            
          } else {
            this.loading = false;

            let i = 1;
            r.forEach(value => { 
              this.db.addScopes(value.id_scope_partner, value.id_scope, value.scope_en, value.scope_fr, value.scope_in, value.id_contact, value.contact_name, value.contact_code, value.id_country, value.name_country, value.id_project, value.name_project).then(() => {
                this.scope_progress = (i / this.scope_total_row);
                this.scope_total_rows = i; 

                if (i == lenth) {  
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('scope_partner', timestamp, 1, null, lenth);

                  this.loadScopes();
                  this.scope_spinner = false;
                  this.restFetchAgentDeployment(this.user.id_country, this.user.admin, this.id_project);
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });
      });
    });
  }

  restFetchAgentDeployment(id_country: any, admin: any, id_project: any) {
    this.deployment_spinner = true;
    this.deployment_progress = 0;

    this.db.restFetchAgentDeploymentLenth(id_country, admin, id_project).then(total_rows => {
      this.deployment_total_row = total_rows;
      this.deployment_total = total_rows;

      let link = 'https://survey.icertification.ch/ords/m/v_agent_deployment/?limit=10000&q={"id_country":"'+id_country+'","id_group":"'+admin+'","id_project":"'+id_project+'"}';

      this.db.deleteAgentDeploymentProject(id_project).then(() => {
        this.http.get(link, {}, {}).then(data => {
          let raw_data = JSON.parse(data.data);
          let r = raw_data.items;
          let lenth: number = r.length;
         
          if (lenth == 0) { 
            this.loading = true;

            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('agent_deployment', timestamp, 1, null, lenth);

            this.loadAgentDeployment();
            this.deployment_spinner = false;
            this.townSelection(this.id_project);
            
          } else {
            this.loading = false;

            let i = 1;
            r.forEach(value => { 
              this.db.addAgentDeployment(value.id_agent_deployment, value.id_town, value.name_town, value.id_country, value.name_country, value.code_town, value.region1, value.region2, value.region3, value.region4, value.id_external, value.id_project, value.project_name, value.id_group, value.group_name, value.id_agent, value.agent_name, value.agent_or_group, value.aog_name).then(() => {
                this.deployment_progress = (i / this.deployment_total_row);
                this.deployment_total_rows = i; 

                if (i == lenth) {  
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('agent_deployment', timestamp, 1, null, lenth);

                  this.loadAgentDeployment();
                  this.deployment_spinner = false;
                  this.townSelection(this.id_project);
                  
                }

                i = i + 1;
              });
            });
          }

        }).catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });
      });
    });
  }

  townSelection(id_project: any) {
    this.nativeStorage.setItem('id_project', id_project);
    this.navCtrl.navigateForward(['/select-towns']);
  }

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

  back() {
    this.navCtrl.navigateBack(['/tabs/tabs/project-list']);
  }

}
