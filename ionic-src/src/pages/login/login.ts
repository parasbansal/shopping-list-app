import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { RegisterPage } from "../register/register";
import { ListPage } from "../list/list";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: String;
  password: String;

  error: String;
  loading: Boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.loading = false;
  }

  loginForm() {
    this.loading = true;
    let user = {
      username: this.username,
      password: this.password
    }

    this.authProvider.authenticateUser(user).subscribe(data => {
      if (data.success) {
        this.authProvider.storeUserData(data.token, data.user);
        this.navCtrl.setRoot(ListPage);
      } else {
        this.error = data.message;
      }
      this.loading = false;
    });

  }

  goToRegisterPage() {
    this.navCtrl.setRoot(RegisterPage, {}, { animate: true, direction: 'forward' });
  }

}
