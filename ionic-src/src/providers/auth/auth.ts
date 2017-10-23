import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthProvider {

  // root = "https://secure-beyond-48241.herokuapp.com/users/";
  root = "localhost:3000";
  authToken: any;
  user: any;

  constructor(
    public http: Http,
    private storage: Storage
  ) {
    console.log('Hello AuthProvider Provider');
    this.storage.get('user').then((val) => {
      this.user = JSON.parse(val);
    });
  }

  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.root + 'register', user, { headers: headers })
      .map(res => res.json());
  }

  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.root + 'authenticate', user, { headers: headers })
      .map(res => res.json());
  }

  storeUserData(token, user) {
    this.storage.set('token', token);
    this.storage.set('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    return this.storage.get('token').then((val) => {
      this.authToken = val;
      return val;
    });
  }

  loggedIn() {
    return tokenNotExpired('/_ionickv/token');
  }

  logout() {
    this.authToken = null;
    this.user = null;
    this.storage.remove('token');
    this.storage.remove('user');
  }

}
