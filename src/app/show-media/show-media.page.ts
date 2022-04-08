import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-show-media',
  templateUrl: './show-media.page.html',
  styleUrls: ['./show-media.page.scss'],
})
export class ShowMediaPage implements OnInit {

  videopath: any;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.videopath = this.navParams.get('link');
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
