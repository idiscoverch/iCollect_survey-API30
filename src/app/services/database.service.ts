import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform, NavController, AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from './loading.service';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  projects = new BehaviorSubject([]);
  regions = new BehaviorSubject([]);
  regions2 = new BehaviorSubject([]);
  regions3 = new BehaviorSubject([]);
  regions4 = new BehaviorSubject([]);
  towns = new BehaviorSubject([]);
  scopes = new BehaviorSubject([]);
  scopes_partner = new BehaviorSubject([]);
  issue_category = new BehaviorSubject([]);
  category_action = new BehaviorSubject([]);
  appearance = new BehaviorSubject([]);
  function = new BehaviorSubject([]);
  answers = new BehaviorSubject([]);
  triggers_actions = new BehaviorSubject([]);
  documents = new BehaviorSubject([]);
  notSyncAns = new BehaviorSubject([]);
  results = new BehaviorSubject([]);
  details = new BehaviorSubject([]);
  project_task = new BehaviorSubject([]);
  survey_data = new BehaviorSubject([]);
  survey_media = new BehaviorSubject([]);

  constructor(
    private plt: Platform,
    public http: HTTP,
    private file: File,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private HttpClient: HttpClient,
    public translate: TranslateService,
    public loading: LoadingService,
    private geolocation: Geolocation,
    private toastController: ToastController,
    private webview: WebView,
    private androidPermissions: AndroidPermissions
  ) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'icollect_survey_1.27.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.createTables();
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

  createTables() {
    this.translate.get('DB_CREATION').subscribe(value => {
      this.loading.showLoader(value);
    });

    this.database.executeSql('CREATE TABLE IF NOT EXISTS users (id_contact INTEGER PRIMARY KEY AUTOINCREMENT, company_name TEXT, name_town TEXT, id_country INTEGER, name_country TEXT, code TEXT, username TEXT, password TEXT, id_exporter INTEGER, id_buyer INTEGER, id_farmer INTEGER, id_supchain_type INTEGER, id_user_supchain_type INTEGER, supchain_type TEXT, user_supchain_type TEXT, id_user INTEGER, id_company INTEGER, name TEXT, id_town INTEGER, idview TEXT, id_cooperative INTEGER, downline INTEGER, active INTEGER, pwd_reset INTEGER, salt TEXT, contact_code TEXT, p_email3_pwd TEXT, p_email3 TEXT, firstname TEXT, lastname TEXT, p_email TEXT, p_phone TEXT, id_primary_company INTEGER, pcompany_name TEXT, password_2 TEXT, admin TEXT, agent_type INTEGER, log INTEGER, lang TEXT, save_login INTEGER);', []).then(() => {
      this.database.executeSql('CREATE TABLE IF NOT EXISTS agent_deployment (id_agent_deployment INTEGER PRIMARY KEY AUTOINCREMENT, id_town INTEGER, name_town TEXT, id_country INTEGER, name_country TEXT, code_town TEXT, region1 TEXT, region2 TEXT, region3 TEXT, region4 TEXT, id_external INTEGER, id_project INTEGER, project_name TEXT, id_group INTEGER, group_name TEXT, id_agent INTEGER, agent_name TEXT, agent_or_group INTEGER, aog_name TEXT);', []).then(() => {
        this.database.executeSql('CREATE TABLE IF NOT EXISTS towns (gid_town INTEGER PRIMARY KEY AUTOINCREMENT, name_town TEXT, name_country TEXT, x REAL, y REAL, id_country INTEGER, timezone TEXT, population INTEGER, photo_link TEXT, description_en TEXT, description_fr TEXT, description_de TEXT, description_pt TEXT, description_es TEXT, code_town TEXT, region1 TEXT, region2 TEXT, region3 TEXT, region4 TEXT, iso TEXT, language TEXT, postcode TEXT, suburb TEXT, utc TEXT, dst TEXT, timezone1 TEXT, id_town INTEGER, old_id INTEGER, zone TEXT, region2_id INTEGER, id_code INTEGER, exporter_id INTEGER, inter_ngo_id INTEGER, local_ngo_id INTEGER, id_external INTEGER, exporter TEXT, intngo TEXT, localngo TEXT);', []).then(() => {
          this.database.executeSql('CREATE TABLE IF NOT EXISTS projects (id_project INTEGER PRIMARY KEY AUTOINCREMENT, id_language INTEGER, id_user INTEGER, username TEXT, project_name TEXT, project_type TEXT, start_date TEXT, due_date TEXT, end_date TEXT, project_status INTEGER, project_private TEXT, id_company INTEGER, id_culture INTEGER, ord_order_id INTEGER, country_id INTEGER, region_id INTEGER, region_quadrant TEXT, region_tile_status TEXT, region_tiles_by	TEXT, region_tiles TEXT, region_tile_server TEXT, project_mgr_id INTEGER, project_mgr_name TEXT, project_mgr_company_id INTEGER, id_country INTEGER, region_name TEXT, creation_date TEXT, modify_by TEXT, modified_date TEXT, cooperative_id INTEGER, zone_color TEXT, country_mgr_id INTEGER, language_id INTEGER, year_period INTEGER, certification_id INTEGER, task_type TEXT, task_status TEXT, project_active INTEGER, approved_date TEXT, approved_by TEXT, period TEXT, topic_id INTEGER);', []).then(() => {
            this.database.executeSql('CREATE TABLE IF NOT EXISTS project_task (id_task INTEGER PRIMARY KEY AUTOINCREMENT, survey_id INTEGER, scope_id INTEGER, scope_name TEXT, id_criteria INTEGER, topic_id INTEGER, topic_name TEXT, desc_en TEXT, desc_fr TEXT, desc_in TEXT, criteria_level INTEGER, media_yn TEXT, sv_answer_type_id INTEGER, civ1 TEXT, gh TEXT, in1 INTEGER, typedesc TEXT, range_to TEXT, range_from TEXT, answerlist_id INTEGER, sequence INTEGER, id_project INTEGER);', []).then(() => {
              this.database.executeSql('CREATE TABLE IF NOT EXISTS certification_action (topic_id INTEGER, topic_name TEXT, desc_en TEXT, desc_fr TEXT, desc_in TEXT, action_type_id INTEGER, action_type_name TEXT, function_id INTEGER, function_name TEXT, action_code TEXT, trigger_id INTEGER, trigger_name TEXT, trigger_regvalue TEXT, trigger_regvalue_name TEXT, trigger_table TEXT, trigger_table_name TEXT, trigger_text TEXT, status TEXT, status_name TEXT);', []).then(() => {
                this.database.executeSql('CREATE TABLE IF NOT EXISTS scope_partner (id_scope_partner INTEGER PRIMARY KEY AUTOINCREMENT, id_scope INTEGER, scope_en TEXT, scope_fr TEXT, scope_in TEXT, id_contact INTEGER, contact_name TEXT, contact_code TEXT, id_country INTEGER, name_country TEXT, id_project INTEGER, name_project TEXT);', []).then(() => {
                  this.database.executeSql('CREATE TABLE IF NOT EXISTS regvalues (id_regvalue INTEGER PRIMARY KEY AUTOINCREMENT, id_register INTEGER, nvalue INTEGER, cvalue TEXT, cvaluede TEXT, cvaluefr TEXT, cvaluept TEXT, cvaluees TEXT, dvalue TEXT, created_by TEXT, created_date TEXT, modified_by INTEGER, modified_date TEXT, sequence_nr INTEGER, comm TEXT, active TEXT, deleted TEXT, cvaluesw TEXT, cvalueit TEXT, cvalueind TEXT, com TEXT, comment TEXT);', []).then(() => {
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS data (id_data INTEGER PRIMARY KEY AUTOINCREMENT, data_type TEXT, data_date TEXT, data_download INTEGER, data_upload INTEGER, total_rows INTEGER);', []).then(() => {
                      this.database.executeSql('CREATE TABLE IF NOT EXISTS sv_answers_def (sv_answers_def_id INTEGER PRIMARY KEY AUTOINCREMENT, id_criteria INTEGER, range_from TEXT, range_to TEXT, seq INTEGER, value_en TEXT, value_fr TEXT, value_po TEXT, value_es TEXT, value_in TEXT, a_number INTEGER, a_cat_number REAL, media_yn INTEGER, a_list_number INTEGER, a_list_name TEXT);', []).then(() => {
                        this.database.executeSql('CREATE TABLE IF NOT EXISTS registers (id_register INTEGER PRIMARY KEY AUTOINCREMENT, regname TEXT, regcode TEXT, used_by_module TEXT, regnamede TEXT, regnamefr TEXT, regnamept TEXT, regnamees TEXT, regnamein TEXT);', []).then(() => {
                          this.database.executeSql('CREATE TABLE IF NOT EXISTS sv_results (survey_response_id INTEGER PRIMARY KEY AUTOINCREMENT, action_type_id INTEGER, question_id INTEGER, criteria_id INTEGER, project_id INTEGER, scope_id INTEGER, partner_id INTEGER, town_id INTEGER, country_id INTEGER, a_list_number TEXT, a_number TEXT, sv_answers_def_id INTEGER, created_date TEXT, id_agent INTEGER, created_by TEXT, coordx REAL, coordy REAL, accuracy REAL, comment TEXT, completed INTEGER, completed_date TEXT, issue_id INTEGER, sync_to_server INTEGER, sync_to_server_date TEXT, action_item TEXT, action_status TEXT, id_action TEXT, media NUMBER, start_timestamp TEXT, end_timestamp TEXT, date_answer TEXT, number_answer TEXT, text_answer TEXT, grade_answer TEXT, yes_no_answer TEXT, list_answer TEXT, multiple_answer TEXT, survey INTEGER, issue INTEGER, survey_unique_id INTEGER, function_id INTEGER, appearance_id INTEGER, organisation TEXT, sv_answer_type_id INTEGER);', []).then(() => {
                            this.database.executeSql('CREATE TABLE IF NOT EXISTS triggers_actions (trigger_id INTEGER, topic_id INTEGER, trigger_name_en TEXT, trigger_name_fr TEXT, trigger_name_in TEXT);', []).then(() => {
                              this.database.executeSql('CREATE TABLE IF NOT EXISTS task_scopes (scope_id INTEGER, id_project INTEGER, desc_en TEXT, desc_fr TEXT, desc_in TEXT);', []).then(() => {
                                this.database.executeSql('CREATE TABLE IF NOT EXISTS documnts(id_doc INTEGER PRIMARY KEY AUTOINCREMENT, agent_id INTEGER, survey_unique_id INTEGER, doc_type INTEGER, doc_date TEXT, filename TEXT, description TEXT, coordx REAL, coordy REAL, accuracy REAL, heading REAL, altitude REAL, cloud_path TEXT, sync INTEGER, survey_id INTEGER);', []).then(() => {
                                  this.database.executeSql('CREATE TABLE IF NOT EXISTS survey_data (data_id INTEGER PRIMARY KEY AUTOINCREMENT, id_project INTEGER, id_scope INTEGER, id_partner INTEGER, id_appearance INTEGER, id_function INTEGER, question_id INTEGER, survey_unique_id INTEGER, text_answer TEXT, town_id INTEGER, organisation TEXT);', []).then(() => {
                                    this.dbReady.next(true);

                                    this.filePermission();
                                    this.cameraPermission();
                                    this.geolocationPermission();
                                    this.createDocumentsDir();
                                    this.createSurveyDir();

                                    this.loading.hideLoader();
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    /* this.HttpClient.get('../../assets/database.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.dbReady.next(true);

            this.filePermission();
            this.cameraPermission();
            this.geolocationPermission();
            this.createDocumentsDir();

            this.loading.hideLoader();

          })
          .catch(e => { console.error(e); });
      }); */
  }


  async filePermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => console.log('Has permission?', result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    );
  }

  async cameraPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => console.log('Has permission?', result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    );
  }

  async geolocationPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => console.log('Has permission?', result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
    );
  }

  createSurveyDir() {
    this.file.checkDir(this.file.externalDataDirectory, 'icollect_survey').then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
      this.file.createDir(this.file.externalDataDirectory, 'icollect_survey', true).then(response => {
        console.log('Directory create' + response);
      }).catch(err2 => { console.log('Directory no create' + JSON.stringify(err2)); });
    });
  }

  createDocumentsDir() {
    this.file.checkDir(this.file.externalDataDirectory, 'icollect_survey/documents').then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
      this.file.createDir(this.file.externalDataDirectory, 'icollect_survey/documents', true).then(response => {
        console.log('Directory create' + response);
      }).catch(err2 => { console.log('Directory no create' + JSON.stringify(err2)); });
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  lastBackupData(): Promise<any> {
    return this.database.executeSql("SELECT id_data, data_type, data_date, data_download, data_upload FROM data WHERE data_type ='backup' AND data_upload=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        id_data: data.rows.item(0).id_data,
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        data_download: data.rows.item(0).data_download,
        data_upload: data.rows.item(0).data_upload
      }
    });
  }

  // User

  getNewId() {
    return this.database.executeSql("SELECT (id_contact*10000)+(strftime('%s','now')) As new_id FROM users", []).then(data => {
      return {
        new_id: data.rows.item(0).new_id
      }
    });
  }

  updateLang(id_contact: any, lang: any) {
    return this.database.executeSql('UPDATE users SET lang=? WHERE id_contact=?', [lang, id_contact]);
  }

  logIn(username, save_login) {
    return this.database.executeSql('UPDATE users SET log=?, save_login=? WHERE username=?', [1, save_login, username]).then(() => {
      this.loadUser(username);
    });
  }

  updateUserActive(id_contact: any, active: any, password: any, password_2: any) {
    return this.database.executeSql('UPDATE users SET active=?, password=?, password_2=? WHERE id_contact=?', [active, id_contact, password, password_2]);
  }

  logAllOut() {
    return this.database.executeSql('UPDATE users SET log=0', []);
  }

  loadUser(username): Promise<any> {
    return this.database.executeSql('SELECT * FROM users WHERE username=?', [username]).then(data => {
      if (data.rows.length == 0) {
        return { length: 0 }
      } else {
        return {
          length: data.rows.length,
          id_contact: data.rows.item(0).id_contact,
          company_name: data.rows.item(0).company_name,
          name_town: data.rows.item(0).name_town,
          id_country: data.rows.item(0).id_country,
          name_country: data.rows.item(0).name_country,
          code: data.rows.item(0).code,
          username: data.rows.item(0).username,
          password: data.rows.item(0).password,
          id_exporter: data.rows.item(0).id_exporter,
          id_buyer: data.rows.item(0).id_buyer,
          id_farmer: data.rows.item(0).id_farmer,
          id_supchain_type: data.rows.item(0).id_supchain_type,
          id_user_supchain_type: data.rows.item(0).id_user_supchain_type,
          supchain_type: data.rows.item(0).supchain_type,
          user_supchain_type: data.rows.item(0).user_supchain_type,
          id_user: data.rows.item(0).id_user,
          id_company: data.rows.item(0).id_company,
          name: data.rows.item(0).name,
          id_town: data.rows.item(0).id_town,
          idview: data.rows.item(0).idview,
          id_cooperative: data.rows.item(0).id_cooperative,
          downline: data.rows.item(0).downline,
          active: data.rows.item(0).active,
          pwd_reset: data.rows.item(0).pwd_reset,
          salt: data.rows.item(0).salt,
          contact_code: data.rows.item(0).contact_code,
          p_email3_pwd: data.rows.item(0).p_email3_pwd,
          p_email3: data.rows.item(0).p_email3,
          firstname: data.rows.item(0).firstname,
          lastname: data.rows.item(0).lastname,
          p_email: data.rows.item(0).p_email,
          p_phone: data.rows.item(0).p_phone,
          id_primary_company: data.rows.item(0).id_primary_company,
          pcompany_name: data.rows.item(0).pcompany_name,
          password_2: data.rows.item(0).password_2,
          admin: data.rows.item(0).admin,
          agent_type: data.rows.item(0).agent_type,
          log: data.rows.item(0).log,
          lang: data.rows.item(0).lang,
          save_login: data.rows.item(0).save_login
        }
      }
    });
  }

  lastLogedUser() {
    return this.database.executeSql('SELECT * FROM users WHERE log=?', [1]).then(data => {
      return {
        id_contact: data.rows.item(0).id_contact,
        company_name: data.rows.item(0).company_name,
        name_town: data.rows.item(0).name_town,
        id_country: data.rows.item(0).id_country,
        name_country: data.rows.item(0).name_country,
        code: data.rows.item(0).code,
        username: data.rows.item(0).username,
        password: data.rows.item(0).password,
        id_exporter: data.rows.item(0).id_exporter,
        id_buyer: data.rows.item(0).id_buyer,
        id_farmer: data.rows.item(0).id_farmer,
        id_supchain_type: data.rows.item(0).id_supchain_type,
        id_user_supchain_type: data.rows.item(0).id_user_supchain_type,
        supchain_type: data.rows.item(0).supchain_type,
        user_supchain_type: data.rows.item(0).user_supchain_type,
        id_user: data.rows.item(0).id_user,
        id_company: data.rows.item(0).id_company,
        name: data.rows.item(0).name,
        id_town: data.rows.item(0).id_town,
        idview: data.rows.item(0).idview,
        id_cooperative: data.rows.item(0).id_cooperative,
        downline: data.rows.item(0).downline,
        active: data.rows.item(0).active,
        pwd_reset: data.rows.item(0).pwd_reset,
        salt: data.rows.item(0).salt,
        contact_code: data.rows.item(0).contact_code,
        p_email3_pwd: data.rows.item(0).p_email3_pwd,
        p_email3: data.rows.item(0).p_email3,
        firstname: data.rows.item(0).firstname,
        lastname: data.rows.item(0).lastname,
        p_email: data.rows.item(0).p_email,
        p_phone: data.rows.item(0).p_phone,
        id_primary_company: data.rows.item(0).id_primary_company,
        pcompany_name: data.rows.item(0).pcompany_name,
        password_2: data.rows.item(0).password_2,
        admin: data.rows.item(0).admin,
        agent_type: data.rows.item(0).agent_type,
        log: data.rows.item(0).log,
        lang: data.rows.item(0).lang,
        save_login: data.rows.item(0).save_login
      }
    });
  }

  deleteUser(username) {
    return this.database.executeSql('DELETE FROM users WHERE username = ?', [username]);
  }

  restFetchUserActive(id_contact: any) {
    this.http.get('https://survey.icertification.ch/ords/m/v_security_new/?q={%22id_contact%22:%22' + id_contact + '%22}', {}, {}).then(data => {
      let raw_data = JSON.parse(data.data);
      let raw = raw_data.items;
      this.updateUserActive(id_contact, raw[0].active, raw[0].password, raw[0].password_2);
    }); 
  }

  async restFetchUser(username, save_login_checked, lang): Promise<any> {
    return new Promise((resolve, reject) => {
      var v_security_new = 'https://survey.icertification.ch/ords/m/v_security_new/?q={%22username%22:%22' + username + '%22}';

      this.http.get(v_security_new, {}, {}).then(data => {
        let raw_data = JSON.parse(data.data);
        let raw = raw_data.items;

        if (raw.length == 0) {
          this.translate.get('INCORRECT_USERNAME').subscribe(
            value => { this.presentAlert(value, 'Error'); }
          );

          reject();

        } else {

          if(raw[0].active == 0) {
            this.translate.get('ACCOUNT_NOT_ACTIF').subscribe(
              value => { this.presentAlert(value, 'Error'); }
            );

            reject();

          } else {
            var save_login = 0;
            let id_contact = raw[0].id_contact;
            let company_name = raw[0].company_name;
            let name_town = raw[0].name_town;
            let id_country = raw[0].id_country;
            let name_country = raw[0].name_country;
            let code = raw[0].code;
            let username = raw[0].username;
            let password = raw[0].password;
            let id_exporter = raw[0].id_exporter;
            let id_buyer = raw[0].id_buyer;
            let id_farmer = raw[0].id_farmer;
            let id_supchain_type = raw[0].id_supchain_type;
            let id_user_supchain_type = raw[0].id_user_supchain_type;
            let supchain_type = raw[0].supchain_type;
            let user_supchain_type = raw[0].user_supchain_type;
            let id_user = raw[0].id_user;
            let id_company = raw[0].id_company;
            let name = raw[0].name;
            let id_town = raw[0].id_town;
            let idview = raw[0].idview;
            let id_cooperative = raw[0].id_cooperative;
            let downline = raw[0].downline;
            let active = raw[0].active;
            let pwd_reset = raw[0].pwd_reset;
            let salt = raw[0].salt;
            let contact_code = raw[0].contact_code;
            let p_email3_pwd = raw[0].p_email3_pwd;
            let p_email3 = raw[0].p_email3;
            let firstname = raw[0].firstname;
            let lastname = raw[0].lastname;
            let p_email = raw[0].p_email;
            let p_phone = raw[0].p_phone;
            let id_primary_company = raw[0].id_primary_company;
            let pcompany_name = raw[0].pcompany_name;
            let password_2 = raw[0].password_2;
            let admin = raw[0].admin;
            let agent_type = raw[0].agent_type;
            let log = 1;
  
            if (save_login_checked == true) { save_login = 1; }
  
            this.addUser(id_contact, company_name, name_town, id_country, name_country, code, username, password, id_exporter, id_buyer, id_farmer, id_supchain_type, id_user_supchain_type, supchain_type, user_supchain_type, id_user, id_company, name, id_town, idview, id_cooperative, downline, active, pwd_reset, salt, contact_code, p_email3_pwd, p_email3, firstname, lastname, p_email, p_phone, id_primary_company, pcompany_name, password_2, admin, agent_type, log, lang, save_login);
  
            var m = new Date();
            let timestamp = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);
            this.addData('user', timestamp, 1, null, raw.lenth);
  
            resolve(true);
          }

        }

      }).catch(error => {
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

        reject();
      });

    });
  }

  addUser(id_contact, company_name, name_town, id_country, name_country, code, username, password, id_exporter, id_buyer, id_farmer, id_supchain_type, id_user_supchain_type, supchain_type, user_supchain_type, id_user, id_company, name, id_town, idview, id_cooperative, downline, active, pwd_reset, salt, contact_code, p_email3_pwd, p_email3, firstname, lastname, p_email, p_phone, id_primary_company, pcompany_name, password_2, admin, agent_type, log, lang, save_login) {
    let data = [id_contact, company_name, name_town, id_country, name_country, code, username, password, id_exporter, id_buyer, id_farmer, id_supchain_type, id_user_supchain_type, supchain_type, user_supchain_type, id_user, id_company, name, id_town, idview, id_cooperative, downline, active, pwd_reset, salt, contact_code, p_email3_pwd, p_email3, firstname, lastname, p_email, p_phone, id_primary_company, pcompany_name, password_2, admin, agent_type, log, lang, save_login];
    return this.database.executeSql('INSERT INTO users (id_contact, company_name, name_town, id_country, name_country, code, username, password, id_exporter, id_buyer, id_farmer, id_supchain_type, id_user_supchain_type, supchain_type, user_supchain_type, id_user, id_company, name, id_town, idview, id_cooperative, downline, active, pwd_reset, salt, contact_code, p_email3_pwd, p_email3, firstname, lastname, p_email, p_phone, id_primary_company, pcompany_name, password_2, admin, agent_type, log, lang, save_login) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(val => {
      this.loadUser(username);
    });
  }

  getLastLanguage() {
    return this.database.executeSql('SELECT lang FROM users ORDER BY id_contact DESC LIMIT 1',[]).then(data => {
      return {
        lang: data.rows.item(0).lang
      }
    });
  }

  // Docs

  addData(data_type, data_date, data_download, data_upload, total_rows) {
    let data = [data_type, data_date, data_download, data_upload, total_rows];
    return this.database.executeSql('INSERT INTO data (data_type, data_date, data_download, data_upload, total_rows) VALUES (?, ?, ?, ?, ?)', data);
  }

  clearData() {
    this.database.executeSql('DELETE FROM data WHERE id_data != 1', []);
  }

  clearTaskDeploymentData() {
    this.database.executeSql("DELETE FROM data WHERE id_data != 1 AND data_type = 'project_task' OR data_type = 'agent_deployment' OR data_type = 'scope_partner'", []);
  }

  // Projects

  getProjects(): Observable<any[]> {
    return this.projects.asObservable();
  }

  loadProjects(id_country) {
    return this.database.executeSql('SELECT * FROM projects WHERE country_id=?', [id_country]).then(data => {
      let projectList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          projectList.push({
            id_project: data.rows.item(i).id_project,
            id_language: data.rows.item(i).id_language,
            id_user: data.rows.item(i).id_user,
            username: data.rows.item(i).username,
            project_name: data.rows.item(i).project_name,
            project_type: data.rows.item(i).project_type,
            start_date: data.rows.item(i).start_date,
            due_date: data.rows.item(i).due_date,
            end_date: data.rows.item(i).end_date,
            project_status: data.rows.item(i).project_status,
            project_private: data.rows.item(i).project_private,
            id_company: data.rows.item(i).id_company,
            id_culture: data.rows.item(i).id_culture,
            ord_order_id: data.rows.item(i).ord_order_id,
            country_id: data.rows.item(i).country_id,
            region_id: data.rows.item(i).region_id,
            region_quadrant: data.rows.item(i).region_quadrant,
            region_tile_status: data.rows.item(i).region_tile_status,
            region_tiles_by: data.rows.item(i).region_tiles_by,
            region_tiles: data.rows.item(i).region_tiles,
            region_tile_server: data.rows.item(i).region_tile_server,
            project_mgr_id: data.rows.item(i).project_mgr_id,
            project_mgr_name: data.rows.item(i).project_mgr_name,
            project_mgr_company_id: data.rows.item(i).project_mgr_company_id,
            id_country: data.rows.item(i).id_country,
            region_name: data.rows.item(i).region_name,
            creation_date: data.rows.item(i).creation_date,
            modify_by: data.rows.item(i).modify_by,
            modified_date: data.rows.item(i).modified_date,
            cooperative_id: data.rows.item(i).cooperative_id,
            zone_color: data.rows.item(i).zone_color,
            country_mgr_id: data.rows.item(i).country_mgr_id,
            language_id: data.rows.item(i).language_id,
            year_period: data.rows.item(i).year_period,
            certification_id: data.rows.item(i).certification_id,
            task_type: data.rows.item(i).task_type,
            task_status: data.rows.item(i).task_status,
            project_active: data.rows.item(i).project_active,
            approved_date: data.rows.item(i).approved_date,
            approved_by: data.rows.item(i).approved_by,
            period: data.rows.item(i).period,
            topic_id: data.rows.item(i).topic_id
          });
        }
      }

      this.projects.next(projectList);
    });
  }

  loadProject(id_country) {
    return this.database.executeSql('SELECT * FROM projects WHERE country_id=? LIMIT 1', [id_country]).then(data => {
      return {
        id_project: data.rows.item(0).id_project,
        id_language: data.rows.item(0).id_language,
        id_user: data.rows.item(0).id_user,
        username: data.rows.item(0).username,
        project_name: data.rows.item(0).project_name,
        project_type: data.rows.item(0).project_type,
        start_date: data.rows.item(0).start_date,
        due_date: data.rows.item(0).due_date,
        end_date: data.rows.item(0).end_date,
        project_status: data.rows.item(0).project_status,
        project_private: data.rows.item(0).project_private,
        id_company: data.rows.item(0).id_company,
        id_culture: data.rows.item(0).id_culture,
        ord_order_id: data.rows.item(0).ord_order_id,
        country_id: data.rows.item(0).country_id,
        region_id: data.rows.item(0).region_id,
        region_quadrant: data.rows.item(0).region_quadrant,
        region_tile_status: data.rows.item(0).region_tile_status,
        region_tiles_by: data.rows.item(0).region_tiles_by,
        region_tiles: data.rows.item(0).region_tiles,
        region_tile_server: data.rows.item(0).region_tile_server,
        project_mgr_id: data.rows.item(0).project_mgr_id,
        project_mgr_name: data.rows.item(0).project_mgr_name,
        project_mgr_company_id: data.rows.item(0).project_mgr_company_id,
        id_country: data.rows.item(0).id_country,
        region_name: data.rows.item(0).region_name,
        creation_date: data.rows.item(0).creation_date,
        modify_by: data.rows.item(0).modify_by,
        modified_date: data.rows.item(0).modified_date,
        cooperative_id: data.rows.item(0).cooperative_id,
        zone_color: data.rows.item(0).zone_color,
        country_mgr_id: data.rows.item(0).country_mgr_id,
        language_id: data.rows.item(0).language_id,
        year_period: data.rows.item(0).year_period,
        certification_id: data.rows.item(0).certification_id,
        task_type: data.rows.item(0).task_type,
        task_status: data.rows.item(0).task_status,
        project_active: data.rows.item(0).project_active,
        approved_date: data.rows.item(0).approved_date,
        approved_by: data.rows.item(0).approved_by,
        period: data.rows.item(0).period,
        topic_id: data.rows.item(0).topic_id
      }
    });
  }

  getProject(id_project) {
    return this.database.executeSql('SELECT * FROM projects WHERE id_project=?', [id_project]).then(data => {
      return {
        id_project: data.rows.item(0).id_project,
        id_language: data.rows.item(0).id_language,
        id_user: data.rows.item(0).id_user,
        username: data.rows.item(0).username,
        project_name: data.rows.item(0).project_name,
        project_type: data.rows.item(0).project_type,
        start_date: data.rows.item(0).start_date,
        due_date: data.rows.item(0).due_date,
        end_date: data.rows.item(0).end_date,
        project_status: data.rows.item(0).project_status,
        project_private: data.rows.item(0).project_private,
        id_company: data.rows.item(0).id_company,
        id_culture: data.rows.item(0).id_culture,
        ord_order_id: data.rows.item(0).ord_order_id,
        country_id: data.rows.item(0).country_id,
        region_id: data.rows.item(0).region_id,
        region_quadrant: data.rows.item(0).region_quadrant,
        region_tile_status: data.rows.item(0).region_tile_status,
        region_tiles_by: data.rows.item(0).region_tiles_by,
        region_tiles: data.rows.item(0).region_tiles,
        region_tile_server: data.rows.item(0).region_tile_server,
        project_mgr_id: data.rows.item(0).project_mgr_id,
        project_mgr_name: data.rows.item(0).project_mgr_name,
        project_mgr_company_id: data.rows.item(0).project_mgr_company_id,
        id_country: data.rows.item(0).id_country,
        region_name: data.rows.item(0).region_name,
        creation_date: data.rows.item(0).creation_date,
        modify_by: data.rows.item(0).modify_by,
        modified_date: data.rows.item(0).modified_date,
        cooperative_id: data.rows.item(0).cooperative_id,
        zone_color: data.rows.item(0).zone_color,
        country_mgr_id: data.rows.item(0).country_mgr_id,
        language_id: data.rows.item(0).language_id,
        year_period: data.rows.item(0).year_period,
        certification_id: data.rows.item(0).certification_id,
        task_type: data.rows.item(0).task_type,
        task_status: data.rows.item(0).task_status,
        project_active: data.rows.item(0).project_active,
        approved_date: data.rows.item(0).approved_date,
        approved_by: data.rows.item(0).approved_by,
        period: data.rows.item(0).period,
        topic_id: data.rows.item(0).topic_id
      }
    });
  }

  restFetchProjectsLenth(id_country, id_language) {
    let link = 'https://survey.icertification.ch/ords/m/v_project/?q={"id_country":"' + id_country + '","project_status":"230"}';

    return this.http.get(link, {}, {}).then(data => {
      let raw_data = JSON.parse(data.data);
      let raw = raw_data.items;

      let lenth: number = raw.length;
      return lenth;
    });
  }

  deleteProjects() {
    return this.database.executeSql('DELETE FROM projects', []);
  }

  addProject(id_project, id_language, id_user, username, project_name, project_type, start_date, due_date, end_date, project_status, project_private, id_company, id_culture, ord_order_id, country_id, region_id, region_quadrant, region_tile_status, region_tiles_by, region_tiles, region_tile_server, project_mgr_id, project_mgr_name, project_mgr_company_id, id_country, region_name, creation_date, modify_by, modified_date, cooperative_id, zone_color, country_mgr_id, language_id, year_period, certification_id, task_type, task_status, project_active, approved_date, approved_by, period, topic_id) {
    let data = [id_project, id_language, id_user, username, project_name, project_type, start_date, due_date, end_date, project_status, project_private, id_company, id_culture, ord_order_id, country_id, region_id, region_quadrant, region_tile_status, region_tiles_by, region_tiles, region_tile_server, project_mgr_id, project_mgr_name, project_mgr_company_id, id_country, region_name, creation_date, modify_by, modified_date, cooperative_id, zone_color, country_mgr_id, language_id, year_period, certification_id, task_type, task_status, project_active, approved_date, approved_by, period, topic_id];
    return this.database.executeSql('INSERT INTO projects (id_project, id_language, id_user, username, project_name, project_type, start_date, due_date, end_date, project_status, project_private, id_company, id_culture, ord_order_id, country_id, region_id, region_quadrant, region_tile_status, region_tiles_by, region_tiles, region_tile_server, project_mgr_id, project_mgr_name, project_mgr_company_id, id_country, region_name, creation_date, modify_by, modified_date, cooperative_id, zone_color, country_mgr_id, language_id, year_period, certification_id, task_type, task_status, project_active, approved_date, approved_by, period, topic_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
  }

  countProject(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM projects', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadProjectData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='projects' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  // SV Results

  addResult(survey_response_id, action_type_id, question_id, criteria_id, project_id, scope_id, partner_id, town_id, country_id, a_list_number, a_number, sv_answers_def_id, created_date, id_agent, created_by, coordx, coordy, accuracy, comment, completed, completed_date, issue_id, sync_to_server, sync_to_server_date, action_item, action_status, id_action, start_timestamp, end_timestamp, date_answer, number_answer, text_answer, grade_answer, yes_no_answer, list_answer, multiple_answer, survey, issue, survey_unique_id, function_id, appearance_id, organisation, sv_answer_type_id) {
    let data = [survey_response_id, action_type_id, question_id, criteria_id, project_id, scope_id, partner_id, town_id, country_id, a_list_number, a_number, sv_answers_def_id, created_date, id_agent, created_by, coordx, coordy, accuracy, comment, completed, completed_date, issue_id, sync_to_server, sync_to_server_date, action_item, action_status, id_action, start_timestamp, end_timestamp, date_answer, number_answer, text_answer, grade_answer, yes_no_answer, list_answer, multiple_answer, survey, issue, survey_unique_id, function_id, appearance_id, organisation, sv_answer_type_id];
    return this.database.executeSql('INSERT INTO sv_results (survey_response_id, action_type_id, question_id, criteria_id, project_id, scope_id, partner_id, town_id, country_id, a_list_number, a_number, sv_answers_def_id, created_date, id_agent, created_by, coordx, coordy, accuracy, comment, completed, completed_date, issue_id, sync_to_server, sync_to_server_date, action_item, action_status, id_action, start_timestamp, end_timestamp, date_answer, number_answer, text_answer, grade_answer, yes_no_answer, list_answer, multiple_answer, survey, issue, survey_unique_id, function_id, appearance_id, organisation, sv_answer_type_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
  }

  // Project Task

  restFetchProjectTasksLenth(id_country, id_project) {
    let link = 'https://survey.icertification.ch/ords/m/v_project_task/?limit=10000&q={"country_id":"' + id_country + '","id_project":"' + id_project + '"}';

    return this.http.get(link, {}, {}).then(data => {
      let raw_data = JSON.parse(data.data);
      let raw = raw_data.items;

      let lenth: number = raw.length;
      return lenth;
    });
  }

  deleteProjectTasks() {
    return this.database.executeSql('DELETE FROM project_task', []);
  }

  deleteProjectTasksProject(id_project: any) {
    return this.database.executeSql('DELETE FROM project_task WHERE id_project = ?', [id_project]);
  }

  addProjectTask(id_task, survey_id, scope_id, scope_name, id_criteria, topic_id, topic_name, desc_en, desc_fr, desc_in, criteria_level, media_yn, sv_answer_type_id, civ1, gh, in1, typedesc, range_to, range_from, answerlist_id, sequence, id_project) {
    let data = [id_task, survey_id, scope_id, scope_name, id_criteria, topic_id, topic_name, desc_en, desc_fr, desc_in, criteria_level, media_yn, sv_answer_type_id, civ1, gh, in1, typedesc, range_to, range_from, answerlist_id, sequence, id_project];
    return this.database.executeSql('INSERT INTO project_task (id_task, survey_id, scope_id, scope_name, id_criteria, topic_id, topic_name, desc_en, desc_fr, desc_in, criteria_level, media_yn, sv_answer_type_id, civ1, gh, in1, typedesc, range_to, range_from, answerlist_id, sequence, id_project) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
  }

  countProjectTasks(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM project_task', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  countIdProjectTasks(id_project: any): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM project_task WHERE id_project = ?', [id_project]).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadProjectTasksData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='project_task' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  getFirstProjectTask(scope_id: any) {
    return this.database.executeSql('SELECT id_task, sequence FROM project_task WHERE scope_id=? ORDER BY sequence ASC LIMIT 1', [scope_id]).then(data => {
      return {
        id_task: data.rows.item(0).id_task,
        sequence: data.rows.item(0).sequence
      }
    });
  }

  getProjectTask(scope_id: any, sequence: any) {
    return this.database.executeSql('SELECT * FROM project_task WHERE scope_id=? AND sequence=?', [scope_id, sequence]).then(data => {
      return {
        id_task: data.rows.item(0).id_task,
        survey_id: data.rows.item(0).survey_id,
        scope_id: data.rows.item(0).scope_id,
        scope_name: data.rows.item(0).scope_name,
        id_criteria: data.rows.item(0).id_criteria,
        topic_id: data.rows.item(0).topic_id,
        topic_name: data.rows.item(0).topic_name,
        desc_en: data.rows.item(0).desc_en,
        desc_fr: data.rows.item(0).desc_fr,
        desc_in: data.rows.item(0).desc_in,
        criteria_level: data.rows.item(0).criteria_level,
        media_yn: data.rows.item(0).media_yn,
        sv_answer_type_id: data.rows.item(0).sv_answer_type_id,
        civ1: data.rows.item(0).civ1,
        gh: data.rows.item(0).gh,
        in1: data.rows.item(0).in1,
        typedesc: data.rows.item(0).typedesc,
        range_to: data.rows.item(0).range_to,
        range_from: data.rows.item(0).range_from,
        answerlist_id: data.rows.item(0).answerlist_id,
        sequence: data.rows.item(0).sequence
      }
    });
  }

  countQuestions(scope_id: any) {
    return this.database.executeSql('SELECT COUNT(*) AS tt_question FROM project_task WHERE scope_id=?', [scope_id]).then(data => {
      return {
        total: data.rows.item(0).tt_question
      }
    });
  }



  getProjectTaskList(): Observable<any[]> {
    return this.project_task.asObservable();
  }

  getAllProjectTask(scope_id: any) {
    return this.database.executeSql('SELECT project_task.id_task, project_task.survey_id, project_task.scope_id, project_task.id_criteria, project_task.sequence, project_task.sv_answer_type_id, project_task.media_yn, project_task.answerlist_id, project_task.desc_in, project_task.desc_fr, project_task.desc_en, sv_results.text_answer FROM project_task LEFT JOIN sv_results ON project_task.id_task = sv_results.question_id WHERE project_task.scope_id=? ORDER BY project_task.sequence ', [scope_id]).then(data => {

      let project_taskList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var question;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              question = data.rows.item(i).desc_en;
            } else
              if (value == 'fr') {
                question = data.rows.item(i).desc_fr;
              } else {
                question = data.rows.item(i).desc_in;
              }
          });

          project_taskList.push({
            id_task: data.rows.item(i).id_task,
            survey_id: data.rows.item(i).survey_id,
            id_criteria: data.rows.item(i).id_criteria,
            scope_id: data.rows.item(i).scope_id,
            sequence: data.rows.item(i).sequence,
            sv_answer_type_id: data.rows.item(i).sv_answer_type_id,
            media_yn: data.rows.item(i).media_yn,
            answerlist_id: data.rows.item(i).answerlist_id,
            text_answer: data.rows.item(i).text_answer,
            question: question
          });
        }
      }

      this.project_task.next(project_taskList);
    });
  }

  // Answers

  restFetchAnswersLenth() {
    let link = 'https://survey.icertification.ch/ords/m/v_sv_answers_def/?limit=1000';

    return this.http.get(link, {}, {}).then(data => {
      let raw_data = JSON.parse(data.data);
      let raw = raw_data.items;

      let lenth: number = raw.length;
      return lenth;
    });
  }

  deleteAnswers() {
    return this.database.executeSql('DELETE FROM sv_answers_def', []);
  }

  addAnswers(sv_answers_def_id, id_criteria, range_from, range_to, seq, value_en, value_fr, value_po, value_es, value_in, a_number, a_cat_number, media_yn, a_list_number, a_list_name) {
    let data = [sv_answers_def_id, id_criteria, range_from, range_to, seq, value_en, value_fr, value_po, value_es, value_in, a_number, a_cat_number, media_yn, a_list_number, a_list_name];
    return this.database.executeSql('INSERT INTO sv_answers_def (sv_answers_def_id, id_criteria, range_from, range_to, seq, value_en, value_fr, value_po, value_es, value_in, a_number, a_cat_number, media_yn, a_list_number, a_list_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
  }

  countAnswers(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM sv_answers_def', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadAnswersData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='sv_answers_def' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  getAnswers(): Observable<any[]> {
    return this.answers.asObservable();
  }

  getAnswer(sv_answers_def_id) {
    return this.database.executeSql('SELECT * FROM sv_answers_def WHERE sv_answers_def_id = ?', [sv_answers_def_id]).then(data => {

      var answer;
      this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
        if (value == 'en') {
          answer = data.rows.item(0).value_en;
        } else
          if (value == 'fr') {
            answer = data.rows.item(0).value_fr;
          } else {
            answer = data.rows.item(0).value_in;
          }
      });

      return {
        sv_answers_def_id: data.rows.item(0).sv_answers_def_id,
        id_criteria: data.rows.item(0).id_criteria,
        range_from: data.rows.item(0).range_from,
        range_to: data.rows.item(0).range_to,
        seq: data.rows.item(0).seq,
        value_en: data.rows.item(0).value_en,
        value_fr: data.rows.item(0).value_fr,
        value_po: data.rows.item(0).value_po,
        value_es: data.rows.item(0).value_es,
        value_in: data.rows.item(0).value_in,
        a_number: data.rows.item(0).a_number,
        a_cat_number: data.rows.item(0).a_cat_number,
        media_yn: data.rows.item(0).media_yn,
        a_list_number: data.rows.item(0).a_list_number,
        a_list_name: data.rows.item(0).a_list_name,
        answer: answer
      }
    });
  }

  loadAnswers(id_criteria) {
    return this.database.executeSql('SELECT * FROM sv_answers_def WHERE id_criteria=? ORDER BY seq DESC', [id_criteria]).then(data => {
      let answersList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var answer;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              answer = data.rows.item(i).value_en;
            } else
              if (value == 'fr') {
                answer = data.rows.item(i).value_fr;
              } else {
                answer = data.rows.item(i).value_in;
              }
          });

          answersList.push({
            sv_answers_def_id: data.rows.item(i).sv_answers_def_id,
            id_criteria: data.rows.item(i).id_criteria,
            range_from: data.rows.item(i).range_from,
            range_to: data.rows.item(i).range_to,
            seq: data.rows.item(i).seq,
            value_en: data.rows.item(i).value_en,
            value_fr: data.rows.item(i).value_fr,
            value_po: data.rows.item(i).value_po,
            value_es: data.rows.item(i).value_es,
            value_in: data.rows.item(i).value_in,
            a_number: data.rows.item(i).a_number,
            a_cat_number: data.rows.item(i).a_cat_number,
            media_yn: data.rows.item(i).media_yn,
            a_list_number: data.rows.item(i).a_list_number,
            a_list_name: data.rows.item(i).a_list_name,
            answer: answer
          });
        }
      }

      this.answers.next(answersList);
    });
  }

  // Agent Deployement

  restFetchAgentDeploymentLenth(id_country: any, admin: any, id_project: any) {
    let link = 'https://survey.icertification.ch/ords/m/v_agent_deployment/?limit=10000&q={"id_country":"' + id_country + '","id_group":"' + admin + '","id_project":"' + id_project + '"}';

    return this.http.get(link, {}, {}).then(data => {
      let raw_data = JSON.parse(data.data);
      let raw = raw_data.items;

      let lenth: number = raw.length;
      return lenth;
    });
  }

  deleteAgentDeployment() {
    return this.database.executeSql('DELETE FROM agent_deployment', []);
  }

  deleteAgentDeploymentProject(id_project: any) {
    return this.database.executeSql('DELETE FROM agent_deployment WHERE id_project = ?', [id_project]);
  }

  addAgentDeployment(id_agent_deployment, id_town, name_town, id_country, name_country, code_town, region1, region2, region3, region4, id_external, id_project, project_name, id_group, group_name, id_agent, agent_name, agent_or_group, aog_name) {
    let data = [id_agent_deployment, id_town, name_town, id_country, name_country, code_town, region1, region2, region3, region4, id_external, id_project, project_name, id_group, group_name, id_agent, agent_name, agent_or_group, aog_name];
    return this.database.executeSql('INSERT INTO agent_deployment (id_agent_deployment, id_town, name_town, id_country, name_country, code_town, region1, region2, region3, region4, id_external, id_project, project_name, id_group, group_name, id_agent, agent_name, agent_or_group, aog_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
  }

  countAgentDeployment(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM agent_deployment', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadAgentDeploymentData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='agent_deployment' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  // Triggers Actions

  getTriggers(): Observable<any[]> {
    return this.triggers_actions.asObservable();
  }

  loadTriggers() {
    return this.database.executeSql('SELECT * FROM triggers_actions ORDER BY trigger_name_en', []).then(data => {
      let triggersList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var trigger_name;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              trigger_name = data.rows.item(i).trigger_name_en;
            } else
              if (value == 'fr') {
                trigger_name = data.rows.item(i).trigger_name_fr;
              } else {
                trigger_name = data.rows.item(i).trigger_name_in;
              }
          });

          triggersList.push({
            trigger_id: data.rows.item(i).trigger_id,
            topic_id: data.rows.item(i).topic_id,
            trigger_name_en: data.rows.item(i).trigger_name_en,
            trigger_name_fr: data.rows.item(i).trigger_name_fr,
            trigger_name_in: data.rows.item(i).trigger_name_in,
            trigger_name: trigger_name
          });
        }
      }

      this.triggers_actions.next(triggersList);
    });
  }

  restFetchTriggersLenth() {
    let link = 'https://survey.icertification.ch/ords/m/v_triggers_actions/?limit=1000';

    return this.http.get(link, {}, {}).then(data => {
      let raw_data = JSON.parse(data.data);
      let raw = raw_data.items;

      let lenth: number = raw.length;
      return lenth;
    });
  }

  deleteTriggers() {
    return this.database.executeSql('DELETE FROM triggers_actions', []);
  }

  addTriggers(trigger_id, topic_id, trigger_name_en, trigger_name_fr, trigger_name_in) {
    let data = [trigger_id, topic_id, trigger_name_en, trigger_name_fr, trigger_name_in];
    return this.database.executeSql('INSERT INTO triggers_actions (trigger_id, topic_id, trigger_name_en, trigger_name_fr, trigger_name_in) VALUES (?, ?, ?, ?, ?)', data);
  }

  countTriggers(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM triggers_actions', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadTriggersData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='triggers_actions' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  // Towns

  getRegions(): Observable<any[]> {
    return this.regions.asObservable();
  }

  loadRegions() {
    return this.database.executeSql('SELECT DISTINCT region1 FROM towns ORDER BY region1', []).then(data => {
      let regionList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          regionList.push({
            region1: data.rows.item(i).region1
          });
        }
      }

      this.regions.next(regionList);
    });
  }

  getRegions2(): Observable<any[]> {
    return this.regions2.asObservable();
  }

  loadRegions2(region1) {
    return this.database.executeSql('SELECT DISTINCT region2 FROM towns WHERE region1 = ? ORDER BY region2', [region1]).then(data => {
      let regionList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          regionList.push({
            region2: data.rows.item(i).region2
          });
        }
      }

      this.regions2.next(regionList);
    });
  }

  getRegions3(): Observable<any[]> {
    return this.regions3.asObservable();
  }

  loadRegions3(region2) {
    return this.database.executeSql('SELECT DISTINCT region3 FROM towns WHERE region2 = ? ORDER BY region3', [region2]).then(data => {
      let regionList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          regionList.push({
            region3: data.rows.item(i).region3
          });
        }
      }

      this.regions3.next(regionList);
    });
  }

  getRegions4(): Observable<any[]> {
    return this.regions4.asObservable();
  }

  loadRegions4(region3) {
    return this.database.executeSql('SELECT DISTINCT name_town, code_town, gid_town FROM towns WHERE region3 = ? ORDER BY name_town', [region3]).then(data => {
      let regionList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          regionList.push({
            gid_town: data.rows.item(i).gid_town,
            code_town: data.rows.item(i).code_town,
            name_town: data.rows.item(i).name_town
          });
        }
      }

      this.regions4.next(regionList);
    });
  }

  getTowns(): Observable<any[]> {
    return this.towns.asObservable();
  }

  loadTowns() {
    /* return this.database.executeSql('SELECT DISTINCT name_town, region1, region2, region3, region4, code_town, gid_town FROM towns ORDER BY name_town', []).then(data => {
      let regionList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          regionList.push({
            gid_town: data.rows.item(i).gid_town,
            code_town: data.rows.item(i).code_town,
            name_town: data.rows.item(i).name_town,
            region1: data.rows.item(i).region1,
            region2: data.rows.item(i).region2,
            region3: data.rows.item(i).region3,
            region4: data.rows.item(i).region4
          });
        }
      }

      this.towns.next(regionList);
    }); */

    return this.database.executeSql('SELECT id_town, name_town, code_town FROM agent_deployment ORDER BY name_town', []).then(data => {
      let regionList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          regionList.push({
            gid_town: data.rows.item(i).id_town,
            code_town: data.rows.item(i).code_town,
            name_town: data.rows.item(i).name_town
          });
        }
      }

      this.towns.next(regionList);
    });
  }

  restFetchTownsLenth(id_country) {
    let link = 'https://survey.icertification.ch/ords/m/v_towns/?limit=10000&q={"id_country":"' + id_country + '"}';

    return this.http.get(link, {}, {}).then(data => {
      let raw_data = JSON.parse(data.data);
      let raw = raw_data.items;

      let lenth: number = raw.length;
      return lenth;
    });
  }

  deleteTowns() {
    return this.database.executeSql('DELETE FROM towns', []);
  }

  addTowns(gid_town, name_town, name_country, x, y, id_country, timezone, population, photo_link, description_en, description_fr, description_de, description_pt, description_es, code_town, region1, region2, region3, region4, iso, language, postcode, suburb, utc, dst, timezone1, id_town, old_id, zone, region2_id, id_code, exporter_id, inter_ngo_id, local_ngo_id, id_external, exporter, intngo, localngo) {
    let data = [gid_town, name_town, name_country, x, y, id_country, timezone, population, photo_link, description_en, description_fr, description_de, description_pt, description_es, code_town, region1, region2, region3, region4, iso, language, postcode, suburb, utc, dst, timezone1, id_town, old_id, zone, region2_id, id_code, exporter_id, inter_ngo_id, local_ngo_id, id_external, exporter, intngo, localngo];
    return this.database.executeSql('INSERT INTO towns (gid_town, name_town, name_country, x, y, id_country, timezone, population, photo_link, description_en, description_fr, description_de, description_pt, description_es, code_town, region1, region2, region3, region4, iso, language, postcode, suburb, utc, dst, timezone1, id_town, old_id, zone, region2_id, id_code, exporter_id, inter_ngo_id, local_ngo_id, id_external, exporter, intngo, localngo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
  }

  countTowns() {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM towns', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadTownsData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='towns' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  getTown(gid_town) {
    return this.database.executeSql('SELECT gid_town, name_town FROM towns WHERE gid_town = ?', [gid_town]).then(data => {
      return {
        gid_town: data.rows.item(0).gid_town,
        name_town: data.rows.item(0).name_town
      }
    });
  }

  // Certifications

  restFetchCertificationsLenth() {
    let link = 'https://survey.icertification.ch/ords/m/v_certification_action/?limit=1000&q={%22action_type_id%22:%221007%22}';

    return this.http.get(link, {}, {}).then(data => {
      let raw_data = JSON.parse(data.data);
      let raw = raw_data.items;

      let lenth: number = raw.length;
      return lenth;
    });
  }

  deleteCertifications() {
    return this.database.executeSql('DELETE FROM certification_action', []);
  }

  addCertifications(topic_id, topic_name, desc_en, desc_fr, desc_in, action_type_id, action_type_name, function_id, function_name, action_code, trigger_id, trigger_name, trigger_regvalue, trigger_regvalue_name, trigger_table, trigger_table_name, trigger_text, status, status_name) {
    let data = [topic_id, topic_name, desc_en, desc_fr, desc_in, action_type_id, action_type_name, function_id, function_name, action_code, trigger_id, trigger_name, trigger_regvalue, trigger_regvalue_name, trigger_table, trigger_table_name, trigger_text, status, status_name];
    return this.database.executeSql('INSERT INTO certification_action (topic_id, topic_name, desc_en, desc_fr, desc_in, action_type_id, action_type_name, function_id, function_name, action_code, trigger_id, trigger_name, trigger_regvalue, trigger_regvalue_name, trigger_table, trigger_table_name, trigger_text, status, status_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
  }

  countCertifications(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM certification_action', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadCertificationsData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='certification_action' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  // Scope  

  restFetchTaskScopesLenth() {
    let link = 'https://survey.icertification.ch/ords/m/v_task_scopes/?limit=1000';

    return this.http.get(link, {}, {}).then(data => {
      let raw_data = JSON.parse(data.data);
      let raw = raw_data.items;

      let lenth: number = raw.length;
      return lenth;
    });
  }

  deleteTaskScopes() {
    return this.database.executeSql('DELETE FROM task_scopes', []);
  }

  addTaskScopes(scope_id, id_project, desc_en, desc_fr, desc_in) {
    let data = [scope_id, id_project, desc_en, desc_fr, desc_in];
    return this.database.executeSql('INSERT INTO task_scopes (scope_id, id_project, desc_en, desc_fr, desc_in) VALUES (?, ?, ?, ?, ?)', data);
  }

  countTaskScopes(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM task_scopes', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadTaskScopesData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='task_scopes' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  // Scope Partner

  restFetchScopesLenth(id_country: any, id_project: any) {
    let link = 'https://survey.icertification.ch/ords/m/v_scope_partner/?limit=1000&q={"id_country":"' + id_country + '","id_project":"' + id_project + '"}';

    return this.http.get(link, {}, {}).then(data => {
      let raw_data = JSON.parse(data.data);
      let raw = raw_data.items;

      let lenth: number = raw.length;
      return lenth;
    });
  }

  deleteScopes() {
    return this.database.executeSql('DELETE FROM scope_partner', []);
  }

  deleteScopesProject(id_project: any) {
    return this.database.executeSql('DELETE FROM scope_partner WHERE id_project = ?', [id_project]);
  }

  addScopes(id_scope_partner, id_scope, scope_en, scope_fr, scope_in, id_contact, contact_name, contact_code, id_country, name_country, id_project, name_project) {
    let data = [id_scope_partner, id_scope, scope_en, scope_fr, scope_in, id_contact, contact_name, contact_code, id_country, name_country, id_project, name_project];
    return this.database.executeSql('INSERT INTO scope_partner (id_scope_partner, id_scope, scope_en, scope_fr, scope_in, id_contact, contact_name, contact_code, id_country, name_country, id_project, name_project) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
  }

  countScopes(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM scope_partner', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadScopesData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='scope_partner' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  // Registers

  restFetchRegistersLenth() {
    let link = 'https://survey.icertification.ch/ords/m/v_registers/?limit=1000';

    return this.http.get(link, {}, {}).then(data => {
      let raw_data = JSON.parse(data.data);
      let raw = raw_data.items;

      let lenth: number = raw.length;
      return lenth;
    });
  }

  deleteRegisters() {
    return this.database.executeSql('DELETE FROM registers', []);
  }

  addRegisters(id_register, regname, regcode, used_by_module, regnamede, regnamefr, regnamept, regnamees, regnamein) {
    let data = [id_register, regname, regcode, used_by_module, regnamede, regnamefr, regnamept, regnamees, regnamein];
    return this.database.executeSql('INSERT INTO registers (id_register, regname, regcode, used_by_module, regnamede, regnamefr, regnamept, regnamees, regnamein) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
  }

  countRegisters(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM registers', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadRegistersData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='registers' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  // Regvalues

  restFetchRegvaluesLenth() {
    let link = 'https://survey.icertification.ch/ords/m/v_regvalues/?limit=1000&q={"nvalue":"5"}';

    return this.http.get(link, {}, {}).then(data => {
      let raw_data = JSON.parse(data.data);
      let raw = raw_data.items;

      let lenth: number = raw.length;
      return lenth;
    });
  }

  deleteRegvalues() {
    return this.database.executeSql('DELETE FROM regvalues', []);
  }

  addRegvalues(id_regvalue, id_register, nvalue, cvalue, cvaluede, cvaluefr, cvaluept, cvaluees, dvalue, created_by, created_date, modified_by, modified_date, sequence_nr, comm, active, deleted, cvaluesw, cvalueit, cvalueind, com, comment) {
    let data = [id_regvalue, id_register, nvalue, cvalue, cvaluede, cvaluefr, cvaluept, cvaluees, dvalue, created_by, created_date, modified_by, modified_date, sequence_nr, comm, active, deleted, cvaluesw, cvalueit, cvalueind, com, comment];
    return this.database.executeSql('INSERT INTO regvalues (id_regvalue, id_register, nvalue, cvalue, cvaluede, cvaluefr, cvaluept, cvaluees, dvalue, created_by, created_date, modified_by, modified_date, sequence_nr, comm, active, deleted, cvaluesw, cvalueit, cvalueind, com, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
  }

  countRegvalues(): Promise<any> {
    return this.database.executeSql('SELECT COUNT(*) AS total FROM regvalues', []).then(data => {
      return {
        total: data.rows.item(0).total
      }
    });
  }

  loadRegvaluesData(): Promise<any> {
    return this.database.executeSql("SELECT data_type, data_date, total_rows FROM data WHERE data_type ='regvalues' AND data_download=1 ORDER BY id_data DESC LIMIT 1", []).then(data => {
      return {
        data_type: data.rows.item(0).data_type,
        data_date: data.rows.item(0).data_date,
        total_rows: data.rows.item(0).total_rows
      }
    });
  }

  getScopes(): Observable<any[]> {
    return this.scopes.asObservable();
  }

  loadIssueScopes() {
    return this.database.executeSql('SELECT * FROM regvalues WHERE id_register = 306 order BY cvalue', []).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else
              if (value == 'fr') {
                cvalue = data.rows.item(i).cvaluefr;
              } else {
                cvalue = data.rows.item(i).cvalueind;
              }
          });

          reg_valuesList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            id_register: data.rows.item(i).id_register,
            nvalue: data.rows.item(i).nvalue,
            cvalue: cvalue,
            cvaluede: data.rows.item(i).cvaluede,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvaluept: data.rows.item(i).cvaluept,
            cvaluees: data.rows.item(i).cvaluees,
            dvalue: data.rows.item(i).dvalue
          });
        }
      }

      this.scopes.next(reg_valuesList);
    });
  }

  loadScopes(id_project) {
    return this.database.executeSql('SELECT * FROM task_scopes WHERE id_project = ?', [id_project]).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).desc_en;
            } else
              if (value == 'fr') {
                cvalue = data.rows.item(i).desc_fr;
              } else {
                cvalue = data.rows.item(i).desc_in;
              }
          });

          reg_valuesList.push({
            id_regvalue: data.rows.item(i).scope_id,
            cvalue: cvalue
          });
        }
      }

      this.scopes.next(reg_valuesList);
    });
  }

  getScopespartner(): Observable<any[]> {
    return this.scopes_partner.asObservable();
  }

  loadScopespartner(id_country: any, id_project: any, id_scope: any) {
    return this.database.executeSql('select id_contact, contact_code, contact_name from scope_partner where id_country=? and id_project=? and id_scope=?', [id_country, id_project, id_scope]).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          reg_valuesList.push({
            id_contact: data.rows.item(i).id_contact,
            contact_name: data.rows.item(i).contact_name,
            contact_code: data.rows.item(i).contact_code
          });
        }
      }

      this.scopes_partner.next(reg_valuesList);
    });
  }

  loadAllScopespartner(id_country) {
    return this.database.executeSql('select DISTINCT id_contact, contact_code, contact_name from scope_partner where id_country=?', [id_country]).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          reg_valuesList.push({
            id_contact: data.rows.item(i).id_contact,
            contact_name: data.rows.item(i).contact_name,
            contact_code: data.rows.item(i).contact_code
          });
        }
      }

      this.scopes_partner.next(reg_valuesList);
    });
  }

  getScopePartner(id_contact) {
    return this.database.executeSql('select id_contact, contact_code, contact_name from scope_partner where id_contact = ?', [id_contact]).then(data => {
      return {
        id_contact: data.rows.item(0).id_contact,
        contact_name: data.rows.item(0).contact_name,
        contact_code: data.rows.item(0).contact_code
      }
    });
  }

  getIssueCategories(): Observable<any[]> {
    return this.issue_category.asObservable();
  }

  loadIssueCategories(id_scope) {
    return this.database.executeSql('SELECT * FROM triggers_actions where topic_id=?', [id_scope]).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var trigger_name;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              trigger_name = data.rows.item(i).trigger_name_en;
            } else
              if (value == 'fr') {
                trigger_name = data.rows.item(i).trigger_name_fr;
              } else {
                trigger_name = data.rows.item(i).trigger_name_in;
              }
          });

          reg_valuesList.push({
            trigger_id: data.rows.item(i).trigger_id,
            topic_id: data.rows.item(i).topic_id,
            trigger_name: trigger_name
          });
        }
      }

      this.issue_category.next(reg_valuesList);
    });

    /*return this.database.executeSql('SELECT * FROM registers WHERE id_register>=307 and id_register<=320', []).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).regname;
            } else 
            if (value == 'fr') {
              cvalue = data.rows.item(i).regnamefr;
            } else {
              cvalue = data.rows.item(i).regnamein;
            }
          });

          reg_valuesList.push({
            id_register: data.rows.item(i).id_register,
            regname: data.rows.item(i).regname,
            regcode: data.rows.item(i).regcode,
            regnamefr: data.rows.item(i).regnamefr,
            regnamein: data.rows.item(i).regnamein,
            cvalue: cvalue,
          });
        }
      }

      this.issue_category.next(reg_valuesList);
    });
    */
  }


  getCategoryAction(): Observable<any[]> {
    return this.category_action.asObservable();
  }

  loadCategoryAction(id_regvalue, id_register) {
    return this.database.executeSql('select topic_id, topic_name, desc_en,  desc_fr,  desc_in, action_type_id, trigger_regvalue from certification_action where topic_id=? and trigger_id=?', [id_regvalue, id_register]).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var topic_desc;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              topic_desc = data.rows.item(i).desc_en;
            } else
              if (value == 'fr') {
                topic_desc = data.rows.item(i).desc_fr;
              } else {
                topic_desc = data.rows.item(i).desc_in;
              }
          });

          reg_valuesList.push({
            topic_id: data.rows.item(i).topic_id,
            topic_name: data.rows.item(i).topic_name,
            action_type_id: data.rows.item(i).action_type_id,
            trigger_regvalue: data.rows.item(i).trigger_regvalue,
            topic_desc: topic_desc
          });
        }
      }

      this.category_action.next(reg_valuesList);
    });
  }

  getCatAction(trigger_regvalue) {
    return this.database.executeSql('SELECT topic_id, topic_name, desc_en,  desc_fr,  desc_in, action_type_id, action_type_name, function_id, function_name, action_code, trigger_text, status_name FROM certification_action WHERE trigger_regvalue = ?', [trigger_regvalue]).then(data => {
      return {
        topic_id: data.rows.item(0).topic_id,
        topic_name: data.rows.item(0).topic_name,
        desc_en: data.rows.item(0).desc_en,
        desc_fr: data.rows.item(0).desc_fr,
        desc_in: data.rows.item(0).desc_in,
        action_type_id: data.rows.item(0).action_type_id,
        action_type_name: data.rows.item(0).action_type_name,
        function_id: data.rows.item(0).function_id,
        function_name: data.rows.item(0).function_name,
        action_code: data.rows.item(0).action_code,
        trigger_text: data.rows.item(0).trigger_text,
        status_name: data.rows.item(0).status_name
      }
    });
  }

  getSurveyScope(): Observable<any[]> {
    return this.scopes.asObservable();
  }

  loadSurveyScope() {
    return this.database.executeSql('SELECT * FROM regvalues WHERE  id_regvalue between 1080 and 1088 order by cvalue', []).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else
              if (value == 'fr') {
                cvalue = data.rows.item(i).cvaluefr;
              } else {
                cvalue = data.rows.item(i).cvalueind;
              }
          });

          reg_valuesList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            id_register: data.rows.item(i).id_register,
            nvalue: data.rows.item(i).nvalue,
            cvalue: cvalue,
            cvaluede: data.rows.item(i).cvaluede,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvaluept: data.rows.item(i).cvaluept,
            cvaluees: data.rows.item(i).cvaluees,
            dvalue: data.rows.item(i).dvalue
          });
        }
      }

      this.scopes.next(reg_valuesList);
    });
  }

  // Added the 16/03/2022 
  loadSurveyScope2(id_project: any) {
    return this.database.executeSql('SELECT DISTINCT scope_id, scope_name FROM project_task WHERE id_project =?', [id_project]).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          reg_valuesList.push({
            id_regvalue: data.rows.item(i).scope_name,
            cvalue: data.rows.item(i).scope_name
          });
        }
      }

      this.scopes.next(reg_valuesList);
    });
  }

  getScope(id_regvalue) {
    return this.database.executeSql('SELECT * FROM regvalues WHERE id_regvalue = ?', [id_regvalue]).then(data => {

      var cvalue;
      this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
        if (value == 'en') {
          cvalue = data.rows.item(0).cvalue;
        } else
          if (value == 'fr') {
            cvalue = data.rows.item(0).cvaluefr;
          } else {
            cvalue = data.rows.item(0).cvalueind;
          }
      });

      return {
        id_regvalue: data.rows.item(0).id_regvalue,
        id_register: data.rows.item(0).id_register,
        nvalue: data.rows.item(0).nvalue,
        cvalue: cvalue,
        cvaluede: data.rows.item(0).cvaluede,
        cvaluefr: data.rows.item(0).cvaluefr,
        cvaluept: data.rows.item(0).cvaluept,
        cvaluees: data.rows.item(0).cvaluees,
        dvalue: data.rows.item(0).dvalue
      }
    });
  }

  getRegisterId(id_regvalue): Promise<any> {
    return this.database.executeSql('SELECT id_register FROM regvalues WHERE id_regvalue = ?', [id_regvalue]).then(data => {
      return {
        id_register: data.rows.item(0).id_register
      }
    });
  }

  getAppearance(): Observable<any[]> {
    return this.appearance.asObservable();
  }

  loadAppearance() {
    return this.database.executeSql('SELECT * FROM regvalues WHERE  id_register=41 and nvalue=5 order by cvalue', []).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else
              if (value == 'fr') {
                cvalue = data.rows.item(i).cvaluefr;
              } else {
                cvalue = data.rows.item(i).cvalueind;
              }
          });

          reg_valuesList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            id_register: data.rows.item(i).id_register,
            nvalue: data.rows.item(i).nvalue,
            cvalue: cvalue,
            cvaluede: data.rows.item(i).cvaluede,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvaluept: data.rows.item(i).cvaluept,
            cvaluees: data.rows.item(i).cvaluees,
            dvalue: data.rows.item(i).dvalue
          });
        }
      }

      this.appearance.next(reg_valuesList);
    });
  }

  getFunction(): Observable<any[]> {
    return this.function.asObservable();
  }

  loadFunction() {
    return this.database.executeSql('SELECT * FROM regvalues WHERE  id_register=1 and nvalue=5 order by cvalue', []).then(data => {
      let reg_valuesList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else
              if (value == 'fr') {
                cvalue = data.rows.item(i).cvaluefr;
              } else {
                cvalue = data.rows.item(i).cvalueind;
              }
          });

          reg_valuesList.push({
            id_regvalue: data.rows.item(i).id_regvalue,
            id_register: data.rows.item(i).id_register,
            nvalue: data.rows.item(i).nvalue,
            cvalue: cvalue,
            cvaluede: data.rows.item(i).cvaluede,
            cvaluefr: data.rows.item(i).cvaluefr,
            cvaluept: data.rows.item(i).cvaluept,
            cvaluees: data.rows.item(i).cvaluees,
            dvalue: data.rows.item(i).dvalue
          });
        }
      }

      this.function.next(reg_valuesList);
    });
  }

  // Documents

  async toastAlert(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }

  getDocuments(): Observable<any[]> {
    return this.documents.asObservable();
  }

  saveDocData(id_contact: any, survey_unique_id: any, filename: any, description: any, doc_type: any, survey_id: any) {
    var m = new Date();
    let date = m.getUTCFullYear() + "/" + ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2) + " " + ("0" + m.getUTCHours()).slice(-2) + ":" + ("0" + m.getUTCMinutes()).slice(-2) + ":" + ("0" + m.getUTCSeconds()).slice(-2);

    this.geolocation.getCurrentPosition().then((resp) => {

      this.getNewId().then(val => {
        let data = [val.new_id, id_contact, survey_unique_id, date, doc_type, filename, resp.coords.latitude, resp.coords.longitude, resp.coords.accuracy, resp.coords.heading, resp.coords.altitudeAccuracy, description, 0, survey_id];

        return this.database.executeSql('INSERT INTO documnts (id_doc, agent_id, survey_unique_id, doc_date, doc_type, filename, coordx, coordy, accuracy, heading, altitude, description, sync, survey_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(_ => {
          this.toastAlert('Media successfuly saved.');
        });
      });

    }).catch((error) => { 
      this.translate.get('LOCATION_ERROR').subscribe(value => {
        this.presentAlert(value + JSON.stringify(error), 'Error');
      });
    });
  }

  countSurveyMedia(survey_id: any) {
    return this.database.executeSql('SELECT COUNT(*) AS tt_media FROM documnts WHERE survey_id = ?', [survey_id]).then(data => {
      return {
        tt_media: data.rows.item(0).tt_media 
      }
    });
  }

  getSurveyMedia(): Observable<any[]> {
    return this.survey_media.asObservable();
  }

  loadSurveyMedia(survey_id: any) {
    return this.database.executeSql('SELECT filename, description FROM documnts WHERE survey_id = ? AND doc_type = 154 ORDER BY doc_date DESC', [survey_id]).then(data => {
      let mediaList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          mediaList.push({
            filename: data.rows.item(i).filename,
            description: data.rows.item(i).description,
            photo: this.pathForImage(this.file.externalDataDirectory + 'icollect_survey/documents/' + data.rows.item(i).filename)
          });
        }
      }

      this.survey_media.next(mediaList);
    });
  }

  loadDocumentsSync() {
    this.documents.next([]);
    return this.database.executeSql('SELECT id_doc, doc_type, cloud_path, agent_id, survey_unique_id, filename, description, doc_date, sync, coordx, coordy, accuracy, heading, altitude, survey_id FROM documnts WHERE sync != 1 AND cloud_path IS NULL', []).then(data => {
      let purchase_docList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          let media_path;
          if (data.rows.item(i).cloud_path != null) {
            media_path = this.pathForImage(data.rows.item(i).cloud_path);
          } else {
            if (data.rows.item(i).doc_type == 157) {
              media_path = '../../assets/image/mp3.png';
            } else
              if (data.rows.item(i).doc_type == 155) {
                media_path = '../../assets/image/mp4.png';
              } else {
                let filePath = this.file.externalDataDirectory + 'icollect_survey/documents/' + data.rows.item(i).filename;
                media_path = this.pathForImage(filePath);
              }
          }

          purchase_docList.push({
            id_doc: data.rows.item(i).id_doc,
            filename: data.rows.item(i).filename,
            description: data.rows.item(i).description,
            doc_date: data.rows.item(i).doc_date,
            doc_type: data.rows.item(i).doc_type,
            sync: data.rows.item(i).sync,
            survey_unique_id: data.rows.item(i).survey_unique_id,
            coordx: data.rows.item(i).coordx,
            coordy: data.rows.item(i).coordy,
            accuracy: data.rows.item(i).accuracy,
            heading: data.rows.item(i).heading,
            agent_id: data.rows.item(i).agent_id,
            cloud_path: data.rows.item(i).cloud_path,
            altitude: data.rows.item(i).altitude,
            survey_id: data.rows.item(i).survey_id,
            photo: media_path
          });
        }
      }

      this.documents.next(purchase_docList);
    });
  }

  loadDocuments(survey_unique_id) {
    this.documents.next([]);
    return this.database.executeSql('SELECT id_doc, doc_type, cloud_path, agent_id, survey_unique_id, filename, description, doc_date, sync, coordx, coordy, accuracy, heading, altitude, survey_id FROM documnts WHERE survey_unique_id=?', [survey_unique_id]).then(data => {
      let purchase_docList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          let media_path;
          if (data.rows.item(i).cloud_path != null) {
            media_path = this.pathForImage(data.rows.item(i).cloud_path);
          } else {
            if (data.rows.item(i).doc_type == 157) {
              media_path = '../../assets/image/mp3.png';
            } else
              if (data.rows.item(i).doc_type == 155) {
                media_path = '../../assets/image/mp4.png';
              } else {
                let filePath = this.file.externalDataDirectory + 'icollect_survey/documents/' + data.rows.item(i).filename;
                media_path = this.pathForImage(filePath);
              }
          }

          purchase_docList.push({
            id_doc: data.rows.item(i).id_doc,
            filename: data.rows.item(i).filename,
            description: data.rows.item(i).description,
            doc_date: data.rows.item(i).doc_date,
            doc_type: data.rows.item(i).doc_type,
            sync: data.rows.item(i).sync,
            survey_unique_id: data.rows.item(i).survey_unique_id,
            coordx: data.rows.item(i).coordx,
            coordy: data.rows.item(i).coordy,
            accuracy: data.rows.item(i).accuracy,
            heading: data.rows.item(i).heading,
            agent_id: data.rows.item(i).agent_id,
            cloud_path: data.rows.item(i).cloud_path,
            altitude: data.rows.item(i).altitude,
            survey_id: data.rows.item(i).survey_id,
            photo: media_path
          });
        }
      }

      this.documents.next(purchase_docList);
    });
  }

  updateCloudLinkDocument(cloud_path, id_doc) {
    return this.database.executeSql('UPDATE documnts SET cloud_path=? WHERE id_doc=?', [cloud_path, id_doc]).then(() => {
      this.loadDocumentsSync();
    });
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  updateSyncDoc(sync, id_doc) {
    return this.database.executeSql('UPDATE documnts SET sync=? WHERE id_doc=?', [sync, id_doc]).then(() => {
      this.loadDocumentsSync();
    });
  }

  deleteDocument(id_doc) {
    return this.database.executeSql('DELETE FROM documnts WHERE id_doc=?', [id_doc]).then(() => {
      this.loadDocumentsSync();
    });
  }

  loadDocumentsTypes(doc_type) {
    return this.database.executeSql('SELECT id_doc, doc_type, cloud_path, agent_id, survey_unique_id, filename, description, doc_date, sync, coordx, coordy, accuracy, heading FROM documnts WHERE doc_type = ?', [doc_type]).then(data => {
      let purchase_docList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          let media_path;
          if (data.rows.item(i).cloud_path != null) {
            media_path = this.pathForImage(data.rows.item(i).cloud_path);
          } else {
            let filePath = this.file.externalDataDirectory + 'icollect_survey/documents/' + data.rows.item(i).filename;
            media_path = this.pathForImage(filePath);
          }

          purchase_docList.push({
            id_doc: data.rows.item(i).id_doc,
            filename: data.rows.item(i).filename,
            description: data.rows.item(i).description,
            doc_date: data.rows.item(i).doc_date,
            doc_type: data.rows.item(i).doc_type,
            sync: data.rows.item(i).sync,
            survey_unique_id: data.rows.item(i).survey_unique_id,
            coordx: data.rows.item(i).coordx,
            coordy: data.rows.item(i).coordy,
            accuracy: data.rows.item(i).accuracy,
            heading: data.rows.item(i).heading,
            agent_id: data.rows.item(i).agent_id,
            cloud_path: data.rows.item(i).cloud_path,
            photo: media_path
          });
        }
      }

      this.documents.next(purchase_docList);
    });
  }


  // Count 

  getNumberSurvey(id_contact) {
    return this.database.executeSql('SELECT count(DISTINCT survey_unique_id) tt_survey FROM sv_results WHERE survey = 1 AND id_agent = ?', [id_contact]).then(data => {
      return {
        total: data.rows.item(0).tt_survey
      }
    });
  }

  getNumberIssue(id_contact) {
    return this.database.executeSql('SELECT count(DISTINCT survey_unique_id) tt_issue FROM sv_results WHERE issue = 1 AND id_agent = ?', [id_contact]).then(data => {
      return {
        total: data.rows.item(0).tt_issue
      }
    });
  }

  getResults(): Observable<any[]> {
    return this.results.asObservable();
  }

  loadSurveyResults(id_contact: any) {
    this.results.next([]);

    return this.database.executeSql('SELECT COUNT(*) AS total, regvalues.cvalue, regvalues.cvalueind, regvalues.cvaluefr, sv_results.survey_unique_id, sv_results.created_date, towns.code_town, scope_partner.contact_code, sv_results.scope_id, sv_results.partner_id FROM sv_results, regvalues, towns, scope_partner WHERE regvalues.id_regvalue = sv_results.scope_id AND towns.gid_town = sv_results.town_id AND scope_partner.id_contact = sv_results.partner_id AND scope_partner.id_scope = sv_results.scope_id AND scope_partner.id_project = sv_results.project_id AND sv_results.id_agent = ? AND sv_results.survey = 1 GROUP BY survey_unique_id ORDER BY sv_results.created_date DESC', [id_contact]).then(data => {
      let answerList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else
              if (value == 'fr') {
                cvalue = data.rows.item(i).cvaluefr;
              } else {
                cvalue = data.rows.item(i).cvalueind;
              }
          });

          answerList.push({
            cvalue: cvalue,
            cvalueind: data.rows.item(i).cvalueind,
            cvaluefr: data.rows.item(i).cvaluefr,
            total: data.rows.item(i).total,
            code_town: data.rows.item(i).code_town,
            contact_code: data.rows.item(i).contact_code,
            created_date: data.rows.item(i).created_date,
            survey_unique_id: data.rows.item(i).survey_unique_id,
            scope_id: data.rows.item(i).scope_id,
            partner_id: data.rows.item(i).partner_id
          });
        }
      }

      this.results.next(answerList);
    });
  }

  loadSurveyResultsByScope(id_contact: any, scope_id: any) {
    this.results.next([]);

    return this.database.executeSql('SELECT COUNT(*) AS total, regvalues.cvalue, regvalues.cvalueind, regvalues.cvaluefr, sv_results.survey_unique_id, sv_results.created_date, towns.code_town, scope_partner.contact_code, sv_results.scope_id, sv_results.partner_id FROM sv_results, regvalues, towns, scope_partner WHERE regvalues.id_regvalue = sv_results.scope_id AND towns.gid_town = sv_results.town_id AND scope_partner.id_contact = sv_results.partner_id AND scope_partner.id_scope = sv_results.scope_id AND scope_partner.id_project = sv_results.project_id AND sv_results.id_agent = ? AND sv_results.survey = 1 AND sv_results.scope_id = ? GROUP BY survey_unique_id ORDER BY sv_results.created_date DESC', [id_contact, scope_id]).then(data => {
      let answerList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else
              if (value == 'fr') {
                cvalue = data.rows.item(i).cvaluefr;
              } else {
                cvalue = data.rows.item(i).cvalueind;
              }
          });

          answerList.push({
            cvalue: cvalue,
            cvalueind: data.rows.item(i).cvalueind,
            cvaluefr: data.rows.item(i).cvaluefr,
            total: data.rows.item(i).total,
            code_town: data.rows.item(i).code_town,
            contact_code: data.rows.item(i).contact_code,
            created_date: data.rows.item(i).created_date,
            survey_unique_id: data.rows.item(i).survey_unique_id,
            scope_id: data.rows.item(i).scope_id,
            partner_id: data.rows.item(i).partner_id
          });
        }
      }

      this.results.next(answerList);
    });
  }

  loadSurveyResultsByParter(id_contact: any, partner_id: any) {
    this.results.next([]);

    return this.database.executeSql('SELECT COUNT(*) AS total, regvalues.cvalue, regvalues.cvalueind, regvalues.cvaluefr, sv_results.survey_unique_id, sv_results.created_date, towns.code_town, scope_partner.contact_code, sv_results.scope_id, sv_results.partner_id FROM sv_results, regvalues, towns, scope_partner WHERE regvalues.id_regvalue = sv_results.scope_id AND towns.gid_town = sv_results.town_id AND scope_partner.id_contact = sv_results.partner_id AND scope_partner.id_scope = sv_results.scope_id AND scope_partner.id_project = sv_results.project_id AND sv_results.id_agent = ? AND sv_results.survey = 1 AND sv_results.partner_id = ? GROUP BY survey_unique_id ORDER BY sv_results.created_date DESC', [id_contact, partner_id]).then(data => {
      let answerList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else
              if (value == 'fr') {
                cvalue = data.rows.item(i).cvaluefr;
              } else {
                cvalue = data.rows.item(i).cvalueind;
              }
          });

          answerList.push({
            cvalue: cvalue,
            cvalueind: data.rows.item(i).cvalueind,
            cvaluefr: data.rows.item(i).cvaluefr,
            total: data.rows.item(i).total,
            code_town: data.rows.item(i).code_town,
            contact_code: data.rows.item(i).contact_code,
            created_date: data.rows.item(i).created_date,
            survey_unique_id: data.rows.item(i).survey_unique_id,
            scope_id: data.rows.item(i).scope_id,
            partner_id: data.rows.item(i).partner_id
          });
        }
      }

      this.results.next(answerList);
    });
  }


  getDetails(): Observable<any[]> {
    return this.details.asObservable();
  }

  getSurveyDetails(survey_unique_id) {
    return this.database.executeSql('SELECT sv_results.created_date, sv_results.survey_unique_id, sv_results.question_id, sv_results.text_answer, project_task.desc_en, project_task.desc_fr, project_task.desc_in FROM sv_results, project_task WHERE project_task.id_task = sv_results.question_id AND sv_results.survey = 1 AND sv_results.survey_unique_id = ?', [survey_unique_id]).then(data => {
      let answerList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).desc_en;
            } else
              if (value == 'fr') {
                cvalue = data.rows.item(i).desc_fr;
              } else {
                cvalue = data.rows.item(i).desc_in;
              }
          });

          answerList.push({
            cvalue: cvalue,
            text_answer: data.rows.item(i).text_answer,
            created_date: data.rows.item(i).created_date,
            survey_unique_id: data.rows.item(i).survey_unique_id
          });
        }
      }

      this.details.next(answerList);
    });
  }

  loadIssueResults(id_contact) {
    return this.database.executeSql('SELECT COUNT(*) AS total, regvalues.cvalue, regvalues.cvalueind, regvalues.cvaluefr, sv_results.created_date, sv_results.survey_unique_id, towns.code_town, scope_partner.contact_code FROM sv_results, regvalues, towns, scope_partner WHERE regvalues.id_regvalue = sv_results.scope_id AND towns.gid_town = sv_results.town_id AND scope_partner.id_contact = sv_results.partner_id AND scope_partner.id_scope = sv_results.scope_id AND scope_partner.id_project = sv_results.project_id AND sv_results.id_agent = ? AND sv_results.issue = 1 GROUP BY survey_unique_id ORDER BY sv_results.created_date DESC', [id_contact]).then(data => {
      let answerList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else
              if (value == 'fr') {
                cvalue = data.rows.item(i).cvaluefr;
              } else {
                cvalue = data.rows.item(i).cvalueind;
              }
          });

          answerList.push({
            cvalue: cvalue,
            cvalueind: data.rows.item(i).cvalueind,
            cvaluefr: data.rows.item(i).cvaluefr,
            total: data.rows.item(i).total,
            code_town: data.rows.item(i).code_town,
            contact_code: data.rows.item(i).contact_code,
            created_date: data.rows.item(i).created_date,
            survey_unique_id: data.rows.item(i).survey_unique_id
          });
        }
      }

      this.results.next(answerList);
    });
  }

  getUniqueResults(survey_unique_id: any) {
    return this.database.executeSql('SELECT survey_response_id, action_type_id, question_id, criteria_id, project_id, scope_id, partner_id, town_id, country_id, a_list_number, a_number, sv_answers_def_id, created_date, id_agent, created_by, coordx, coordy, accuracy, comment, completed, completed_date, issue_id, sync_to_server, sync_to_server_date, action_item, action_status, id_action, media, start_timestamp, end_timestamp, date_answer, number_answer, text_answer, grade_answer, yes_no_answer, list_answer, multiple_answer, survey, issue, survey_unique_id, function_id, appearance_id, organisation, sv_answer_type_id FROM sv_results WHERE survey_unique_id = ?',[survey_unique_id]).then(data => {
      return {
        survey_response_id: data.rows.item(0).survey_response_id, 
        action_type_id: data.rows.item(0).action_type_id, 
        question_id: data.rows.item(0).question_id, 
        criteria_id: data.rows.item(0).criteria_id, 
        project_id: data.rows.item(0).project_id, 
        scope_id: data.rows.item(0).scope_id, 
        partner_id: data.rows.item(0).partner_id, 
        town_id: data.rows.item(0).town_id, 
        country_id: data.rows.item(0).country_id, 
        a_list_number: data.rows.item(0).a_list_number, 
        a_number: data.rows.item(0).a_number, 
        sv_answers_def_id: data.rows.item(0).sv_answers_def_id, 
        created_date: data.rows.item(0).created_date, 
        id_agent: data.rows.item(0).id_agent, 
        created_by: data.rows.item(0).created_by, 
        coordx: data.rows.item(0).coordx, 
        coordy: data.rows.item(0).coordy, 
        accuracy: data.rows.item(0).accuracy, 
        comment: data.rows.item(0).comment, 
        completed: data.rows.item(0).completed, 
        completed_date: data.rows.item(0).completed_date, 
        issue_id: data.rows.item(0).issue_id, 
        sync_to_server: data.rows.item(0).sync_to_server, 
        sync_to_server_date: data.rows.item(0).sync_to_server_date, 
        action_item: data.rows.item(0).action_item, 
        action_status: data.rows.item(0).action_status, 
        id_action: data.rows.item(0).id_action, 
        media: data.rows.item(0).media, 
        start_timestamp: data.rows.item(0).start_timestamp, 
        end_timestamp: data.rows.item(0).end_timestamp, 
        date_answer: data.rows.item(0).date_answer, 
        number_answer: data.rows.item(0).number_answer, 
        text_answer: data.rows.item(0).text_answer, 
        grade_answer: data.rows.item(0).grade_answer, 
        yes_no_answer: data.rows.item(0).yes_no_answer, 
        list_answer: data.rows.item(0).list_answer, 
        multiple_answer: data.rows.item(0).multiple_answer, 
        survey: data.rows.item(0).survey, 
        issue: data.rows.item(0).issue, 
        survey_unique_id: data.rows.item(0).survey_unique_id, 
        function_id: data.rows.item(0).function_id, 
        appearance_id: data.rows.item(0).appearance_id, 
        organisation: data.rows.item(0).organisation, 
        sv_answer_type_id: data.rows.item(0).sv_answer_type_id
      }
    });
  }

  // Not Sync Answers

  getNotSyncedAns(): Observable<any[]> {
    return this.notSyncAns.asObservable();
  }

  answersNotSynced() {
    return this.database.executeSql('SELECT *, sv_results.created_date, sv_results.created_by, sv_results.comment AS sv_comment FROM sv_results, regvalues WHERE regvalues.id_regvalue = sv_results.scope_id AND sync_to_server = 0', []).then(data => {
      let answerList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var cvalue;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              cvalue = data.rows.item(i).cvalue;
            } else
              if (value == 'fr') {
                cvalue = data.rows.item(i).cvaluefr;
              } else {
                cvalue = data.rows.item(i).cvalueind;
              }
          });

          answerList.push({
            cvalue: cvalue,
            cvalueind: data.rows.item(i).cvalueind,
            cvaluefr: data.rows.item(i).cvaluefr,
            created_date: data.rows.item(i).created_date,
            action_type_id: data.rows.item(i).action_type_id,
            survey: data.rows.item(i).survey,
            issue: data.rows.item(i).issue,
            survey_response_id: data.rows.item(i).survey_response_id,
            question_id: data.rows.item(i).question_id,
            criteria_id: data.rows.item(i).criteria_id,
            project_id: data.rows.item(i).project_id,
            scope_id: data.rows.item(i).scope_id,
            partner_id: data.rows.item(i).partner_id,
            town_id: data.rows.item(i).town_id,
            country_id: data.rows.item(i).country_id,
            a_list_number: data.rows.item(i).a_list_number,
            a_number: data.rows.item(i).a_number,
            sv_answers_def_id: data.rows.item(i).sv_answers_def_id,
            id_agent: data.rows.item(i).id_agent,
            created_by: data.rows.item(i).created_by,
            coordx: data.rows.item(i).coordx,
            coordy: data.rows.item(i).coordy,
            accuracy: data.rows.item(i).accuracy,
            comment: data.rows.item(i).sv_comment, 
            completed: data.rows.item(i).completed,
            completed_date: data.rows.item(i).completed_date, 
            issue_id: data.rows.item(i).issue_id,
            start_timestamp: data.rows.item(i).start_timestamp,
            end_timestamp: data.rows.item(i).end_timestamp,
            date_answer: data.rows.item(i).date_answer,
            number_answer: data.rows.item(i).number_answer,
            text_answer: data.rows.item(i).text_answer,
            grade_answer: data.rows.item(i).grade_answer,
            yes_no_answer: data.rows.item(i).yes_no_answer,
            list_answer: data.rows.item(i).list_answer,
            multiple_answer: data.rows.item(i).multiple_answer,
            survey_unique_id: data.rows.item(i).survey_unique_id,
            action_item: data.rows.item(i).action_item,
            action_status: data.rows.item(i).action_status, 
            id_action: data.rows.item(i).id_action,
            function_id: data.rows.item(i).function_id,
            appearance_id: data.rows.item(i).appearance_id,
            organisation: data.rows.item(i).organisation,
            sv_answer_type_id: data.rows.item(i).sv_answer_type_id
          });
        }
      }

      this.notSyncAns.next(answerList);
    });
  }

  updateAnsSync(survey_response_id, sync_to_server_date) {
    return this.database.executeSql('UPDATE sv_results SET sync_to_server=1, sync_to_server_date=? WHERE survey_response_id = ?', [sync_to_server_date, survey_response_id]).then(data => {

    });
  }

  // Survevy Data for all questions 

  getSurveyData(): Observable<any[]> {
    return this.survey_data.asObservable();
  }

  addSurveyData(id_project: any, id_scope: any, id_partner: any, id_appearance: any, id_function: any, question_id: any, survey_unique_id: any, town_id: any, organisation: any) {
    let data = [id_project, id_scope, id_partner, id_appearance, id_function, question_id, survey_unique_id, town_id, organisation];
    return this.database.executeSql('INSERT INTO survey_data (id_project, id_scope, id_partner, id_appearance, id_function, question_id, survey_unique_id, town_id, organisation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(() => {
      
    });
  }

  addSurveyDataAnswer(text_answer: any, question_id: any, survey_unique_id: any) { 
    return this.database.executeSql('UPDATE survey_data SET text_answer=? WHERE question_id=? AND survey_unique_id=?', [text_answer, question_id, survey_unique_id]);
  }

  getSavedSurvey(id_project: any, id_scope: any, id_partner: any, id_appearance: any, id_function: any, survey_unique_id: any) {
    return this.database.executeSql('SELECT project_task.id_task, project_task.survey_id, project_task.scope_id, project_task.id_criteria, project_task.sequence, project_task.sv_answer_type_id, project_task.media_yn, project_task.answerlist_id, project_task.desc_in, project_task.desc_fr, project_task.desc_en, survey_data.text_answer, survey_data.id_project, survey_data.id_scope, survey_data.id_partner, survey_data.id_appearance, survey_data.id_function, survey_data.survey_unique_id FROM project_task LEFT JOIN survey_data ON survey_data.question_id = project_task.id_task WHERE survey_data.id_project=? AND survey_data.id_scope=? AND survey_data.id_partner=? AND survey_data.id_appearance=? AND survey_data.id_function=? AND survey_data.survey_unique_id=? GROUP BY survey_data.question_id ORDER BY project_task.sequence', [id_project, id_scope, id_partner, id_appearance, id_function, survey_unique_id]).then(data => {
      let questionList: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          var question;
          this.translate.get('CURRENT_LANGUAGE').subscribe(value => {
            if (value == 'en') {
              question = data.rows.item(i).desc_en;
            } else
              if (value == 'fr') {
                question = data.rows.item(i).desc_fr;
              } else {
                question = data.rows.item(i).desc_in;
              }
          });

          questionList.push({
            id_task: data.rows.item(i).id_task,
            survey_id: data.rows.item(i).survey_id,
            id_criteria: data.rows.item(i).id_criteria,
            scope_id: data.rows.item(i).scope_id,
            sequence: data.rows.item(i).sequence,
            sv_answer_type_id: data.rows.item(i).sv_answer_type_id,
            media_yn: data.rows.item(i).media_yn,
            answerlist_id: data.rows.item(i).answerlist_id,
            text_answer: data.rows.item(i).text_answer,
            survey_unique_id: data.rows.item(i).survey_unique_id,
            question: question
          });
        }
      }

      this.survey_data.next(questionList);
    });
  }

  checkSavedSurvey(id_project: any, id_scope: any, id_partner: any, id_appearance: any, id_function: any, survey_unique_id: any) {
    return this.database.executeSql('SELECT count(*) tt_survey, COUNT(CASE WHEN text_answer IS NOT NULL THEN 1 END) AS tt_reponse FROM survey_data WHERE id_project = ? AND id_scope = ? AND id_partner = ? AND id_appearance = ? AND id_function = ? AND survey_unique_id = ?', [id_project, id_scope, id_partner, id_appearance, id_function, survey_unique_id]).then(data => {
      return {
        total: data.rows.item(0).tt_survey,
        reponse: data.rows.item(0).tt_reponse
      }
    });
  }

  countSurveyQestions(survey_unique_id: any) {
    return this.database.executeSql('SELECT count(*) AS total_question from survey_data where survey_unique_id = ?', [survey_unique_id]).then(data => {
      return {
        total_question: data.rows.item(0).total_question
      }
    });
  }

  countSurveyAnswers(survey_unique_id: any) {
    return this.database.executeSql('SELECT count(*) AS total_answer from survey_data where survey_unique_id = ? AND text_answer is not NULL', [survey_unique_id]).then(data => {
      return {
        total_answer: data.rows.item(0).total_answer
      }
    });
  }

  getSurveySavedData(survey_unique_id: any) {
    return this.database.executeSql('SELECT id_project, id_scope, id_partner, id_appearance, id_function, town_id, organisation FROM survey_data WHERE survey_unique_id = ? GROUP BY id_project', [survey_unique_id]).then(data => {
      return {
        id_project: data.rows.item(0).id_project,
        id_scope: data.rows.item(0).id_scope,
        id_partner: data.rows.item(0).id_partner,
        id_appearance: data.rows.item(0).id_appearance,
        id_function: data.rows.item(0).id_function,
        town_id: data.rows.item(0).town_id,
        organisation: data.rows.item(0).organisation
      }
    });
  }

} 
