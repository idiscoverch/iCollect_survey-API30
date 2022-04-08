import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { NavController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';
import { NetworkService, ConnectionStatus } from '../services/network.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.page.html',
  styleUrls: ['./download.page.scss'],
})
export class DownloadPage implements OnInit {

  /*deployment_progress: number;
  deployment_total_row: any;
  deployment_data_date: any;
  deployment_total_rows: any;
  deployment_total: any;
  deployment_row_less = false;
  deployment_row_ok = false;
  deployment_spinner = false;*/

  towns_progress: number;
  towns_total_row: any;
  towns_data_date: any;
  towns_total_rows: any;
  towns_total: any;
  towns_row_less = false;
  towns_row_ok = false;
  towns_spinner = false;

  projects_progress: number;
  projects_total_row: any;
  projects_data_date: any;
  projects_total_rows: any;
  projects_total: any;
  projects_row_less = false;
  projects_row_ok = false;
  projects_spinner = false;

  /*task_progress: number;
  task_total_row: any;
  task_data_date: any;
  task_total_rows: any;
  task_total: any;
  task_row_less = false;
  task_row_ok = false;
  task_spinner = false;*/

  certification_progress: number;
  certification_total_row: any;
  certification_data_date: any;
  certification_total_rows: any;
  certification_total: any;
  certification_row_less = false;
  certification_row_ok = false;
  certification_spinner = false;

  /* scope_progress: number;
  scope_total_row: any;
  scope_data_date: any;
  scope_total_rows: any;
  scope_total: any;
  scope_row_less = false;
  scope_row_ok = false;
  scope_spinner = false; */

  regvalues_progress: number;
  regvalues_total_row: any;
  regvalues_data_date: any;
  regvalues_total_rows: any;
  regvalues_total: any;
  regvalues_row_less = false;
  regvalues_row_ok = false;
  regvalues_spinner = false;  

  answers_progress: number;
  answers_total_row: any;
  answers_data_date: any;
  answers_total_rows: any;
  answers_total: any;
  answers_row_less = false;
  answers_row_ok = false;
  answers_spinner = false;

  registers_progress: number;
  registers_total_row: any;
  registers_data_date: any;
  registers_total_rows: any;
  registers_total: any;
  registers_row_less = false;
  registers_row_ok = false;
  registers_spinner = false;

  triggers_progress: number;
  triggers_total_row: any;
  triggers_data_date: any;
  triggers_total_rows: any;
  triggers_total: any;
  triggers_row_less = false;
  triggers_row_ok = false;
  triggers_spinner = false;

  task_scope_progress: number;
  task_scope_total_row: any;
  task_scope_data_date: any;
  task_scope_total_rows: any;
  task_scope_total: any;
  task_scope_row_less = false;
  task_scope_row_ok = false;
  task_scope_spinner = false;

  user: any;
  type: any;
  login = false;
  loading = false;
  //id_project: any;

  constructor(
    public http: HTTP,
    public navCtrl: NavController,
    public translate: TranslateService,
    private alertCtrl: AlertController,
    private activatedRoute: ActivatedRoute,
    private networkService: NetworkService,
    private db: DatabaseService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(param => {
      this.type = param.get('type');

      this.db.lastLogedUser().then(usr => {
        this.user = usr; 

        /*this.db.loadProject(this.user.id_country).then(pjt => {
          this.id_project = pjt.id_project
        });*/

        if(this.type == 'login') {
          this.login = false;
          this.updateLocalDB();

        } else
        if(this.type == 'variables') {   
          this.login = false;
          this.restFetchRegisters();
          
        } else
        /* if(this.type == 'agent_deployment') {   
          this.login = false;
          this.restFetchAgentDeployment(this.user.id_country, this.user.admin, this.id_project);

        } else
        if(this.type == 'project_tasks') {   
          this.login = false;
          this.restFetchProjectTask(this.user.id_country, this.id_project);

        } else */
        if(this.type == 'answers') {   
          this.login = false;
          this.restFetchAnswers();

        } else
        if(this.type == 'issue_items') {   
          this.login = false;
          this.restFetchAnswers();

        } else {  
          this.login = true;
          this.loadRegvalues();
          //this.loadScopes();
          this.loadTowns();
          //this.loadAgentDeployment();
          //this.loadProjectTask();
          this.loadProject();
          this.loadAnswers(); 
          this.loadRegisters();
          this.loadTriggers();
          this.loadCertifications();
          this.loadTaskScope();
        }
      });

    });
  }

  async presentAlert(message, title) {
    const alert = await this.alertCtrl.create({
      message: message,
      subHeader: title,
      buttons: ['OK']
    });
    alert.present();
  }

  loadTaskScope() {
    this.db.countTaskScopes().then(data => {
      this.db.loadTaskScopesData().then(pjt => {
        this.task_scope_spinner = false;
        this.task_scope_data_date = pjt.data_date;
        this.task_scope_total_rows = pjt.total_rows;
        this.task_scope_total = data.total;

        if (data.total == pjt.total_rows) { this.task_scope_row_ok = true; }
        else { this.triggers_row_less = true; }
      });
    });
  }

  loadTriggers() {
    this.db.countTriggers().then(data => {
      this.db.loadTriggersData().then(pjt => {
        this.triggers_spinner = false;
        this.triggers_data_date = pjt.data_date;
        this.triggers_total_rows = pjt.total_rows;
        this.triggers_total = data.total;

        if (data.total == pjt.total_rows) { this.triggers_row_ok = true; }
        else { this.triggers_row_less = true; }
      });
    });
  }

  loadRegisters() {
    this.db.countRegisters().then(data => {
      this.db.loadRegistersData().then(pjt => {
        this.registers_spinner = false;
        this.registers_data_date = pjt.data_date;
        this.registers_total_rows = pjt.total_rows;
        this.registers_total = data.total;

        if (data.total == pjt.total_rows) { this.registers_row_ok = true; }
        else { this.registers_row_less = true; }
      });
    });
  }

  loadAnswers() { 
    this.db.countAnswers().then(data => {
      this.db.loadAnswersData().then(pjt => {
        this.answers_spinner = false;
        this.answers_data_date = pjt.data_date;
        this.answers_total_rows = pjt.total_rows;
        this.answers_total = data.total;

        if (data.total == pjt.total_rows) { this.answers_row_ok = true; }
        else { this.answers_row_less = true; }
      });
    });
  }

  loadProject() { 
    this.db.countProject().then(data => {
      this.db.loadProjectData().then(pjt => {
        this.projects_spinner = false;
        this.projects_data_date = pjt.data_date;
        this.projects_total_rows = pjt.total_rows;
        this.projects_total = data.total;

        if (data.total == pjt.total_rows) { this.projects_row_ok = true; }
        else { this.projects_row_less = true; }
      });
    });
  }

  /* loadProjectTask() { 
    this.db.countProjectTasks().then(data => {
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
  } */

  loadTowns() {
    this.db.countTowns().then(data => {
      this.db.loadTownsData().then(adp => {
        this.towns_spinner = false;
        this.towns_data_date = adp.data_date;
        this.towns_total_rows = adp.total_rows;
        this.towns_total = data.total;

        if (data.total == adp.total_rows) { this.towns_row_ok = true; }
        else { this.towns_row_less = true; }
      });
    });
  }

  loadCertifications() {
    this.db.countCertifications().then(data => {
      this.db.loadCertificationsData().then(adp => {
        this.certification_spinner = false;
        this.certification_data_date = adp.data_date;
        this.certification_total_rows = adp.total_rows;
        this.certification_total = data.total;

        if (data.total == adp.total_rows) { this.certification_row_ok = true; }
        else { this.certification_row_less = true; }
      });
    });
  }

  /* loadScopes() {
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
  } */

  loadRegvalues() {
    this.db.countRegvalues().then(data => {
      this.db.loadRegvaluesData().then(adp => {
        this.regvalues_spinner = false;
        this.regvalues_data_date = adp.data_date;
        this.regvalues_total_rows = adp.total_rows;
        this.regvalues_total = data.total;

        if (data.total == adp.total_rows) { this.regvalues_row_ok = true; }
        else { this.regvalues_row_less = true; }
      });
    });
  }


  hideall() {  
    this.towns_row_less = false; this.towns_row_ok = false;
    //this.deployment_row_less = false; this.deployment_row_ok = false;
    this.projects_row_less = false; this.projects_row_ok = false;
    //this.task_row_less = false; this.task_row_ok = false;
    this.certification_row_less = false; this.certification_row_ok = false;
    //this.scope_row_less = false; this.scope_row_ok = false;
    this.regvalues_row_less = false; this.regvalues_row_ok = false;  
    this.answers_row_less = false; this.answers_row_ok = false; 
    this.registers_row_less = false; this.registers_row_ok = false; 
    this.triggers_row_less = false; this.triggers_row_ok = false;   
    this.task_scope_row_less = false; this.task_scope_row_ok = false;
    
    this.towns_total = null;
    //this.deployment_total = null;
    this.projects_total = null;
    //this.task_total = null;
    this.certification_total = null;
    //this.scope_total = null;
    this.regvalues_total = null;
    this.answers_total = null;
    this.registers_total = null;
    this.triggers_total = null;
    this.task_scope_total = null;
  }

  async download() {
    
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
      this.login = false;
      this.db.clearData();
      this.restFetchTaskScopes();
      this.loading = true;
    }
  }

  async restFetchTaskScopes() { 
    this.task_scope_spinner = true;
    this.task_scope_progress = 0;

    this.db.restFetchTaskScopesLenth().then(total_rows => {
      this.task_scope_total_row = total_rows;
      this.task_scope_total = total_rows;

      let link = 'https://survey.icertification.ch/ords/m/v_task_scopes/?limit=100';

      this.db.deleteTaskScopes().then(() => {
        this.http.get(link, {}, {}).then(data => {
          let raw_data = JSON.parse(data.data);
          let r = raw_data.items;
          let lenth: number = r.length;
         
          if (lenth == 0) { 
            this.loading = true;

            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('task_scopes', timestamp, 1, null, lenth);

            this.loadTaskScope();
            this.task_scope_spinner = false;
            this.restFetchTriggers();

          } else {
            this.loading = false;

            let i = 1;
            r.forEach(value => { 
              this.db.addTaskScopes(value.scope_id, value.id_project, value.desc_en, value.desc_fr, value.desc_in).then(() => {
                this.task_scope_progress = (i / this.task_scope_total_row);
                this.task_scope_total_rows = i; 

                if (i == lenth) {  
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('task_scopes', timestamp, 1, null, lenth);

                  this.loadTaskScope();
                  this.task_scope_spinner = false;
                  this.restFetchTriggers();
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

  async restFetchTriggers() {
    this.triggers_spinner = true;
    this.triggers_progress = 0;

    this.db.restFetchTriggersLenth().then(total_rows => {
      this.triggers_total_row = total_rows;
      this.triggers_total = total_rows;

      let link = 'https://survey.icertification.ch/ords/m/v_triggers_actions/?limit=1000';

      this.db.deleteTriggers().then(() => {
        this.http.get(link, {}, {}).then(data => {
          let raw_data = JSON.parse(data.data);
          let r = raw_data.items;
          let lenth: number = r.length;
         
          if (lenth == 0) { 
            this.loading = true;

            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('triggers_actions', timestamp, 1, null, lenth);

            this.loadTriggers();
            this.triggers_spinner = false;
            this.restFetchCertifications();
            
          } else {
            this.loading = false;

            let i = 1;
            r.forEach(value => { 
              this.db.addTriggers(value.trigger_id, value.topic_id, value.trigger_name_en, value.trigger_name_fr, value.trigger_name_in).then(() => {
                this.triggers_progress = (i / this.triggers_total_row);
                this.triggers_total_rows = i; 

                if (i == lenth) {  
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('triggers_actions', timestamp, 1, null, lenth);

                  this.loadTriggers();
                  this.triggers_spinner = false;
                  this.restFetchCertifications();
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

  restFetchCertifications() {
    this.certification_spinner = true;
    this.certification_progress = 0;

    this.db.restFetchCertificationsLenth().then(total_rows => {
      this.certification_total_row = total_rows;
      this.certification_total = total_rows;

      let link = 'https://survey.icertification.ch/ords/m/v_certification_action/?limit=1000&q={%22action_type_id%22:%221007%22}';

      this.db.deleteCertifications().then(() => {
        this.http.get(link, {}, {}).then(data => {
          let raw_data = JSON.parse(data.data);
          let r = raw_data.items;
          let lenth: number = r.length;
         
          if (lenth == 0) { 
            this.loading = true;

            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('certification_action', timestamp, 1, null, lenth);

            this.loadCertifications();
            this.certification_spinner = false;
            this.restFetchProjects(this.user.id_country, this.user.id_lang);

          } else {
            this.loading = false;

            let i = 1;
            r.forEach(value => { 
              this.db.addCertifications(value.topic_id, value.topic_name, value.desc_en, value.desc_fr, value.desc_in, value.action_type_id, value.action_type_name, value.function_id, value.function_name, value.action_code, value.trigger_id, value.trigger_name, value.trigger_regvalue, value.trigger_regvalue_name, value.trigger_table, value.trigger_table_name, value.trigger_text, value.status, value.status_name).then(() => {
                this.certification_progress = (i / this.certification_total_row);
                this.certification_total_rows = i; 

                if (i == lenth) {  
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('certification_action', timestamp, 1, null, lenth);

                  this.loadCertifications();
                  this.certification_spinner = false;
                  this.restFetchProjects(this.user.id_country, this.user.id_lang);

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

  async restFetchProjects(id_country,id_language) {
    this.projects_spinner = true;
    this.projects_progress = 0;

    this.db.restFetchProjectsLenth(id_country,id_language).then(total_rows => {
      this.projects_total_row = total_rows;
      this.projects_total = total_rows;

      let link = 'https://survey.icertification.ch/ords/m/v_project/?q={"country_id":"'+id_country+'","project_status":"230"}';

      this.db.deleteProjects().then(() => {
        this.http.get(link, {}, {}).then(data => {
          let raw_data = JSON.parse(data.data);
          let r = raw_data.items;
          let lenth: number = r.length;
         
          if (lenth == 0) { 
            this.loading = true;

            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('projects', timestamp, 1, null, lenth);

            this.loadProject();
            this.projects_spinner = false;
            //this.restFetchProjectTask(id_country, this.id_project);
            this.restFetchTowns(id_country);

          } else {
            this.loading = false;

            let i = 1;
            r.forEach(value => { 
              this.db.addProject(value.id_project, value.id_language, value.id_user, value.username, value.project_name, value.project_type, value.start_date, value.due_date, value.end_date, value.project_status, value.project_private, value.id_company, value.id_culture, value.ord_order_id, value.country_id, value.region_id, value.region_quadrant, value.region_tile_status, value.region_tiles_by, value.region_tiles, value.region_tile_server, value.project_mgr_id, value.project_mgr_name, value.project_mgr_company_id, value.id_country, value.region_name, value.creation_date, value.modify_by, value.modified_date, value.cooperative_id, value.zone_color, value.country_mgr_id, value.language_id, value.year_period, value.certification_id, value.task_type, value.task_status, value.project_active, value.approved_date, value.approved_by, value.period, value.topic_id).then(() => {
                this.projects_progress = (i / this.projects_total_row);
                this.projects_total_rows = i; 

                if (i == lenth) {  
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('projects', timestamp, 1, null, lenth);

                  this.loadProject();
                  this.projects_spinner = false;
                  //this.restFetchProjectTask(id_country, value.id_project); 

                  this.db.deleteProjectTasks().then(() => {
                    this.db.deleteAgentDeployment();
                  });

                  this.restFetchTowns(id_country);
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

  /* async restFetchProjectTask(id_country, id_project) {
    this.task_spinner = true;
    this.task_progress = 0;

    this.db.restFetchProjectTasksLenth(id_country, id_project).then(total_rows => {
      this.task_total_row = total_rows;
      this.task_total = total_rows;

      let link = 'https://survey.icertification.ch/ords/m/v_project_task/?limit=10000&q={"country_id":"'+id_country+'","id_project":"'+id_project+'"}';

      this.db.deleteProjectTasks().then(() => {
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
            if(this.type == 'project_tasks'){
              this.login = true;
            } else {
              this.restFetchAgentDeployment(this.user.id_country, this.user.admin, id_project);
            }
            
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
                  if(this.type == 'project_tasks'){
                    this.login = true;
                  } else {
                    this.restFetchAgentDeployment(this.user.id_country, this.user.admin, id_project); 
                  }
                  
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

  restFetchAgentDeployment(id_country, admin, id_project) {
    this.deployment_spinner = true;
    this.deployment_progress = 0;

    this.db.restFetchAgentDeploymentLenth(id_country, admin, id_project).then(total_rows => {
      this.deployment_total_row = total_rows;
      this.deployment_total = total_rows;

      let link = 'https://survey.icertification.ch/ords/m/v_agent_deployment/?limit=10000&q={"id_country":"'+id_country+'","id_group":"'+admin+'","id_project":"'+id_project+'"}';

      this.db.deleteAgentDeployment().then(() => {
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
            if(this.type == 'agent_deployment'){
              this.login = true;
            } else {
              this.restFetchTowns(this.user.id_country, id_project);
            }
            
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
                  if(this.type == 'agent_deployment'){
                    this.login = true;
                  } else {
                    this.restFetchTowns(this.user.id_country, id_project);
                  }
                  
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
  } */

  restFetchTowns(id_country) {
    this.towns_spinner = true;
    this.towns_progress = 0;

    this.db.restFetchTownsLenth(id_country).then(total_rows => {
      this.towns_total_row = total_rows;
      this.towns_total = total_rows;

      let link = 'https://survey.icertification.ch/ords/m/v_towns/?limit=10000&q={"id_country":"'+id_country+'"}';

      this.db.deleteTowns().then(() => {
        this.http.get(link, {}, {}).then(data => {
          let raw_data = JSON.parse(data.data);
          let r = raw_data.items;
          let lenth: number = r.length;
         
          if (lenth == 0) { 
            this.loading = true;

            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('towns', timestamp, 1, null, lenth);

            this.loadTowns();
            this.towns_spinner = false;
            this.restFetchAnswers();

          } else {
            this.loading = false;

            let i = 1;
            r.forEach(value => { 
              this.db.addTowns(value.gid_town, value.name_town, value.name_country, value.x, value.y, value.id_country, value.timezone, value.population, value.photo_link, value.description_en, value.description_fr, value.description_de, value.description_pt, value.description_es, value.code_town, value.region1, value.region2, value.region3, value.region4, value.iso, value.language, value.postcode, value.suburb, value.utc, value.dst, value.timezone1, value.id_town, value.old_id, value.zone, value.region2_id, value.id_code, value.exporter_id, value.inter_ngo_id, value.local_ngo_id, value.id_external, value.exporter, value.intngo, value.localngo).then(() => {
                this.towns_progress = (i / this.towns_total_row);
                this.towns_total_rows = i; 

                if (i == lenth) {  
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('towns', timestamp, 1, null, lenth);

                  this.loadTowns();
                  this.towns_spinner = false;
                  this.restFetchAnswers();
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

  restFetchAnswers() {
    this.answers_spinner = true;
    this.answers_progress = 0;

    this.db.restFetchAnswersLenth().then(total_rows => {
      this.answers_total_row = total_rows;
      this.answers_total = total_rows;

      let link = 'https://survey.icertification.ch/ords/m/v_sv_answers_def/?limit=30000';

      this.db.deleteAnswers().then(() => {
        this.http.get(link, {}, {}).then(data => {
          let raw_data = JSON.parse(data.data);
          let r = raw_data.items;
          let lenth: number = r.length;
         
          if (lenth == 0) { 
            this.loading = true;

            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('sv_answers_def', timestamp, 1, null, lenth);

            this.loadAnswers();
            this.answers_spinner = false;
            if(this.type == 'answers'){
              this.login = true;
            } else {
              this.db.deleteScopes();
              //this.restFetchScope();
              this.restFetchRegisters();
            }
            
          } else {
            this.loading = false;

            let i = 1;
            r.forEach(value => { 
              this.db.addAnswers(value.sv_answers_def_id, value.id_criteria, value.range_from, value.range_to, value.seq, value.value_en, value.value_fr, value.value_po, value.value_es, value.value_in, value.a_number, value.a_cat_number, value.media_yn, value.a_list_number, value.a_list_name).then(() => {
                this.answers_progress = (i / this.answers_total_row);
                this.answers_total_rows = i; 

                if (i == lenth) {  
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('sv_answers_def', timestamp, 1, null, lenth);

                  this.loadAnswers();
                  this.answers_spinner = false;
                  if(this.type == 'answers'){
                    this.login = true;
                  } else {
                    this.db.deleteScopes();
                    //this.restFetchScope();
                    this.restFetchRegisters();
                  }
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

  /* restFetchScope() {
    this.scope_spinner = true;
    this.scope_progress = 0;
    
    this.db.restFetchScopesLenth(this.user.id_country).then(total_rows => {
      this.scope_total_row = total_rows;
      this.scope_total = total_rows;
      
      let link = 'https://survey.icertification.ch/ords/m/v_scope_partner/?limit=1000&q={"id_country":"'+this.user.id_country+'"}';

      this.db.deleteScopes().then(() => {
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
            this.restFetchRegisters();
            
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
                  this.restFetchRegisters();
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
  } */

  restFetchRegisters() {
    this.registers_spinner = true;
    this.registers_progress = 0;

    this.db.restFetchRegistersLenth().then(total_rows => {
      this.registers_total_row = total_rows;
      this.registers_total = total_rows;
      
      let link = 'https://survey.icertification.ch/ords/m/v_registers/?limit=1000';

      this.db.deleteRegisters().then(() => {
        this.http.get(link, {}, {}).then(data => {
          let raw_data = JSON.parse(data.data);
          let r = raw_data.items;
          let lenth: number = r.length;
         
          if (lenth == 0) { 
            this.loading = true;

            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('registers', timestamp, 1, null, lenth);

            this.loadRegisters();
            this.registers_spinner = false;

            if((this.type == 'login') || (this.type == 'variables')) {
              this.restFetchRegvalues();
            } else {
              this.navCtrl.navigateForward(['/tabs/tabs/dashboard']);
            }
            
          } else {
            this.loading = false;

            let i = 1;
            r.forEach(value => { 
              this.db.addRegisters(value.id_register, value.regname, value.regcode, value.used_by_module, value.regnamede, value.regnamefr, value.regnamept, value.regnamees, value.regnamein).then(() => {
                this.registers_progress = (i / this.registers_total_row);
                this.registers_total_rows = i; 

                if (i == lenth) {  
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('registers', timestamp, 1, null, lenth);

                  this.loadRegisters();
                  this.registers_spinner = false;

                  if((this.type == 'login') || (this.type == 'variables')) {
                    this.restFetchRegvalues();
                  } else {
                    this.navCtrl.navigateForward(['/tabs/tabs/dashboard']);
                  }
                  
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

  restFetchRegvalues() {
    this.regvalues_spinner = true;
    this.regvalues_progress = 0;

    this.db.restFetchRegvaluesLenth().then(total_rows => {
      this.regvalues_total_row = total_rows;
      this.regvalues_total = total_rows;

      let link = 'https://survey.icertification.ch/ords/m/v_regvalues/?limit=1000&q={"nvalue":"5"}';

      this.db.deleteRegvalues().then(() => {
        this.http.get(link, {}, {}).then(data => {
          let raw_data = JSON.parse(data.data);
          let r = raw_data.items;
          let lenth: number = r.length;
         
          if (lenth == 0) { 
            this.loading = true;

            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.db.addData('regvalues', timestamp, 1, null, lenth);

            this.loadRegvalues();
            this.regvalues_spinner = false;

            if(this.type == 'variables') {
              this.login = true;
            } else {
              this.navCtrl.navigateForward(['/tabs/tabs/dashboard']);
            }
            
          } else {
            this.loading = false;

            let i = 1;
            r.forEach(value => { 
              this.db.addRegvalues(value.id_regvalue, value.id_register, value.nvalue, value.cvalue, value.cvaluede, value.cvaluefr, value.cvaluept, value.cvaluees, value.dvalue, value.created_by, value.created_date, value.modified_by, value.modified_date, value.sequence_nr, value.comm, value.active, value.deleted, value.cvaluesw, value.cvalueit, value.cvalueind, value.com, value.comment).then(() => {
                this.regvalues_progress = (i / this.regvalues_total_row);
                this.regvalues_total_rows = i; 

                if (i == lenth) {  
                  var m = new Date();
                  let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
                  this.db.addData('regvalues', timestamp, 1, null, lenth);

                  this.loadRegvalues();
                  this.regvalues_spinner = false;
                  if(this.type == 'variables') {
                    this.login = true;
                  } else {
                    this.navCtrl.navigateForward(['/tabs/tabs/dashboard']);
                  }
                  
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

  back() {
    this.navCtrl.navigateForward(['/tabs/tabs/dashboard']);
  }

}
