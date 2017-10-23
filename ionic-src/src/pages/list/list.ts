import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth/auth';
import { ListProvider } from '../../providers/list/list';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  user: Object;

  newItem: String;

  myList: Object[];

  othersList: Object[];

  loading: Boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private authProvider: AuthProvider,
    private listProvider: ListProvider
  ) {
    this.loading = true;
    if (this.authProvider.loggedIn() || 1) { // TODO: Set user loggedIn function (JWT problem)
      this.storage.get('user').then((user) => {
        if (user != null) {

          this.user = JSON.parse(user);

          this.getMyList();

          this.getOthersList();

          this.loading = false;

        } else {
          this.navCtrl.setRoot(LoginPage);
        }
      });
    } else {
      this.navCtrl.setRoot(LoginPage);
    }
  }

  getMyList() {
    this.listProvider.getMyList().subscribe(data => {
      this.myList = data.list;
    });
  }

  getOthersList() {
    this.listProvider.getOthersList().subscribe(data => {
      this.othersList = data.users;
    });
  }

  addItem() {
    this.listProvider.addItem({ item: this.newItem }).subscribe(data => {
      this.newItem = "";
      this.getMyList();
    });
  }

  deleteItem(item) {
    this.listProvider.deleteItem(item._id).subscribe(data => {
      if (data.status) {
        var index = this.myList.indexOf(item);
        this.myList.splice(index, 1);
      }
    });
  }

  reloadPage() {
    console.log("Reload");
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  logout() {
    this.authProvider.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}
