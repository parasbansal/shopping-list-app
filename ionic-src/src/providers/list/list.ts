import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';

@Injectable()
export class ListProvider {
  // root = "https://secure-beyond-48241.herokuapp.com/users/";
  root = "localhost:3000";
  authToken: any;

  constructor(
    public http: Http,
    private storage: Storage
  ) {
    console.log('Hello ListProvider Provider');
    this.storage.get('token').then((token) => {
      this.authToken = token;
    });
  }

  getMyList() {
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.root + 'getUserList', { headers: headers })
      .map(res => res.json());
  }

  addItem(newItem) {
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.root + 'additem', newItem, { headers: headers })
      .map(res => res.json());
  }

  getOthersList() {
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.root + 'othersList', { headers: headers })
      .map(res => res.json());
  }

  deleteItem(itemId) {
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.root + 'deleteItem/' + itemId, { headers: headers })
      .map(res => res.json());
  }

}


