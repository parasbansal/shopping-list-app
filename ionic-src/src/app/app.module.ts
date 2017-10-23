import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
// import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { MyApp } from './app.component';
// import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { ListProvider } from '../providers/list/list';


// export function getAuthHttp(http, storage) {
//   return new AuthHttp(new AuthConfig({
//     headerPrefix: 'JWT',
//     noJwtError: true,
//     globalHeaders: [{ 'Accept': 'application/json' }],
//     tokenGetter: (() => storage.get('token').then((token: string) => token)),
//   }), http);
// }


@NgModule({
  declarations: [
    MyApp,
    // HomePage,
    ListPage,
    RegisterPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // HomePage,
    ListPage,
    RegisterPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    ListProvider
  ]
})
export class AppModule { }
