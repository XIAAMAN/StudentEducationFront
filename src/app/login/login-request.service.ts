import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NotificationService} from '../utils/notification.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginRequestService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private loginUrl: string;
  constructor(private http: HttpClient, private notify: NotificationService, private router: Router) { }
  post请求
  public init(user: { password: string; userName: string }): void {
    this.http.post('apidata/login',
      {
        userName: user.userName,
        userPassword: user.password}, this.httpOptions)
      .subscribe(res => {
        if ( res === 200) {
          window.sessionStorage.setItem('userName', user.userName);
          this.router.navigateByUrl('/home');
          this.notify.showSuccess(user.userName + '  登录成功');
        }
      });
    // return this.state;
  }
  // get请求
  // public init(user: { password: string; userName: string }): void {
  //   this.loginUrl = 'apidata/login?userName=' + user.userName + '&password=' + user.password;
  //   this.http.get(this.loginUrl).subscribe(res => {
  //     if ( res === 200) {
  //       window.sessionStorage.setItem('userName', user.userName);
  //       this.router.navigateByUrl('/home');
  //       this.notify.showSuccess(user.userName + '  登录成功');
  //     }
  //   });
  // }
}
