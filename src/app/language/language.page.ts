import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    private db: DatabaseService
  ) { }

  ngOnInit() { 
    this.db.getDatabaseState().subscribe(ready => { 
      if(ready) {
        this.db.lastLogedUser().then(usr => { 
          if(usr.save_login==1){
            this.translate.use(usr.lang);

            let data = {
              lang : usr.lang,
              username : usr.username,
              save_login: usr.save_login
            };
        
            this.navCtrl.navigateRoot(['login', data]);
          }
        });
      }
    });
  }

  changeLanguage(event) { 
    this.translate.use(event.detail.value);
    let data = {
      lang: event.detail.value
    };

    this.navCtrl.navigateRoot(['login', data]);
  }
}
