import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from "../login/login";
import { ListPage } from "../list/list";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  username: String;
  password: String;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  registerForm() {
    let user = {
      username: this.username,
      password: this.password
    }

    this.authProvider.registerUser(user).subscribe(data => {
      if (data.success) {
        this.authProvider.storeUserData(data.token, data.user);
        this.navCtrl.push(ListPage);
      } else {
        console.log("Something went Wrong!");
      }
    });

  }

  goToLoginPage() {
    this.navCtrl.setRoot(LoginPage, {}, { animate: true, direction: 'forward' });
  }


}
